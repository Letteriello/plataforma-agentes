import os
from cryptography.fernet import Fernet

# Em um ambiente de produção, esta chave DEVE ser gerenciada por um serviço de segredos
# (ex: AWS Secrets Manager, HashiCorp Vault)
KEY_FILE = os.path.join(os.path.dirname(__file__), '..', '..', 'secret.key')

def get_key():
    if not os.path.exists(KEY_FILE):
        key = Fernet.generate_key()
        with open(KEY_FILE, "wb") as key_file:
            key_file.write(key)
        return key
    return open(KEY_FILE, "rb").read()

key = get_key()
fernet = Fernet(key)

def encrypt_value(value: str) -> bytes:
    return fernet.encrypt(value.encode())

def decrypt_value(encrypted_value: bytes) -> str:
    return fernet.decrypt(encrypted_value).decode()
