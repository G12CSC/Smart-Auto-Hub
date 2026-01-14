-- Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- Vector table
CREATE TABLE IF NOT EXISTS "carVectors" (
                                            id INT PRIMARY KEY,
                                            content TEXT NOT NULL,
                                            embedding VECTOR(384),
    "createdAt" TIMESTAMPTZ DEFAULT now()
    );

-- Vector index
CREATE INDEX IF NOT EXISTS "carVectors_embedding_idx"
    ON "carVectors"
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
