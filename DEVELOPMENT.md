# Local Development Guide

This project runs fully in Docker for local development. You do **not** need Node,
Python, Postgres, or Prisma installed on your machine — only Docker.

The stack has 4 containers, all defined in [`docker-compose.dev.yml`](./docker-compose.dev.yml):

| Service    | What it is                          | URL / Port                      |
|------------|-------------------------------------|---------------------------------|
| `postgres` | PostgreSQL 16 + pgvector (the DB)   | `localhost:5432`                |
| `migrate`  | One-shot job: applies migrations + seed, then **exits** | — (no port) |
| `web`      | Next.js web app (hot reload)        | http://localhost:3000           |
| `chatbot`  | Python FastAPI RAG chatbot (hot reload) | http://localhost:8000       |

> The `web` and `migrate` containers are built from the **same** image
> ([`Dockerfile`](./Dockerfile) → `dev` target), so their Node/Prisma versions
> always match.

---

## 1. Prerequisites (one time)

- **Docker** + **Docker Compose** installed.
- Clone the repo.
- The **database connection is already configured** inside `docker-compose.dev.yml`,
  so the app and chatbot talk to the `postgres` container automatically — no setup needed.
- Any **other** secrets (auth secrets, external API keys, chatbot `LLM_MODEL_NAME`
  overrides, etc.) live in local `.env` files that are **git-ignored**:
  - `./.env` (web app)
  - `./car_rag_chatbot/.env` (chatbot)

  These are not committed. Ask a teammate for the current values and create the files
  locally if the app needs them. Never commit real secrets.

---

## 2. Start the whole dev environment

One command starts everything:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

What happens, in order:

1. **postgres** starts and becomes healthy.
2. **migrate** runs `npx prisma migrate deploy` → applies any **not-yet-applied**
   migrations to the DB, then seeds it, then **exits with code 0**.
   (Already-applied migrations are skipped automatically.)
3. **web** and **chatbot** start once `migrate` has finished.

Then open:
- Web app → http://localhost:3000
- Chatbot API → http://localhost:8000

> 💡 `--build` is only strictly needed the first time or when dependencies
> (`package.json` / `requirements.txt`) change. It's safe to always include it.

---

## 3. Day-to-day: making CODE changes

**You do NOT need to restart anything for normal code changes.**

- Edit any web file (`app/`, components, API routes) → `next dev` hot-reloads it live.
- Edit any chatbot file (`car_rag_chatbot/app/`) → `uvicorn --reload` restarts it live.

Just save the file and refresh the browser. The source is bind-mounted into the
containers, so your edits are picked up instantly.

**Rebuild the image only when dependencies change** (you added an npm or pip package):

```bash
docker-compose -f docker-compose.dev.yml up --build
```

---

## 4. Making DATABASE / SCHEMA changes (migrations)

The database schema is owned by Prisma ([`prisma/schema.prisma`](./prisma/schema.prisma)).
**Never hand-edit the DB directly** — always go through a migration so teammates
get the same change.

### Step 1 — Edit the schema
Change `prisma/schema.prisma` (add a model, field, index, etc.).

### Step 2 — Generate the migration (while the stack is running)
```bash
docker-compose -f docker-compose.dev.yml exec web npx prisma migrate dev --name describe_your_change
```
This does two things:
- Creates a new folder: `prisma/migrations/<timestamp>_describe_your_change/migration.sql`
- Applies it to your **running** local DB immediately.

> `migrate dev` = **create + apply** (used by a developer authoring a change).
> `migrate deploy` = **apply existing** (used by the `migrate` container on startup).
> `migrate deploy` never generates migrations — so you must always run `migrate dev` first.

### Step 3 — Commit the generated migration folder
```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "db: describe your change"
git push
```

⚠️ **Always commit the new `prisma/migrations/...` folder.** That folder *is* the
migration — teammates' `migrate` container replays it on their machines.

---

## 5. Pushing your changes

```bash
git add -A
git commit -m "meaningful message"
git push
```
Include both your code **and** any new `prisma/migrations/...` folder in the same push.

---

## 6. Pulling a teammate's changes

When someone else pushed changes (including new migrations):

```bash
git pull
docker-compose -f docker-compose.dev.yml up --build
```

On startup the **migrate** container automatically detects and applies any new
migrations to your existing DB via `prisma migrate deploy` — you don't run any
Prisma command yourself. Your local data is **kept**.

If dependencies changed, `--build` rebuilds the images. That's the whole workflow.

---

## 7. When to use `down`

- **Stop / clear containers** (keeps your database data):
  ```bash
  docker-compose -f docker-compose.dev.yml down
  ```
  Use this only when you want to remove the containers. For everyday work you can
  just `Ctrl+C` the running stack, or leave it running.

- **⚠️ Wipe the database too** (fresh empty DB, re-applies baseline + re-seeds):
  ```bash
  docker-compose -f docker-compose.dev.yml down -v
  ```
  The `-v` flag deletes the `pgdata` volume. **Only use `-v` when you deliberately
  want to reset the database** — you will lose all local data.

> Rule of thumb: `down` = clear containers. `down -v` = also nuke the DB.
> For normal development you rarely need either.

---

## 8. Handy commands

**Chatbot vector ingest** (not run automatically — do it once after the stack is up,
or after adding cars):
```bash
docker-compose -f docker-compose.dev.yml exec chatbot python -m app.ingest.car_ingest
```

**Open a psql shell in the DB:**
```bash
docker exec -it smartautohub-postgres psql -U smartauto -d smartautohub
```

**Check which migrations have been applied:**
```bash
docker exec smartautohub-postgres psql -U smartauto -d smartautohub -c "SELECT migration_name, finished_at FROM _prisma_migrations ORDER BY finished_at;"
```

**View logs for a single service:**
```bash
docker-compose -f docker-compose.dev.yml logs -f web       # or migrate / chatbot / postgres
```

**Rebuild just one service after a dependency change:**
```bash
docker-compose -f docker-compose.dev.yml up --build web
```

---

## TL;DR

| I want to… | Command |
|---|---|
| Start everything | `docker-compose -f docker-compose.dev.yml up --build` |
| Change app code | just save — hot reload, no restart |
| Add a DB change | `... exec web npx prisma migrate dev --name my_change`, then commit `prisma/migrations/` |
| Get teammates' changes | `git pull` → `docker-compose -f docker-compose.dev.yml up --build` |
| Clear containers | `docker-compose -f docker-compose.dev.yml down` |
| Reset the database | `docker-compose -f docker-compose.dev.yml down -v` (destroys data!) |
