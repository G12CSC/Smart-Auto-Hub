def chunk_text(text: str, max_words:int = 150, overlap = 25) -> list[str]:
    """
    Split long text into smaller overlapping chunks suitable for embedding.

    Why chunking is needed:
        Embedding models have a limited context window and perform better on
        shorter, self-contained text. Chunking allows long descriptions to be
        embedded piece-by-piece instead of truncating or losing information.

    Why overlap is used:
        Overlap preserves semantic continuity across chunk boundaries.
        Important phrases may span multiple chunks, and overlap ensures that
        meaningful context appears fully in at least one chunk, improving
        retrieval accuracy in semantic search.
    """
    if not text or not text.strip():
        return[]
    
    chunks = []   
    words = text.split()
       
    if overlap >= max_words:
        raise ValueError("")
       
    start = 0
    while start < len(words):
        end = start + max_words
        chunk = " ".join(words[start : end])
        chunks.append(chunk)
        start += max_words - overlap 
    
    return chunks