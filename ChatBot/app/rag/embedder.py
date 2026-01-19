from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
                            'all-MiniLM-L6-v2',
                             device='cpu'
                            )

def car_to_text(car) -> str:
    return f"""
    Car: {car.get('brand', 'Unknown')} {car.get('model', 'Unknown')}
    Edition: {car.get('edition', 'Standard')}
    Year: {car.get('year', 'Unknown')}
    Price: {car.get('price', 'Unknown')} LKR

    Specifications:
    - Transmission: {car.get('transmission', 'Unknown')}
    - Fuel Type: {car.get('fuelType', 'Unknown')}
    - Engine Capacity: {car.get('engineCapacity', 'Unknown')} cc
    - Body Type: {car.get('bodyType', 'Unknown')}

    Usage & Condition:
    - Mileage: {car.get('mileage', 'Unknown')} km
    - Condition: {car.get('condition', 'Unknown')}

    Availability:
    - Location: {car.get('location', 'Unknown')}
    - Dealer: {car.get('dealer', 'Unknown')}
    """.strip()


def embed_cars(cars):
    texts = [car_to_text(car) for car in cars]

    embeddings = model.encode(
        texts, 
        normalize_embeddings=True
        )
    
    ids = [car.get('id') for car in cars] 

    return embeddings, ids