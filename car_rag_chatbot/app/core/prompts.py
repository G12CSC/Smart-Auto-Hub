from typing import List, Dict


def build_prompt(retrieved_cars: List[Dict] = None) -> str:
    """
    Build ONLY contextual car information.
    This function must NOT include roles, instructions,
    or model-specific tokens.
    """

    if not retrieved_cars:
        return "No relevant car listings are available."

    lines: list[str] = []

    for idx, car in enumerate(retrieved_cars, start=1):
        lines.append(
            f"{idx}. {car['brand']} {car['model']} ({car['year']})\n"
            f"   Price: {car['price'] / 1_000_000:.1f}M LKR\n"
            f"   Location: {car['location']}\n"
            f"   Details: {car['match_reason']}"
        )

    return "\n".join(lines) 

context = build_prompt()

