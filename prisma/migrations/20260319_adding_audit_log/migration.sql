-- Enable UUID extension (run once if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create AuditLog table
CREATE TABLE "AuditLog" (
                            "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                            "action" TEXT NOT NULL,
                            "entity" TEXT NOT NULL,
                            "entityId" TEXT,
                            "userId" TEXT,
                            "userRole" TEXT,
                            "metadata" JSONB,
                            "ipAddress" TEXT,
                            "userAgent" TEXT,
                            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog" ("userId");
CREATE INDEX "AuditLog_entity_idx" ON "AuditLog" ("entity");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog" ("createdAt");