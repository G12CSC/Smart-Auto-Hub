from fastapi import APIRouter, HTTPException
from app.schemas.chat_schema import ChatRequest, ChatResponse
from app.rag.retriever import retrieve_similar_cars

router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    if not request.query.strip():
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    results = retrieve_similar_cars(
        query=request.query,
        top_k=request.top_k
    )

    return {
        "query": request.query,
        "results": [row["content"] for row in results]
    }
