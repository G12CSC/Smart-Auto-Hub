import json
from typing import List, Dict
from sqlalchemy import text

from app.database.azure_database import get_engine
from app.core.embeddings import embed_text
from app.utils.logger import get_logger

logger = get_logger(__name__)
engine = get_engine()

# --------------------------------------------------
# 1. Embed user query
# --------------------------------------------------

def embed_query(query: str) -> List[float]:
    """
    Converts text query into a 384-dimensional vector.
    """
    if not isinstance(query, str) or not query.strip():
        raise ValueError("Query must be a non-empty string")

    embedding = embed_text(query)
    
    # Safety check for the specific model dimension
    if len(embedding) != 384:
        logger.error(f"Dimension mismatch: Expected 384, got {len(embedding)}")
        
    return embedding


# --------------------------------------------------
# 2. Vector search + car metadata (The Fix)
# --------------------------------------------------

def search_relevant_cars(query_embedding: List[float], top_k: int = 5):
    """
    Performs Cosine Similarity search in Azure SQL using the VECTOR type.
    """
    try:
        # Convert the list of floats into a string: "[0.12, 0.45, ...]"
        vector_json = json.dumps(query_embedding)

        # The Fix: Double CAST (NVARCHAR(MAX) -> VECTOR(384))
        # This prevents the 'ntext' conversion error for long vectors.
        sql = text("""
            SELECT TOP (:limit)
                c.*,
                cv.chunk_text AS match_reason,
                VECTOR_DISTANCE(
                    'cosine', 
                    cv.embedding, 
                    CAST(CAST(:vec AS NVARCHAR(MAX)) AS VECTOR(384))
                ) AS distance
            FROM CarVectors cv
            JOIN Car c ON c.id = cv.car_id
            ORDER BY distance ASC
        """)

        with engine.connect() as conn:
            result = conn.execute(sql, {
                "limit": top_k,
                "vec": vector_json
            })
            
            # Map results to a list of dictionaries for easy use
            return [dict(row) for row in result.mappings()]

    except Exception as e:
        logger.error(f"Database vector search failed: {e}")
        raise


# --------------------------------------------------
# 3. Main retrieval pipeline
# --------------------------------------------------

def retrieve_cars_for_query(query: str, top_k: int = 10) -> List[Dict]:
    """
    Entry point for the RAG system to get relevant car data.
    """
    try:
        query_embedding = embed_query(query)
        
        results = search_relevant_cars(
            query_embedding=query_embedding,
            top_k=top_k
        )
        
        return results
    except Exception as e:
        logger.error(f"Retrieval pipeline error: {e}")
        return []
