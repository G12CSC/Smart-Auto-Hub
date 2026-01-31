from app.database.supabase_client import supabase_client
from app.utils.logger import get_logger
from app.core.embeddings import embed_texts
from app.utils.util import chunk_text

from typing import List

logger = get_logger(__name__)

#-------------------------------------------
# Load raw data from the database
#-------------------------------------------

def load_cars():
    try:
        response = (
            supabase_client.table("Car")
            .select("id, brand, model, price, year, mileage, condition, edition, transmission, bodyType, fuelType, engineCapacity, location")
            .execute()
        )
        
        if not response.data:
            logger.warning("No any car record inside the table")
            return []
             
        logger.info(f"load {len(response.data)} car records")
        return response.data
    
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
    
    for car in len(cars):
        meaningful_car_text = raw_car_data_to_text(car) 
        chunks = chunk_text(meaningful_car_text)
        
        if not chunks:
            continue
        
        embedding = embed_texts(chunks)

        for idx, chunk, embed in enumerate(zip(chunks, embedding)):
            row.append({
                "car_id" : cars[id],
                "chunk_index" : idx,
                "content" : chunk,
                "embedding" : embed   
            })
            
    try:
        (
            supabase_client.table('carVectors')
            .upsert(row)
            .execute()
        )
        logger.info(f"Successfully upsert {len(row)} to the data to the [carVectors] table")
        
    except Exception as e:
        logger.exception("Failed to upsert car vectors")
        raise