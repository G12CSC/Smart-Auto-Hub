from typing import List, Dict

from app.database.supabase_client import supabase_client
from app.core.embeddings import embed_text
from app.utils.logger import get_logger

logger = get_logger(__name__)


# --------------------------------------------------
# 1. Embed user query
# --------------------------------------------------

def embed_query(query: str) -> List[float]:
    """
    Convert a user query into an embedding vector.
    """
    if not isinstance(query, str) or not query.strip():
        raise ValueError("Query must be a non-empty string")

    return embed_text(query)


# --------------------------------------------------
# 2. Vector similarity search (pgvector RPC)
# --------------------------------------------------

def search_car_vectors(query_embedding: List[float], top_k: int = 5) -> List[Dict]:
    """
    Call the pgvector SQL function to retrieve
    the best-matching chunk per car.
    """
    try:
        response = supabase_client.rpc(
            "match_car_vectors_new",
            {
                "query_embedding": query_embedding,
                "match_count": top_k
            }
        ).execute()

        if not response.data:
            logger.info("No vector matches found")
            return []

        return response.data

    except Exception as e:
        logger.exception("Vector search failed")
        raise RuntimeError("Vector search error") from e


# --------------------------------------------------
# 3. Fetch structured car metadata
# --------------------------------------------------

def fetch_car_details(car_ids: List[int]) -> List[Dict]:
    """
    Fetch car details from the Car table using car IDs.
    """
    if not car_ids:
        return []

    try:
        response = (
            supabase_client
            .table("Car")
            .select("*")
            .in_("id", car_ids)
            .execute()
        )

        return response.data or []

    except Exception as e:
        logger.exception("Failed to fetch car metadata")
        raise RuntimeError("Car metadata fetch failed") from e


# --------------------------------------------------
# 4. Merge semantic + structured data
# --------------------------------------------------

def merge_results(vector_results: List[Dict],car_records: List[Dict]) -> List[Dict]:
    """
    Combine vector similarity results with car metadata.
    """
    car_map = {car["id"]: car for car in car_records}

    merged: List[Dict] = []

    for row in vector_results:
        car = car_map.get(row["car_id"])
        if not car:
            continue

        merged.append({
            **car,
            "match_reason": row["content"],
            "similarity": row["similarity"]
        })

    return merged


# --------------------------------------------------
# 5. Main retrieval pipeline (ENTRY POINT)
# --------------------------------------------------

def retrieve_cars_for_query(query: str, top_k: int = 10) -> list[dict]:
    query_embedding = embed_query(query)

    vector_results = search_car_vectors(
        query_embedding=query_embedding,
        top_k=top_k
    )

    if not vector_results:
        return []

    car_ids = [row["car_id"] for row in vector_results]
    car_records = fetch_car_details(car_ids)

    merged = merge_results(vector_results, car_records)

    return merged

