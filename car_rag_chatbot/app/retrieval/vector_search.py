import json
from sqlalchemy import text
from app.database.azure_database import get_engine

engine = get_engine()


def vector_search(
    query_embedding,
    top_k=10,
    min_price=None,
    max_price=None,
    sort=None,
    transmission=None,
    fuel_type=None,
    condition=None,
    max_mileage=None,
    brand=None
):

    vector_json = json.dumps(query_embedding)

    sql_query = """ 
        SELECT TOP (:limit)
            c.id,
            c.brand,
            c.model,
            c.year_of_manufacture,
            c.price,
            c.condition,
            c.mileage,
            c.transmission,
            c.fuel_type,
            cv.chunk_text,
            VECTOR_DISTANCE(
                'cosine',
                cv.embedding,
                CAST(CAST(:vec AS NVARCHAR(MAX)) AS VECTOR(384))
            ) AS vector_score
        FROM CarVectors cv
        JOIN Car c ON c.id = cv.car_id
        WHERE 1=1
    """

    params = {
        "limit": top_k,
        "vec": vector_json
    }

    # -----------------------------
    # PRICE FILTERS
    # -----------------------------
    if max_price is not None:
        sql_query += " AND c.price <= :max_price "
        params["max_price"] = max_price

    if min_price is not None:
        sql_query += " AND c.price >= :min_price "
        params["min_price"] = min_price

    # -----------------------------
    # BRAND FILTER
    # -----------------------------
    if brand:
        sql_query += " AND LOWER(c.brand) LIKE LOWER(:brand) "
        params["brand"] = f"%{brand}%"

    # -----------------------------
    # TRANSMISSION FILTER
    # -----------------------------
    if transmission:
        sql_query += " AND LOWER(c.transmission) = LOWER(:transmission) "
        params["transmission"] = transmission

    # -----------------------------
    # FUEL FILTER
    # -----------------------------
    if fuel_type:
        sql_query += " AND LOWER(c.fuel_type) LIKE LOWER(:fuel_type) "
        params["fuel_type"] = f"%{fuel_type}%"

    # -----------------------------
    # CONDITION FILTER
    # -----------------------------
    if condition:
        sql_query += " AND LOWER(c.condition) = LOWER(:condition) "
        params["condition"] = condition

    # -----------------------------
    # MILEAGE FILTER
    # -----------------------------
    if max_mileage is not None:
        sql_query += " AND c.mileage <= :max_mileage "
        params["max_mileage"] = max_mileage

    # -----------------------------
    # SORTING (ALWAYS LAST)
    # -----------------------------
    if sort == "price_asc":
        sql_query += " ORDER BY c.price ASC "
    elif sort == "price_desc":
        sql_query += " ORDER BY c.price DESC "
    else:
        sql_query += " ORDER BY vector_score ASC "

    # -----------------------------
    # DEBUG
    # -----------------------------
    print("FINAL SQL:", sql_query)
    print("PARAMS:", params)

    sql = text(sql_query)

    with engine.connect() as conn:
        result = conn.execute(sql, params)
        return [dict(row) for row in result.mappings()] 