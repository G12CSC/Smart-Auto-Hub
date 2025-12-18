import { defineConfig } from "@prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  seed: {
    command: "node prisma/seed.js",
  },
});
