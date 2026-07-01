import os
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, status
from jose import jwt
import bcrypt
from dotenv import load_dotenv
from database.supabase import supabase
from models.schemas import UserRegister, UserLogin

load_dotenv()

router = APIRouter(prefix="/auth", tags=["Authentication"])
SECRET_KEY = os.environ.get("SECRET_KEY", "fallback-secret")
ALGORITHM = os.environ.get("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", 10080))
MAX_BCRYPT_PASSWORD_BYTES = 72


def truncate_password(password: str) -> str:
    return password.encode("utf-8")[:MAX_BCRYPT_PASSWORD_BYTES].decode("utf-8", "ignore")


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register", status_code=201)
async def register(data: UserRegister):
    # Check if user exists
    existing = supabase.table("profiles").select("id").eq("email", data.email).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="Email already registered")

    password = truncate_password(data.password)
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Insert user
    result = supabase.table("profiles").insert({
        "email": data.email,
        "password_hash": hashed_pw,
        "full_name": data.full_name,
        "phone": data.phone,
        "role": "user"
    }).execute()

    if not result.data:
        raise HTTPException(status_code=500, detail="Registration failed")

    user = result.data[0]
    token = create_access_token({"sub": user["id"], "email": user["email"], "role": user["role"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"]
        }
    }


@router.post("/login")
async def login(data: UserLogin):
    result = supabase.table("profiles").select("*").eq("email", data.email).execute()

    if not result.data:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user = result.data[0]
    password = truncate_password(data.password)

    if not bcrypt.checkpw(password.encode('utf-8'), user["password_hash"].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user["id"], "email": user["email"], "role": user["role"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "phone": user.get("phone"),
            "address": user.get("address"),
            "avatar_url": user.get("avatar_url")
        }
    }


@router.get("/me")
async def get_me(token_data: dict = None):
    # Token validation done at route level via dependency
    return {"message": "Use /auth/login to get user info"}
