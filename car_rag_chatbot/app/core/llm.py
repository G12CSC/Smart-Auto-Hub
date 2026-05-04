from groq import Groq
from typing import List, Dict
import os

from app.core.prompts import build_prompt
from app.utils.logger import get_logger

logger = get_logger(__name__)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_response(
    user_query: str,
    retrieved_cars: List[Dict],
) -> str:

    if not retrieved_cars:
        return "Sorry, I don't have information."

    context = build_prompt(retrieved_cars)

    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful Sri Lankan car sales assistant.\n"
                "Only answer using the provided car listings.\n"
                "If no cars match the request say: "
                "'Sorry, I don't have information.'"
            ),
        },
        {
            "role": "user",
            "content": f"""
Available car listings:
{context}

Customer question:
{user_query}
"""
        }
    ]

    try:

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.4,
            max_tokens=300
        )


        return response.choices[0].message.content.strip()

    except Exception:
        logger.exception("Groq LLM error")
        return "Something went wrong. Please try again."
