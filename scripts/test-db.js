import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    try {
        const result = await prisma.$queryRaw`SELECT NOW()`;
        console.log("Database connected successfully!");
        console.log("Time:", result);
    } catch (err) {
        console.error("❌ Failed to connect:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
