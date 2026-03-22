import re
from app.core.embeddings import embed_text
from app.retrieval.vector_search import vector_search


# --------------------------------------------------
# BRAND PARSER
# --------------------------------------------------

def parse_brand(query):

    query = query.lower()

    brands = [
        "toyota",
        "honda",
        "nissan",
        "suzuki",
        "mitsubishi",
        "mazda",
        "bmw",
        "benz",
        "mercedes",
        "audi",
        "perodua",
        "dfsk"
    ]

    for brand in brands:
        if brand in query:
            return brand.capitalize()

    return None

# --------------------------------------------------
# PRICE PARSER
# --------------------------------------------------

def parse_price_condition(query: str):

    query = query.lower()

    max_price = None
    min_price = None
    sort = None

    # under / below / less than
    match = re.search(r"(under|below|less than)\s+(\d+)", query)
    if match:
        max_price = int(match.group(2)) * 1_000_000

    # above / over
    match = re.search(r"(above|over|higher than|more than)\s+(\d+)", query)
    if match:
        min_price = int(match.group(2)) * 1_000_000

    # budget / have / around / buy
    match = re.search(r"(budget|have|around|about|buy)\s+(\d+)", query)
    if match:
        max_price = int(match.group(2)) * 1_000_000

    # cheapest
    if re.search(r"\b(cheapest|lowest price|cheap)\b", query):
        sort = "price_asc"

    # most expensive
    if re.search(r"\b(most expensive|highest price)\b", query):
        sort = "price_desc"

    return min_price, max_price, sort


# --------------------------------------------------
# TRANSMISSION PARSER
# --------------------------------------------------

def parse_transmission(query: str):

    query = query.lower()

    if re.search(r"\bmanual\b", query):
        return "Manual"

    if re.search(r"\bautomatic\b|\bauto\b", query):
        return "Automatic"

    return None


# --------------------------------------------------
# FUEL PARSER
# --------------------------------------------------

def parse_fuel(query):

    query = query.lower()

    # check hybrid first
    if re.search(r"\bhybrid\b", query):
        return "Hybrid"

    if re.search(r"\bpetrol\b", query):
        return "Petrol"

    if re.search(r"\bdiesel\b", query):
        return "Diesel"

    if re.search(r"\belectric\b", query):
        return "Electric"

    return None


# --------------------------------------------------
# CONDITION PARSER
# --------------------------------------------------

def parse_condition(query):

    query = query.lower()

    if re.search(r"\bbrand new\b", query) or re.search(r"\bnew\b", query):
        return "New"

    if re.search(r"\bused\b", query):
        return "Used"

    return None


# --------------------------------------------------
# MILEAGE PARSER
# --------------------------------------------------

def parse_mileage(query):

    # km must exist to avoid "12 million" being parsed as mileage
    match = re.search(r"(under|below)\s+(\d+)\s*km", query.lower())

    if match:
        return int(match.group(2))

    return None


# --------------------------------------------------
# MAIN RETRIEVER
# --------------------------------------------------

def retrieve_cars(query: str, top_k: int = 5):

    # 1️⃣ Convert query to embedding
    embedding = embed_text(query)

    # 2️⃣ Parse filters
    min_price, max_price, sort = parse_price_condition(query)
    brand = parse_brand(query)
    transmission = parse_transmission(query)
    fuel_type = parse_fuel(query)
    condition = parse_condition(query)
    max_mileage = parse_mileage(query)

    # Debug output (optional but useful)
    print("Parsed Filters →")
    print("brand:", brand)
    print("min_price:", min_price)
    print("max_price:", max_price)
    print("fuel_type:", fuel_type)
    print("transmission:", transmission)
    print("condition:", condition)
    print("max_mileage:", max_mileage) 
    print("sort:", sort)

    # 3️⃣ Vector search + metadata filters
    results = vector_search(
        query_embedding=embedding,
        top_k=top_k,
        min_price=min_price,
        max_price=max_price,
        sort=sort,
        transmission=transmission,
        fuel_type=fuel_type,
        condition=condition,
        max_mileage=max_mileage,
        brand = brand
    ) 

    return results 