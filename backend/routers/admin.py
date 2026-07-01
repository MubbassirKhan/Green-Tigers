from fastapi import APIRouter, Depends
from database.supabase import supabase
from dependencies.auth import get_admin_user
from models.schemas import ProfileUpdate

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
async def get_stats(admin=Depends(get_admin_user)):
    total_products = len(supabase.table("products").select("id").execute().data)
    total_users = len(supabase.table("profiles").select("id").eq("role", "user").execute().data)
    all_orders = supabase.table("orders").select("total_amount, status").execute().data
    total_orders = len(all_orders)
    total_revenue = sum(o["total_amount"] for o in all_orders if o["status"] != "cancelled")
    pending_orders = len([o for o in all_orders if o["status"] == "pending"])

    return {
        "total_products": total_products,
        "total_users": total_users,
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "pending_orders": pending_orders
    }


@router.get("/users")
async def get_all_users(admin=Depends(get_admin_user)):
    result = supabase.table("profiles").select("id, email, full_name, role, phone, created_at").order("created_at", desc=True).execute()
    return result.data


@router.put("/users/{user_id}/role")
async def update_user_role(user_id: str, role: str, admin=Depends(get_admin_user)):
    if role not in ["admin", "user"]:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Role must be 'admin' or 'user'")
    result = supabase.table("profiles").update({"role": role}).eq("id", user_id).execute()
    return result.data[0] if result.data else {"message": "Updated"}


@router.delete("/users/{user_id}", status_code=204)
async def delete_user(user_id: str, admin=Depends(get_admin_user)):
    supabase.table("profiles").delete().eq("id", user_id).execute()
    return None
