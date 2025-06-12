import uvicorn
import sys
import os

# Adiciona o diretório 'server' ao path para que 'app' possa ser importado
sys.path.append(os.path.dirname(__file__))

from app import app

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
