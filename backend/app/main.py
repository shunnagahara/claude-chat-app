from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import anthropic
from .models import ChatRequest, NewChatRequest, ChatResponse, NewChatResponse
from .config import settings
import logging

app = FastAPI(title="Claude Chat API")

# CORS設定をより詳細に
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,
)

# Anthropicクライアントの初期化
client = anthropic.Client(api_key=settings.ANTHROPIC_API_KEY)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        if request.system:
            messages.insert(0, {"role": "system", "content": request.system})
        
        # リクエストの内容をログに出力
        logger.info(f"Sending request to Claude API with messages: {messages}")
        
        response = client.messages.create(
            model=settings.CLAUDE_MODEL,
            messages=messages,
            max_tokens=settings.MAX_TOKENS,
        )
        
        return ChatResponse(
            role="assistant",
            content=response.content[0].text
        )
    except Exception as e:
        # エラーの詳細をログに出力
        logger.error(f"Error in chat endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/new-chat", response_model=NewChatResponse)
async def new_chat(request: NewChatRequest):
    return NewChatResponse(system=request.system)
