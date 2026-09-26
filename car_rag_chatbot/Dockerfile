# Car RAG Chatbot - FastAPI service
# NOTE: requirements.txt pins a CUDA build of torch (2.6.0+cu124) plus nvidia-* / triton.
# Those only install on GPU hosts. For a portable CPU image we filter them out and
# install the CPU build of torch instead. On a GPU node pool you can build a CUDA
# variant later. LLM (Phi-3) inference on CPU is slow/large; the health endpoint and
# embeddings work fine for local development.

FROM python:3.11-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HOME=/models

WORKDIR /app

# System deps for building some wheels (cffi/cryptography) and healthcheck
RUN apt-get update \
 && apt-get install -y --no-install-recommends build-essential curl \
 && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./

# Install CPU torch first, then the rest of the requirements minus the CUDA-only pins.
# NOTE: requirements.txt is missing the web-server deps (fastapi, uvicorn) that the
# app imports, so we install them explicitly here. Consider adding them to
# requirements.txt as well.
RUN grep -viE '^(torch==|nvidia-|triton==)' requirements.txt > /tmp/requirements.cpu.txt \
 && pip install --no-cache-dir torch==2.6.0 --index-url https://download.pytorch.org/whl/cpu \
 && pip install --no-cache-dir -r /tmp/requirements.cpu.txt \
 && pip install --no-cache-dir "fastapi==0.115.6" "uvicorn[standard]==0.34.0"

# App code
COPY . .

# Non-root user + writable model cache dir
RUN useradd -m appuser && mkdir -p /models && chown -R appuser:appuser /app /models
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD curl -fsS http://localhost:8000/ || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
