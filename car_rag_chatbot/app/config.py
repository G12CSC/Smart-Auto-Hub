from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Setting(BaseSettings):
    # ------------------Supabase---------------------- 
    SUPABASE_URL: str 
    SUPABASE_KEY: str 

    model_config = SettingsConfigDict(
        env_file = ".env",
        case_sensitive = True
    )

setting = Setting()