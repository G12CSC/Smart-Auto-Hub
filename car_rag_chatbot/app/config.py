import os
import urllib.parse
from dotenv import load_dotenv

load_dotenv()

server = os.getenv("DB_SERVER")
database = os.getenv("DB_NAME")
admin = os.getenv("DB_ADMIN")
password = os.getenv("DB_PASSWORD")
driver = "ODBC Driver 17 for SQL Server"

params = urllib.parse.quote_plus(
    f"DRIVER={driver};SERVER={server};DATABASE={database};UID={admin};PWD={password}"
)
