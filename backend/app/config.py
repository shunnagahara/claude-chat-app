import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY")
    CLAUDE_MODEL: str = "claude-instant-1.2"
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:3001"]  # 3001を追加
    MAX_TOKENS: int = 1024

settings = Settings()
