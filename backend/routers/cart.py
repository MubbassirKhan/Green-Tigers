from fastapi import APIRouter, HTTPException, Depends
from database.supabase import supabase
from models.schemas import CartItemAdd, CartItemUpdate
from dependencies.auth import get_current_user

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("/")
async def get_cart(user=Depends(get_current_user)):
    user_id = user["sub"]
    result = supabase.table("cart_items").select("*, products(id, name, price, image_url, stock)").eq("user_id", user_id).execute()
    return result.data


@router.post("/", status_code=201)
async def add_to_cart(data: CartItemAdd, user=Depends(get_current_user)):
    user_id = user["sub"]

    # Check if item already in cart
    existing = supabase.table("cart_items").select("*").eq("user_id", user_id).eq("product_id", data.product_id).execute()

    if existing.data:
        item = existing.data[0]
        new_qty = item["quantity"] + data.quantity
        result = supabase.table("cart_items").update({"quantity": new_qty}).eq("id", item["id"]).execute()
    else:
        result = supabase.table("cart_items").insert({
            "user_id": user_id,
            "product_id": data.product_id,
            "quantity": data.quantity
        }).execute()

    return result.data[0] if result.data else {"message": "Updated"}


@router.put("/{item_id}")
async def update_cart_item(item_id: str, data: CartItemUpdate, user=Depends(get_current_user)):
    user_id = user["sub"]
    if data.quantity <= 0:
        supabase.table("cart_items").delete().eq("id", item_id).eq("user_id", user_id).execute()
        return {"message": "Item removed"}
    result = supabase.table("cart_items").update({"quantity": data.quantity}).eq("id", item_id).eq("user_id", user_id).execute()
    return result.data[0] if result.data else {"message": "Updated"}


@router.delete("/{item_id}", status_code=204)
async def remove_from_cart(item_id: str, user=Depends(get_current_user)):
    user_id = user["sub"]
    supabase.table("cart_items").delete().eq("id", item_id).eq("user_id", user_id).execute()
    return None


@router.delete("/", status_code=204)
async def clear_cart(user=Depends(get_current_user)):
    user_id = user["sub"]
    supabase.table("cart_items").delete().eq("user_id", user_id).execute()
    return None
