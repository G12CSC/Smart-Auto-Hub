import { prisma } from "@/lib/prisma";

type AuditLogParams = {
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  userRole?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
};

export async function logAudit(data: AuditLogParams) {
  try {
    await prisma.auditLog.create({
      data,
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}