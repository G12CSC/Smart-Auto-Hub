import {NextRequest, NextResponse} from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request:Request,) {

    try{
        const data=await request.json();

        const {name, email, password, role} = data;

        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }
        const existing = await prisma.admin.findUnique({
            where: { email: email.toLowerCase() },
        });

        if(existing) {
            return NextResponse.json(
                { error: "Email already exists" },
                { status: 409 }
            );
        }

        const pwdHash=await bcrypt.hash(password, 10);

        const admin=await prisma.admin.create({
            data:{
                name,
                passwordHash:pwdHash,
                email:email.toLowerCase(),
                role:role.toLowerCase(),
            }

        });

        return NextResponse.json(
            { message: "Staff account created"},
            { status: 201 }
        );
    } catch(error){

        console.error("ADMIN_REGISTER_ERROR:",error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );

    }finally{

    }
}