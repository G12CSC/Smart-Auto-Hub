from fastapi import FastAPI
from app.api.v1.chat import router as chat_router

app = FastAPI(
    title="Car RAG Chatbot",
    version="1.0.0"
)

# Register routes
app.include_router(chat_router, prefix="/api/v1")

@app.get("/")
def health_check():
    return {"status": "ok"}
