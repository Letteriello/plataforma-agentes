from typing import List, Optional

from .. import database
from ..config import encrypt_value, decrypt_value
from ..models.secret import Secret, SecretStored

def create_secret(secret: Secret) -> None:
    encrypted_value = encrypt_value(secret.value)
    database._secrets[secret.key] = encrypted_value
    # In a real app, you'd also store the description

def get_all_secrets() -> List[SecretStored]:
    # Never return the actual secret values in a list view
    return [SecretStored(key=key) for key in database._secrets.keys()]

def get_secret_value(key: str) -> Optional[str]:
    encrypted_value = database._secrets.get(key)
    if encrypted_value:
        return decrypt_value(encrypted_value)
    return None

def delete_secret(key: str) -> bool:
    if key in database._secrets:
        del database._secrets[key]
        return True
    return False
