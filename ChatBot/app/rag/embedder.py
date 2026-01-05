from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')

def car_to_text(car) -> str:
    return (
        f"This car has ID {car.get('id', 'unknown')}.\n"
        f"It is a {car.get('brand', 'unknown')} {car.get('model', 'unknown')}.\n"
        f"This price is {car.get('price', 'unknown')}.\n"
        f"It was manufactured in {car.get('year', 'unknown')}.\n"
        f"The mileage is {car.get('mileage', 'unknown')} kilometers.\n"
    )

def embed_cars(cars):
    texts = [car_to_text(car) for car in cars]

    embeddings = model.encode(
        texts, 
        normalize_embeddings=True
        )
    
    ids = [car.get('id') for car in cars] 

    return embeddings, ids