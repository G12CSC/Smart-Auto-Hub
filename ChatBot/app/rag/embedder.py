from sentence_transformers import SentenceTransformer
from app.rag.loader import load_cars

model = SentenceTransformer('all-MiniLM-L6-v2')

cars = load_cars()

def car_to_text(car):
    return (
        f"Brand: {car['brand']}\n"
        f"Model: {car['model']}\n"
        f"Price: {car['price']}\n"
        f"Year: {car['year']}\n"
        f"Mileage: {car['mileage']}\n"
        f"Specifications: {car['specifications']}\n"
    )

def embed_cars(cars):
    texts = [car_to_text(car) for car in cars]
    embeddings = model.encode(texts)
    return embeddings