import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from typing import List, Dict

from app.utils.logger import get_logger
from app.core.prompts import build_prompt

logger = get_logger(__name__)

MODEL_NAME = "microsoft/phi-3-mini-4k-instruct"

_tokenizer: AutoTokenizer | None = None
_model: AutoModelForCausalLM | None = None


def load_llm() -> None:
    """
    Load the tokenizer and model once and reuse them.
    """
    global _tokenizer, _model

    if _tokenizer is not None and _model is not None:
        return

    try:
        logger.info(f"Loading Phi-3 model: {MODEL_NAME}")

        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        if _tokenizer.pad_token is None:
            _tokenizer.pad_token = _tokenizer.eos_token

        _model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            torch_dtype=torch.float16,
            device_map="auto",
            trust_remote_code=True,
        )

        _model.eval()
        logger.info("LLM loaded successfully")

    except Exception as e:
        logger.exception("Failed to load LLM")
        raise RuntimeError("LLM initialization failed") from e


def generate_response(
    user_query: str,
    retrieved_cars: List[Dict],
    max_new_tokens: int = 300,
    temperature: float = 0.7,
    top_p: float = 0.9,
) -> str:
    """
    Generate a grounded response using Phi-3.
    """

    if not retrieved_cars:
        return "Sorry, I don't have matching cars for that."

    load_llm()

    context = build_prompt(retrieved_cars)

    messages = [
        {
            "role": "system",
            "content": (
                "You are a helpful Sri Lankan car sales assistant.\n"
                "Answer ONLY using the provided car listings.\n"
                "Return ONLY the car details paragraph exactly as given.\n"
                "Do NOT add numbering or extra formatting.\n"
                "If no matches, say exactly: "
                "'Sorry, I don't have matching cars for that.'"
            ),
        },
        {
            "role": "user",
            "content": f"""
Available car listings:
{context}

Customer question:
{user_query}
""",
        },
    ]

    prompt = _tokenizer.apply_chat_template(
        messages,
        tokenize=False,
        add_generation_prompt=True,
    )

    try:
        inputs = _tokenizer(prompt, return_tensors="pt").to(_model.device)
        prompt_length = inputs.input_ids.shape[1]

        with torch.no_grad(): # no_grade() tell not for trainnig, don't track gradient(backProp)
            outputs = _model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                do_sample=(temperature > 0.01),
                temperature=temperature,
                top_p=top_p,
                use_cache=False,  
                eos_token_id=_tokenizer.eos_token_id,
                pad_token_id=_tokenizer.pad_token_id,
            )

        # Slice ONLY the generated continuation
        generated_ids = outputs[0][prompt_length:]
        answer = _tokenizer.decode(
            generated_ids,
            skip_special_tokens=True
        ).strip()

        return answer

    except RuntimeError as re:
        if "out of memory" in str(re).lower():
            torch.cuda.empty_cache()
            return "Sorry, the request was too large. Please try a shorter question."

        logger.exception("LLM runtime error")
        return "An error occurred while generating the response."

    except Exception:
        logger.exception("Unexpected LLM error")
        return "Something went wrong. Please try again."
