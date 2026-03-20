// app/api/audit-logs/route.ts
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const action = searchParams.get("action");
  const search = searchParams.get("search") || "";

  const skip = (page - 1) * limit;

  const where: any = {
    AND: [
      action && action !== "ALL" ? { action } : {},
      search
        ? {
            OR: [
              { action: { contains: search, mode: "insensitive" } },
              { entity: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
    ],
  };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return Response.json({ logs, total });
}