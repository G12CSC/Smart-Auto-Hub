car-rag-chatbot/                  # Root folder — give it a meaningful name
├── .env                          # All secrets & config (never commit!)
├── .gitignore
├── README.md                     # How to run, setup Supabase, etc.
├── requirements.txt              # or pyproject.toml + poetry/uv/pipenv
├── run_ingest.sh                 # Optional: one-click ingest script
└── app/                          # Main application code (the FastAPI project)
    ├── __init__.py
    │
    ├── main.py                   # FastAPI app = FastAPI(), includes routers
    │
    ├── config.py                 # Settings / env loading (pydantic-settings or simple)
    │                             # → SUPABASE_URL, SUPABASE_KEY, EMBEDDING_MODEL, etc.
    │
    ├── dependencies.py           # Shared dependencies (e.g. get_supabase_client())
    │
    ├── models/                   # Pydantic models for request/response
    │   ├── __init__.py
    │   └── chat.py               # QueryRequest, ChatResponse, Source, etc.
    │
    ├── core/                     # Business logic — independent of framework
    │   ├── __init__.py
    │   ├── embeddings.py         # Embedding functions (load model once!)
    │   ├── prompts.py            # System prompts, template strings
    │   └── llm.py                # LLM wrapper (Phi-3 via Ollama / HF / Groq / local)
    │
    ├── db/                       # Supabase / vector DB related
    │   ├── __init__.py
    │   ├── supabase_client.py    # Supabase client init + helper funcs
    │   └── vector.py             # Retrieval logic: embed query → sql similarity search
    │                             # (can move to core/ later if you swap DB)
    │
    ├── ingest/                   # Offline / one-time / scheduled ingestion
    │   ├── __init__.py
    │   ├── car_ingest.py         # Main script: query cars → chunk → embed → upsert
    │   └── utils.py              # Chunking, text cleaning helpers
    │
    ├── api/                      # FastAPI routes & endpoints
    │   ├── __init__.py
    │   └── v1/
    │       ├── __init__.py
    │       └── chat.py           # router = APIRouter(), @router.post("/chat")
    │
    └── utils/                    # Small helpers (logging, rate limit, etc.)
        ├── __init__.py
        └── logger.py