# Smart Auto Hub

A full-stack vehicle dealership / consultation platform built as a final-year project, now being re-architected for a **cloud + DevOps** workflow (Docker → Kubernetes → Terraform → Jenkins) on **Oracle Cloud Infrastructure (OCI)**.

---

## 1. What's in this repo

This repository contains **two independently deployable services**:

| # | Service | Path | Stack | Port |
|---|---------|------|-------|------|
| 1 | **Web app** (frontend + backend together) | repo root | Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Prisma, NextAuth | 3000 |
| 2 | **RAG chatbot** (microservice) | `car_rag_chatbot/` | Python, FastAPI, sentence-transformers, PyTorch, Supabase pgvector | 8000 |

> **Note on "frontend vs backend":** In Next.js the UI (`app/**/page.tsx`) and the backend (`app/api/**/route.ts` + `app/actions/*`) run in the **same** Node process. They are **not** two separate images. The real service split is **Web app** vs **Python chatbot**.

### Web app layout (root)
```
app/                Next.js App Router — pages, layouts
  api/              55+ REST API routes (backend)
  actions/          Server actions (backend logic)
  (auth)/ admin/ dashboard/ advisor-dashboard/ ...  feature areas
components/          React UI components (Radix + shadcn/ui)
lib/                Server utilities: prisma.ts, email, storage, auth guard
prisma/             schema.prisma (PostgreSQL) + migrations + seed
services/ hooks/ utils/ constants/ types/
__tests__/          Jest + Testing Library
Dockerfile          Multi-stage build for the web app
.github/workflows/  Existing CI/CD (currently AWS/EC2-oriented)
```

### Chatbot layout (`car_rag_chatbot/`)
```
app/main.py             FastAPI entrypoint (health + /api/v1/chat)
app/core/               embeddings, LLM, intent routing, RAG handler
app/database/           Supabase client + vector store
app/ingest/             car data ingestion into vector DB
requirements.txt        Python dependencies
```

## 2. Data layer

- **PostgreSQL via Supabase** — the web app uses **Prisma** (`DATABASE_URL`, `DIRECT_URL`); the chatbot uses **Supabase pgvector** (`SUPABASE_URL`, `SUPABASE_KEY`).
- Recommendation: **keep Supabase** for the first cloud deployment (managed Postgres + pgvector out of the box). Migrating to self-hosted Postgres+pgvector on Kubernetes or **OCI Database with PostgreSQL** is planned as a later DevOps exercise.

## 3. Running locally

Requires **Node.js 20+** (Next.js 16 requirement — see `.nvmrc`) and **Python 3.11+**.

### Web app
```bash
nvm use            # picks up .nvmrc (Node 20)
npm install
npx prisma generate
npm run dev        # http://localhost:3000
```

### Chatbot
```bash
cd car_rag_chatbot
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000   # http://localhost:8000
```

### Environment variables
Create a `.env` in the repo root (web app):
```
DATABASE_URL=postgresql://...       # Supabase pooled connection
DIRECT_URL=postgresql://...         # Supabase direct connection (migrations)
RESEND_API_KEY=...
EMAIL_USER=...
EMAIL_PASS=...
```
And a `.env` in `car_rag_chatbot/`:
```
SUPABASE_URL=...
SUPABASE_KEY=...
```

## 4. Docker

A multi-stage `Dockerfile` for the web app already exists (Node 20 Alpine, Prisma generate, `next build`, non-root runtime, port 3000).

```bash
# Web app image
docker build -t smart-auto-hub-web:local .
docker run -p 3000:3000 --env-file .env smart-auto-hub-web:local
```

The chatbot has its own `car_rag_chatbot/Dockerfile` (python:3.11-slim, CPU build of torch, `uvicorn` on 8000).

### Run the whole stack locally with Docker Compose
```bash
cp .env.docker.example .env                     # web app secrets
cp .env.docker.example car_rag_chatbot/.env     # SUPABASE_URL / SUPABASE_KEY
docker compose up --build
```
This starts:
- `db` — Postgres 16 + pgvector (serves the web app via Prisma; migrations run automatically)
- `web` — Next.js app on http://localhost:3000
- `chatbot` — FastAPI on http://localhost:8000

Notes:
- The **chatbot uses the Supabase SDK**, so it points at your cloud Supabase project (not the local `db`).
- The chatbot loads **Phi-3 locally**; on CPU-only machines, `/chat` is slow and downloads several GB on first call. The health endpoint and embeddings work regardless. A CUDA image + GPU node pool is the target for production inference.

## 5. Cloud + CI/CD roadmap (in progress)

Goal: run the whole stack on **Oracle Cloud Infrastructure** with an automated pipeline.

- [x] Local dev environment working (Node 20)
- [x] Web app Dockerfile
- [x] Chatbot Dockerfile
- [x] `docker-compose.yml` to run web + chatbot + local pgvector Postgres together
- [ ] Push images to **OCI Container Registry (OCIR)**
- [ ] **Kubernetes (OKE)** manifests / Helm chart: Deployments, Services, Ingress, Secrets, HPA
- [ ] **Ingress + TLS**: OCI Load Balancer via NGINX ingress + cert-manager
- [ ] **Terraform**: provision VCN, OKE cluster + node pool, OCIR (Infrastructure as Code)
- [ ] **Jenkins** pipeline: build → test → build/push images → deploy to OKE
- [ ] Database decision: keep Supabase → later migrate to pgvector on OKE or OCI PostgreSQL

### Target architecture
```
                 ┌────────────────────── OCI ──────────────────────┐
  Developer ──►  │  OCIR (images)   OKE (Kubernetes cluster)        │
  git push       │                   ├─ web app Deployment  :3000   │
      │          │                   ├─ chatbot Deployment  :8000   │
      ▼          │                   └─ NGINX Ingress + LB (TLS)    │
  Jenkins  ──────┼──► build+test+push+deploy                        │
                 └───────────────┬──────────────────────────────────┘
                                 ▼
                       Supabase Postgres (pgvector)   ← (later: OCI-managed)
```

## 6. Existing CI/CD (to be reworked)

`.github/workflows/` currently contains AWS/EC2-oriented pipelines:
- `ci.yml` — install, Prisma validate, migrate, test, build
- `docker-build.yml` — build & push image to Docker Hub
- `deploy.yml` — SSH deploy to an EC2 host with pm2
- `test-on-multiple-os.yml` — multi-OS matrix demo

These will be superseded/complemented by the **Jenkins + OKE** pipeline above (OCIR instead of Docker Hub, `kubectl`/Helm instead of pm2-on-EC2).

## 7. Testing

```bash
npm test          # Jest + React Testing Library
```

---
*Re-architecture in progress — see the roadmap in section 5 for current status.*
