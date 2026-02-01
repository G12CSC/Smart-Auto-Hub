from sentence_transformers import SentenceTransformer
from app.utils.logger import get_logger
from typing import List

logger = get_logger(__name__)
 
EMBED_MODEL_NAME = "all-MiniLM-L6-v2" # Max 256 - 512 words each sentence. Otherwise sentence should need to chunk.
_embedder: SentenceTransformer | None = None


def load_embedded_model(model_name:str = EMBED_MODEL_NAME) -> SentenceTransformer:
    try:
        global _embedder
        if _embedder is None:
            logger.info(f"Loading embedding model: {model_name}")
            _embedder = SentenceTransformer(model_name)
            logger.info(f"Embedding model successfully loaded: {model_name} dim = {_embedder.get_sentence_embedding_dimension()}")
    
    except Exception as e:
        logger.exception(f"Failed to load embedding model {model_name}")
        raise
    
    return _embedder
  
    
def embed_text(text:str) -> List[float]:
    """
    This function make for embed single text(query). Design to use:
        - User query embedding
        - Chat request
        - Search query
        - Real time API call
        
    Note:
        This is not for implement for embed the ingestion pipeline or bulk of text embed.
    """
    if not isinstance(text, str) or not text.strip():
        logger.warning("Empty or Invalid text going to provide to the model.")
        raise ValueError("Text must be a non-empty string")
    
    model = load_embedded_model()
    
    embedding = model.encode(text, normalize_embeddings = True)
    logger.info("Successfully convert text form to vector form")
    
    return embedding.tolist()


def embed_texts(texts: List[str]) -> List[List[float]]:
    """
    Enable embedded multiple texts in one call. It implement to use when,
        - Embedded data that fetched by the database or knowledge.
    
    Note:
        - Used batch size = 32 for safe cpu. If you available good GPU, allow to change the batch size higher value. Even you high the batch value each model limited to number of words per embedding cycle. all-miniLM L-6 V-2 model ~200 words per cycle.
    """
    if not texts:
        return []
    
    valid_texts = [t for t in texts if isinstance(t, str) and t.strip()]
    
    #skipped = len(texts) - len(valid_texts)
    
    #if skipped > 0:
    #    logger.warning("Invlid or empty 'valid text' text. During embedding")
    
    #if not valid_texts:
    #   return [[] for _ in texts] # got from chatgpt. Need to learn why it use such code. Look it again still not get it me.

    model = load_embedded_model()
    embedding = model.encode(
        valid_texts,
        normalize_embeddings = True, # This normalize the vector unit lenght(L2 norm) and it makes cosine similarity work correctly, and stabilizes distance comparisions, improve retreival ranking.
        batch_size = 32, # Text per batch. It doesn't matter how much words inside the text.
        show_progress_bar = False # Allow this if you use jupyter notebook.
    )
    
    return embedding.tolist()