from fastapi import APIRouter, HTTPException, Depends
from database.supabase import supabase
from models.schemas import CategoryCreate, CategoryUpdate
from dependencies.auth import get_admin_user

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("/")
async def get_categories():
    result = supabase.table("categories").select("*").order("name").execute()
    return result.data


@router.get("/{category_id}")
async def get_category(category_id: str):
    result = supabase.table("categories").select("*").eq("id", category_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Category not found")
    return result.data[0]


@router.post("/", status_code=201)
async def create_category(data: CategoryCreate, admin=Depends(get_admin_user)):
    result = supabase.table("categories").insert(data.dict()).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create category")
    return result.data[0]


@router.put("/{category_id}")
async def update_category(category_id: str, data: CategoryUpdate, admin=Depends(get_admin_user)):
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    result = supabase.table("categories").update(update_data).eq("id", category_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Category not found")
    return result.data[0]


@router.delete("/{category_id}", status_code=204)
async def delete_category(category_id: str, admin=Depends(get_admin_user)):
    supabase.table("categories").delete().eq("id", category_id).execute()
    return None
