from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from database.supabase import supabase
from models.schemas import ProductCreate, ProductUpdate
from dependencies.auth import get_admin_user

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/")
async def get_products(
    category_id: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    featured: Optional[bool] = Query(None),
    limit: int = Query(50),
    offset: int = Query(0)
):
    query = supabase.table("products").select("*, categories(name, slug)")

    if category_id:
        query = query.eq("category_id", category_id)
    if search:
        query = query.ilike("name", f"%{search}%")
    if min_price is not None:
        query = query.gte("price", min_price)
    if max_price is not None:
        query = query.lte("price", max_price)
    if featured is not None:
        query = query.eq("is_featured", featured)

    result = query.range(offset, offset + limit - 1).order("created_at", desc=True).execute()
    return result.data


@router.get("/{product_id}")
async def get_product(product_id: str):
    result = supabase.table("products").select("*, categories(name, slug)").eq("id", product_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data[0]


@router.post("/", status_code=201)
async def create_product(data: ProductCreate, admin=Depends(get_admin_user)):
    result = supabase.table("products").insert(data.dict()).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Failed to create product")
    return result.data[0]


@router.put("/{product_id}")
async def update_product(product_id: str, data: ProductUpdate, admin=Depends(get_admin_user)):
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    result = supabase.table("products").update(update_data).eq("id", product_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Product not found")
    return result.data[0]


@router.delete("/{product_id}", status_code=204)
async def delete_product(product_id: str, admin=Depends(get_admin_user)):
    supabase.table("products").delete().eq("id", product_id).execute()
    return None
