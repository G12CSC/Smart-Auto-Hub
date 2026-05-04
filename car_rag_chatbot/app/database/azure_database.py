import os
import urllib.parse
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

def get_engine():
    conn_str = os.getenv("AZURE_SQL_CONNECTION_STRING")

    params = urllib.parse.quote_plus(conn_str)

    engine = create_engine(
        f"mssql+pyodbc:///?odbc_connect={params}",
        pool_pre_ping=True
    )

    return engine

