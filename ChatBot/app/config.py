from dotenv import load_dotenv
import os

load_dotenv() # Load environment variables from .env file

SUPABASE_URL = os.getenv("SUPABASE_URL")   
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URL and SUPABASE_KEY must be set in environment variables.")