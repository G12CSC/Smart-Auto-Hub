"""
PostgreSQL access layer for the chatbot.

This replaces the previous Supabase SDK client. The chatbot now talks to a
plain PostgreSQL database (with the pgvector extension) directly, using the
same DATABASE_URL that the rest of the stack uses. This keeps the chatbot
independent of any hosted provider: the identical code runs against a local
vanilla Postgres in dev and a managed Postgres in the cloud, by changing only
the connection string.
"""

from psycopg_pool import ConnectionPool
from psycopg.rows import dict_row
from pgvector.psycopg import register_vector

from app.config import setting
from app.utils.logger import get_logger

logger = get_logger(__name__)


def _configure_connection(conn) -> None:
    """Enable pgvector type adaptation on every pooled connection."""
    register_vector(conn)


try:
    pool = ConnectionPool(
        conninfo=setting.DATABASE_URL,
        min_size=1,
        max_size=10,
        kwargs={"row_factory": dict_row},
        configure=_configure_connection,
        open=True,
    )
    logger.info("PostgreSQL connection pool initialized successfully")

except Exception as e:
    logger.exception("Failed to initialize PostgreSQL connection pool")
    raise RuntimeError("PostgreSQL connection pool initialization failed") from e
