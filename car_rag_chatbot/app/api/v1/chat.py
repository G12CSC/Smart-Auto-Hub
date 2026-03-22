from fastapi import APIRouter
from app.models.chat_scema import ChatRequest, ChatResponse

from app.retrieval.retriever import retrieve_cars
from app.core.llm import generate_response
from app.core.intent import predict_intent
from app.core.intent_router import intent_route

router = APIRouter() 

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):

    # Predict intent
    intent, confidence = predict_intent(request.query)
    print(intent)
    print(confidence)
    # confidence safety
    if confidence < 0.7:
        intent = "fallback_help"

    # Retrieval only if needed
    retrieved = []
    if intent in [
        "search_car",
        "sort_year",
        "sort_mileage",
        "sort_price",
        "compare_cars",
        "ask_details"
    ]:
        retrieved = retrieve_cars(request.query) 

    # Route response
    if intent in [
        "search_car",
        "sort_year",
        "sort_mileage",
        "sort_price",
        "compare_cars",
        "ask_details",
        "fallback_help"
    ]: 

        response = generate_response(
            user_query=request.query,
            retrieved_cars=retrieved
        )

    else:
        response = intent_route(intent, request.query)

    # Safety fallback
    if not isinstance(response, str):
        response = "I'm sorry, something went wrong. Please try again."

    return {"answer": response}

