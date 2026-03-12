import { authOptions } from "../../auth/[...nextauth]/route.ts"
import {prisma} from "../../../../lib/prisma.ts";
import {getServerSession} from "next-auth";
import {NextResponse} from "next/server";



export async function GET() {

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const advisor = await prisma.admin.findUnique({
        where: {
            email: session.user.email
        },
        include: {
            advisorProfile: true
        }
    });

    return Response.json(advisor);
}

export async function PATCH(req) {

    const session = await getServerSession(authOptions);
    const body = await req.json()

    const profile = await prisma.advisorProfile.upsert({
        where: {
            adminId: session.user.id
        },

        update: {
            phone: body.phone,
            specialization: body.specialization,
            experience: body.experience,
            avatar: body.avatar
        },

        create: {
            adminId: session.user.id,
            phone: body.phone,
            specialization: body.specialization,
            experience: body.experience,
            avatar: body.avatar
        }
    })

    return Response.json(profile)
}
