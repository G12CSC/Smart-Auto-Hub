from uuid import uuid4

from app.database.db import pool
from app.utils.logger import get_logger
from app.core.embeddings import embed_texts
from app.utils.util import chunk_text

from typing import List

logger = get_logger(__name__)

#-------------------------------------------
# Load raw data from the database
#-------------------------------------------

def load_cars() -> List[dict]:
    try:
        with pool.connection() as conn:
            rows = conn.execute(
                """
                SELECT id, brand, model, price, year, mileage, condition,
                       edition, transmission, "bodyType", "fuelType",
                       "engineCapacity", location
                FROM "Car"
                """
            ).fetchall()

        if not rows:
            logger.warning("No any car record inside the table")
            return []

        logger.info(f"load {len(rows)} car records")
        return rows

    except Exception as e:
        logger.error("Failed to ingest car data from the database")
        raise RuntimeError("Unable to retrieve data from the database") from e
    
    
#--------------------------------------------
# Convert raw data to text format
#--------------------------------------------

def raw_car_data_to_text(car: dict) -> str:
    """
    This function is implement cause easy to symantic search not for numeric search.
    """
    return(
        f"{car['brand']} {car['model']} {car['year']}. "
        f"{car['fuelType']} {car['transmission']} {car['bodyType']} car. "
        f"Price {car['price'] / 1_000_000:.1f} million LKR. "
        f"Condition {car['condition']}. "
        f"Located in {car['location']}, Sri Lanka."
    )
    

#---------------------------------------------
# Embed the texts and store
#---------------------------------------------

def ingest_cars(cars: List[dict]) -> None:
    
    if not cars:
        logger.warning("No cars provided for ingestion")
        return
    
    row = []
    
    for car in cars:
        meaningful_car_text = raw_car_data_to_text(car) 
        chunks = chunk_text(meaningful_car_text)
        
        if not chunks:
            continue
        
        embedding = embed_texts(chunks) 

        for idx, (chunk, embed) in enumerate(zip(chunks, embedding)):
            row.append({
                "id" : str(uuid4()),
                "car_id" : car['id'],
                "chunk_index" : idx,
                "content" : chunk,
                "embedding" : embed   
            })
            
    if not row:
        logger.warning("No vector rows produced for ingestion")
        return

    upsert_sql = """
        INSERT INTO car_vector (id, car_id, chunk_index, content, embedding)
        VALUES (%(id)s, %(car_id)s, %(chunk_index)s, %(content)s, %(embedding)s)
        ON CONFLICT (car_id, chunk_index)
        DO UPDATE SET
            content = EXCLUDED.content,
            embedding = EXCLUDED.embedding
    """

    try:
        with pool.connection() as conn:
            with conn.cursor() as cur:
                cur.executemany(upsert_sql, row)
        logger.info(f"Successfully upsert {len(row)} to the data to the [car_vector] table")
        
    except Exception as e:
        logger.exception("Failed to upsert car vectors")
        raise
    

cars = load_cars()
ingest_cars(cars)
        