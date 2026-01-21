import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function checkDBConnection() {

  try{
      await prisma.$queryRaw`SELECT 1`;
      return true;
  }catch(err){
      throw new Error("Database connection failed");
  }

}

