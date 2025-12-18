import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$queryRaw`SELECT 1`;
  console.log("✅ Database connected successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
