import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        const { email, password } = await req.json();

        // find user first
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid Email" },
                { status: 400 }
            );
        }

        const isValid = await bcrypt.compare(password,user.passwordHash);

        if (!isValid) {
            return NextResponse.json(
                { error: "Passwords do not match" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: "Login successful" },
            { status: 200 }
        );
    }
    catch (err) {
        console.log(err);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
