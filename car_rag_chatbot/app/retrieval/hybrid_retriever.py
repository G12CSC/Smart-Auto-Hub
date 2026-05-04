from typing import List, Dict

from app.core.embeddings import embed_text
from app.retrieval.vector_search import vector_search
from app.retrieval.keyword_search import keyword_search


def hybrid_retrieve(query: str, filters: Dict = None, top_k: int = 5) -> List[Dict]:
    """
    Hybrid retrieval combining:
    - Vector search
    - Keyword search
    """

    # Generate embedding
    embedding = embed_text(query)

    # Vector results
    vector_results = vector_search(embedding, top_k=top_k)

    # Keyword results
    keyword_results = keyword_search(query, top_k=top_k)

    # Combine results
    combined = {}

    for r in vector_results:
        combined[r["id"]] = r
        combined[r["id"]]["score"] = 1 - r["vector_score"]

    for r in keyword_results:
        if r["id"] in combined:
            combined[r["id"]]["score"] += 0.2
        else:
            combined[r["id"]] = r
            combined[r["id"]]["score"] = 0.2

    # Sort by score
    ranked = sorted(
        combined.values(),
        key=lambda x: x["score"],
        reverse=True
    )

    return ranked[:top_k]