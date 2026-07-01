from fastapi import APIRouter, HTTPException, Depends
from database.supabase import supabase
from models.schemas import FeedbackCreate
from dependencies.auth import get_current_user, get_admin_user

router = APIRouter(prefix="/feedback", tags=["Feedback"])


@router.get("/product/{product_id}")
async def get_product_feedback(product_id: str):
    result = supabase.table("feedback").select("*, profiles(full_name, avatar_url)").eq("product_id", product_id).order("created_at", desc=True).execute()
    return result.data


@router.get("/", dependencies=[Depends(get_admin_user)])
async def get_all_feedback():
    result = supabase.table("feedback").select("*, profiles(full_name, email), products(name)").order("created_at", desc=True).execute()
    return result.data


@router.get("/user")
async def get_user_feedback(user=Depends(get_current_user)):
    user_id = user["sub"]
    result = supabase.table("feedback").select("*, products(name)").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data


@router.post("/", status_code=201)
async def submit_feedback(data: FeedbackCreate, user=Depends(get_current_user)):
    user_id = user["sub"]

    if not 1 <= data.rating <= 5:
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    # Check for existing review by this user on this product
    existing = supabase.table("feedback").select("id").eq("user_id", user_id).eq("product_id", data.product_id).execute()
    if existing.data:
        # Update existing review
        result = supabase.table("feedback").update({
            "rating": data.rating,
            "comment": data.comment
        }).eq("id", existing.data[0]["id"]).execute()
    else:
        result = supabase.table("feedback").insert({
            "user_id": user_id,
            "product_id": data.product_id,
            "rating": data.rating,
            "comment": data.comment
        }).execute()

    return result.data[0] if result.data else {"message": "Feedback submitted"}


@router.delete("/{feedback_id}", status_code=204)
async def delete_feedback(feedback_id: str, admin=Depends(get_admin_user)):
    supabase.table("feedback").delete().eq("id", feedback_id).execute()
    return None
