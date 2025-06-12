from fastapi import APIRouter, HTTPException, status, Body
from typing import List

from ..controllers import secret_controller
from ..models.secret import Secret, SecretStored

router = APIRouter(
    prefix="/secrets",
    tags=["Secrets"],
)

@router.post("/", status_code=status.HTTP_201_CREATED)
def add_secret(secret: Secret):
    secret_controller.create_secret(secret)
    return {"message": f"Secret '{secret.key}' stored successfully."}

@router.get("/", response_model=List[SecretStored])
def list_all_secrets():
    return secret_controller.get_all_secrets()

@router.get("/{key}")
def get_secret_by_key(key: str):
    value = secret_controller.get_secret_value(key)
    if value is None:
        raise HTTPException(status_code=404, detail="Secret not found")
    return {"key": key, "value": value} # Value is decrypted for the requestor

@router.delete("/{key}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_secret(key: str):
    if not secret_controller.delete_secret(key):
        raise HTTPException(status_code=404, detail="Secret not found")
    return
