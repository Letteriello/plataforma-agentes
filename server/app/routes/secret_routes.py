from fastapi import APIRouter, HTTPException, status, Body
from typing import List

from ..models.secret import Secret, SecretStored
from .. import database
from ..config import encrypt_value, decrypt_value

router = APIRouter(
    prefix="/secrets",
    tags=["Secrets"],
)

@router.post("/", status_code=status.HTTP_201_CREATED)
def add_secret(secret: Secret):
    encrypted_value = encrypt_value(secret.value)
    database._secrets[secret.key] = encrypted_value
    return {"message": f"Secret '{secret.key}' stored successfully."}

@router.get("/", response_model=List[SecretStored])
def list_all_secrets():
    return [SecretStored(key=key) for key in database._secrets.keys()]

@router.get("/{key}")
def get_secret_by_key(key: str):
    encrypted_value = database._secrets.get(key)
    value = decrypt_value(encrypted_value) if encrypted_value else None
    if value is None:
        raise HTTPException(status_code=404, detail="Secret not found")
    return {"key": key, "value": value} # Value is decrypted for the requestor

@router.delete("/{key}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_secret(key: str):
    if key in database._secrets:
        del database._secrets[key]
        return
    raise HTTPException(status_code=404, detail="Secret not found")
