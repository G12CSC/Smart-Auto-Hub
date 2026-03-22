from typing import List, Dict
from sqlalchemy import text

from app.database.azure_database import get_engine

engine = get_engine()


def keyword_search(query: str, top_k: int = 10) -> List[Dict]:
    """
    Performs keyword search using LIKE matching.
    """

    sql = text("""
        SELECT TOP (:limit)
            c.id,
            c.brand,
            c.model,
            c.price,
            cv.chunk_text
        FROM CarVectors cv
        JOIN Car c ON c.id = cv.car_id
        WHERE cv.chunk_text LIKE :keyword
    """) 

    with engine.connect() as conn:
        result = conn.execute(sql, {
            "limit": top_k,
            "keyword": f"%{query}%"
        })

        return [dict(row) for row in result.mappings()]