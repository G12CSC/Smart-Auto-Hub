from typing import Dict
from sqlalchemy import text

from app.database.azure_database import get_engine

engine = get_engine()


def apply_metadata_filters(filters: Dict):
    """
    Builds SQL WHERE clause dynamically.
    """

    conditions = []
    params = {}

    if "brand" in filters:
        conditions.append("c.brand = :brand")
        params["brand"] = filters["brand"]

    if "location" in filters:
        conditions.append("c.location = :location")
        params["location"] = filters["location"]

    if "max_price" in filters:
        conditions.append("c.price <= :max_price")
        params["max_price"] = filters["max_price"]

    where_clause = " AND ".join(conditions)

    return where_clause, params