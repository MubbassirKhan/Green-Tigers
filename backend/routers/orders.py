from fastapi import APIRouter, HTTPException, Depends
from database.supabase import supabase
from models.schemas import OrderCreate, OrderStatusUpdate
from dependencies.auth import get_current_user, get_admin_user

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", status_code=201)
async def place_order(data: OrderCreate, user=Depends(get_current_user)):
    user_id = user["sub"]

    if not data.items:
        raise HTTPException(status_code=400, detail="Order must have items")

    # Calculate total
    total = 0.0
    enriched_items = []
    for item in data.items:
        product = supabase.table("products").select("id, price, stock, name").eq("id", item["product_id"]).execute()
        if not product.data:
            raise HTTPException(status_code=404, detail=f"Product {item['product_id']} not found")
        p = product.data[0]
        qty = item["quantity"]
        if p["stock"] < qty:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for {p['name']}")
        total += p["price"] * qty
        enriched_items.append({"product_id": p["id"], "quantity": qty, "unit_price": p["price"]})

    # Create order
    order_result = supabase.table("orders").insert({
        "user_id": user_id,
        "total_amount": total,
        "status": "pending",
        "shipping_address": data.shipping_address
    }).execute()

    if not order_result.data:
        raise HTTPException(status_code=500, detail="Failed to create order")

    order_id = order_result.data[0]["id"]

    # Create order items
    for item in enriched_items:
        item["order_id"] = order_id
        supabase.table("order_items").insert(item).execute()
        # Decrement stock
        supabase.table("products").update({"stock": supabase.table("products").select("stock").eq("id", item["product_id"]).execute().data[0]["stock"] - item["quantity"]}).eq("id", item["product_id"]).execute()

    # Clear cart
    supabase.table("cart_items").delete().eq("user_id", user_id).execute()

    return order_result.data[0]


@router.get("/my")
async def get_my_orders(user=Depends(get_current_user)):
    user_id = user["sub"]
    result = supabase.table("orders").select("*, order_items(*, products(name, image_url, price))").eq("user_id", user_id).order("created_at", desc=True).execute()
    return result.data


@router.get("/", dependencies=[Depends(get_admin_user)])
async def get_all_orders():
    result = supabase.table("orders").select("*, profiles(full_name, email), order_items(*, products(name))").order("created_at", desc=True).execute()
    return result.data


@router.get("/{order_id}")
async def get_order(order_id: str, user=Depends(get_current_user)):
    result = supabase.table("orders").select("*, order_items(*, products(name, image_url, price))").eq("id", order_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")
    order = result.data[0]
    if order["user_id"] != user["sub"] and user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    return order


@router.put("/{order_id}/status")
async def update_order_status(order_id: str, data: OrderStatusUpdate, admin=Depends(get_admin_user)):
    valid_statuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"]
    if data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    result = supabase.table("orders").update({"status": data.status}).eq("id", order_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Order not found")
    return result.data[0]
