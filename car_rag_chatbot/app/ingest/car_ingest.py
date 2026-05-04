from app.database.azure_database import get_engine
from app.utils.logger import get_logger
from app.core.embeddings import embed_texts
from app.utils.util import chunk_text

from typing import List
from sqlalchemy import text

logger = get_logger(__name__)
engine = get_engine()


# -------------------------------------------
# Load raw data from the database
# -------------------------------------------
def load_cars() -> List[dict]:

    query = text("""
        SELECT id, brand, model, Edition, year_of_manufacture,
               condition, transmission, fuel_type,
               Engine_capacity, mileage, warranty, price
        FROM Car
    """)

    with engine.connect() as conn:
        result = conn.execute(query)
        cars = result.mappings().all()

    if not cars:
        logger.warning("No car records found")
        return []

    logger.info(f"Loaded {len(cars)} car records")
    return cars


# -------------------------------------------
# Convert structured car data → text
# -------------------------------------------
def raw_car_data_to_text(car: dict) -> str:

    engine_capacity = car["Engine_capacity"] or "Unknown"
    warranty = car["warranty"] or "None"

    return (
        f"{car['brand']} {car['model']} {car['Edition']} "
        f"manufactured in {car['year_of_manufacture']}. "
        f"{car['fuel_type']} engine with {engine_capacity} capacity, "
        f"{car['transmission']} transmission. "
        f"Condition: {car['condition']}. "
        f"Mileage: {car['mileage']} km. "
        f"Warranty: {warranty}. "
        f"Price: {car['price'] / 1_000_000:.2f} million LKR."
    )


# -------------------------------------------
# Embed and insert vectors
# -------------------------------------------
def ingest_cars(cars: List[dict]) -> None:

    if not cars:
        logger.warning("No cars provided for ingestion")
        return

    try:

        with engine.begin() as conn:

            for car in cars:
                car_text = raw_car_data_to_text(car)
                chunks = chunk_text(car_text)
                
                if not chunks:
                    continue

                embeddings = embed_texts(chunks)

                for idx, (chunk, embed) in enumerate(zip(chunks, embeddings)):
                    vector_string = "[" + ",".join(map(str, embed)) + "]"
                    
                    sql = f"""
                    INSERT INTO CarVectors (car_id, chunk_index, chunk_text, embedding)
                    VALUES (
                        {car['id']},
                        {idx},
                        :chunk_text,
                        CAST('{vector_string}' AS VECTOR(384))
                    )
                    """

                    conn.execute(text(sql), {
                        "chunk_text": chunk
                    })

        logger.info("Successfully inserted car vectors")

    except Exception:
        logger.exception("Failed to insert car vectors")
        raise


# -------------------------------------------
# Run ingestion pipeline
# -------------------------------------------

cars = load_cars()
ingest_cars(cars)