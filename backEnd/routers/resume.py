from fastapi import APIRouter

# This MUST be named 'router' if your main.py uses 'resume.router'
router = APIRouter()

@router.get("/test")
def test_route():
    return {"message": "Success"}

# Ensure no other code in this file overwrites 'router' later!