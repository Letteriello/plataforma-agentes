# Usar uma imagem base oficial do Python
FROM python:3.11-slim

# Definir o diretório de trabalho no contêiner
WORKDIR /app

# Copiar o arquivo de dependências primeiro para aproveitar o cache do Docker
COPY requirements.txt requirements.txt

# Instalar as dependências
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copiar o restante do código da aplicação para o diretório de trabalho
COPY . .

# Expor a porta em que a aplicação será executada
EXPOSE 8000

# Comando para executar a aplicação quando o contêiner iniciar
# O host 0.0.0.0 torna a aplicação acessível de fora do contêiner
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
