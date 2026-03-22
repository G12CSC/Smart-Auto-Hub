from typing import List, Dict


def build_prompt(retrieved_cars: List[Dict] = None) -> str:
    """
    Build contextual car information for the LLM.
    No instructions or roles here.
    """

    if not retrieved_cars:
        return "No relevant car listings are available."

    lines: list[str] = []

    for idx, car in enumerate(retrieved_cars, start=1):

        brand = car.get("brand", "Unknown")
        model = car.get("model", "Unknown")
        year = car.get("year_of_manufacture", "Unknown")
        price = car.get("price", 0)
        condition = car.get("condition", "Unknown")
        mileage = car.get("mileage", "Unknown")
        transmission = car.get("transmission", "Unknown")
        fuel = car.get("fuel_type", "Unknown")
        engine = car.get("engine_capacity", "Unknown")

        lines.append(
            f"{idx}. {brand} {model} ({year})\n"
            f"Price: {price / 1_000_000:.1f}M LKR\n"
            f"Condition: {condition} | Transmission: {transmission}\n"
            f"Fuel: {fuel} | Engine: {engine}\n"
            f"Mileage: {mileage}\n"
        )

    return "\n".join(lines)