from app.core.embeddings import embed_text
from app.utils.logger import get_logger

logger = get_logger(__name__)

def retriever(query: str):
    if not query:
        logger.warning("No any query insertede")
        return []
     
 