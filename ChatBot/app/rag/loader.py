from app.database.supabase_client import supabase_client

def load_cars():
    try:
        response = (
            supabase_client.table("Car")
            .select(
                "id, brand, model, price, year, mileage, condition, edition, transmission, bodyType, fuelType, engineCapacity, location, dealer" 
            )
            .execute()
        )

        return response.data
    
    except Exception as e:
        raise RuntimeError(f"Error loading cars from Supabase: {e}")
         