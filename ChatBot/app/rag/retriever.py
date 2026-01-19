from app.database.supabase_client import supabase_client
from app.rag.embedder import model


def retrieve_similar_cars(query: str, top_k: int = 3):
    # Convert query → embedding
    query_embedding = model.encode(
        query,
        normalize_embeddings=True
    ).tolist()

    # Call YOUR Postgres function
    result = supabase_client.rpc(
        "match_car_vectors",
        {
            "query_embedding": query_embedding,
            "match_count": top_k
        }
    ).execute()

    return result.data
