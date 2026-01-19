from app.database.supabase_client import supabase_client
from app.rag.embedder import embed_cars, car_to_text

def store_car_embeddings(cars):
    embeddings, ids = embed_cars(cars)

    records = []

    for car, car_id, embedding in zip(cars, ids, embeddings):
        records.append({
            "id": car_id,
            "content": car_to_text(car),
            "embedding": embedding.tolist()
        })

    supabase_client.table("carVectors").upsert(records).execute()