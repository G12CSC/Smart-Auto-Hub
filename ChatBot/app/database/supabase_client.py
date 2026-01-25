from supabase import create_client
from app.config import SUPABASE_URL, SUPABASE_KEY

supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

if not supabase_client:
    raise ValueError("Failed to create Supabase client. Check SUPABASE_URL and SUPABASE_KEY.")