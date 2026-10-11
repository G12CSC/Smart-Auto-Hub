from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Setting(BaseSettings):
    # ------------------PostgreSQL--------------------
    # Standard libpq/psycopg connection string, e.g.
    #   postgresql://user:password@host:5432/dbname
    # The chatbot shares this database with the rest of the stack.
    DATABASE_URL: str

    # ------------------LLM---------------------------
    # Hugging Face model id for the generative model. Overridable via env so a
    # smaller model (e.g. "Qwen/Qwen2.5-0.5B-Instruct") can be used on CPU/dev.
    LLM_MODEL_NAME: str = "microsoft/phi-3-mini-4k-instruct"

    model_config = SettingsConfigDict(
        env_file = ".env",
        case_sensitive = True
    )

setting = Setting()