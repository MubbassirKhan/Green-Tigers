from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import auth, products, categories, cart, orders, feedback, admin

app = FastAPI(
    title="Green tigers API",
    description="Full-stack E-Commerce API — Clothing, Sports, Home & Kitchen, Beauty, Electronics, Books",
    version="1.0.0"
)

# ── CORS — MUST be added before all routes ─────────────────────────────────
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


# ── Global exception handler (preserves CORS headers on 500) ───────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    origin = request.headers.get("origin", "")
    headers = {}
    if origin in ALLOWED_ORIGINS:
        headers["Access-Control-Allow-Origin"] = origin
        headers["Access-Control-Allow-Credentials"] = "true"
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
        headers=headers,
    )


# ── Routers ────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(feedback.router)
app.include_router(admin.router)


@app.get("/", tags=["Health"])
async def root():
    return {"message": "🛍️ Green tigers API is running!", "docs": "/docs", "version": "1.0.0"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok"}

from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import re
import os

router = APIRouter(prefix="/sentiment", tags=["Sentiment"])
app.include_router(router)

# Load model once
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "review_sentiment_model.pkl")
bundle = joblib.load(MODEL_PATH)

model = bundle["model"]
vectorizer = bundle["vectorizer"]
stop_words = bundle["stop_words"]


def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"[^\w\s']", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    words = [w for w in text.split() if w not in stop_words]
    return " ".join(words)


class ReviewRequest(BaseModel):
    review: str


@router.post("/predict")
def predict_sentiment(data: ReviewRequest):
    cleaned = clean_text(data.review)
    vector = vectorizer.transform([cleaned])
    prediction = model.predict(vector)[0]

    return {
        "review": data.review,
        "sentiment": prediction
    }