FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    gnupg \
    unixodbc \
    unixodbc-dev \
    && rm -rf /var/lib/apt/lists/*

# Add Microsoft repository (Debian 12 compatible)
RUN mkdir -p /etc/apt/keyrings \
 && curl https://packages.microsoft.com/keys/microsoft.asc \
 | gpg --dearmor -o /etc/apt/keyrings/microsoft.gpg \
 && echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/microsoft.gpg] https://packages.microsoft.com/debian/12/prod bookworm main" \
 > /etc/apt/sources.list.d/mssql-release.list

# Install SQL Server ODBC driver
RUN apt-get update \
 && ACCEPT_EULA=Y apt-get install -y msodbcsql18

COPY requirements.txt .

RUN pip install --upgrade pip

# Install CPU PyTorch
RUN pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Pre-download embedding model
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"

EXPOSE 8000

CMD ["uvicorn","app.main:app","--host","0.0.0.0","--port","8000"]
