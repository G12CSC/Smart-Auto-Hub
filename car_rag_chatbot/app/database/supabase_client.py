from supabase import create_client, Client

from app.config import setting
from app.utils.logger import get_logger

logger = get_logger(__name__)

try:
    supabase_client: Client = create_client(
        setting.SUPABASE_URL,
        setting.SUPABASE_KEY
    )
    logger.info("Supabase client initialized successfully")

except Exception as e:
    logger.exception("Failed to initialized supabase client")
    raise RuntimeError("supabase client initialze is failed") from e