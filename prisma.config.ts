import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config({ path: ".env" });

export default defineConfig({
    schema: "./prisma/schema.prisma",
    seed: {
        command: "node prisma/seed.js",
    },
});
