from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.chat import router as chat_router

app = FastAPI(
    title="Car RAG Chatbot",
    version="1.0.0"
)

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # later replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(chat_router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {"status": "ok"}