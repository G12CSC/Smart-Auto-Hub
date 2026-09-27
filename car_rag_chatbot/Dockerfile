# Car RAG Chatbot (FastAPI) - CPU image.
# torch is installed from the CPU wheel index to avoid pulling multi-GB CUDA
# packages. For GPU, install torch==2.6.0+cu124 instead and run on an
# NVIDIA runtime.
FROM python:3.12-slim AS base

WORKDIR /app

# Runtime libs: libgomp1 for torch, and build tools some wheels may need.
RUN apt-get update && apt-get install -y --no-install-recommends \
        libgomp1 \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HOME=/root/.cache/huggingface

# 1) CPU-only torch first (kept separate so the CUDA index is not used elsewhere).
RUN pip install --index-url https://download.pytorch.org/whl/cpu torch==2.6.0

# 2) Remaining Python deps (GPU/torch lines already stripped from this file).
COPY requirements.docker.txt ./requirements.docker.txt
RUN pip install -r requirements.docker.txt

# 3) Application source (in dev this is bind-mounted over by docker-compose).
COPY . .

EXPOSE 8000

# Default (production-ish) command; docker-compose overrides this with --reload.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
