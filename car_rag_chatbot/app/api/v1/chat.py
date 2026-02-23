from fastapi import APIRouter
from app.models.chat_scema import ChatRequest, ChatResponse

from app.database.vector import retrieve_cars_for_query
from app.core.llm import generate_response
from app.core.intent import predict_intent
from app.core.intent_router import intent_route

router = APIRouter() 
  
@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    retrieved = retrieve_cars_for_query(request.query)
    
    intent, confidence = predict_intent(request.query)
    if confidence < 0.7:
        intent = "fallback_help"
        
    if intent in ["search_car", "sort_year", "sort_mileage", "compare_cars", "sort_price","fallback_help"]:
        response = generate_response(request.query, retrieved)
    else:
        response = intent_route(intent, request.query)

    return {"answer": response}
