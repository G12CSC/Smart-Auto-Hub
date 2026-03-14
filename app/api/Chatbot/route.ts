import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {

        const body = await req.json();
        const question = body.question;

        const response = await fetch("http://20.51.112.194:8000/api/v1/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question: question,
                user_id: "123"
            })
        });

        const data = await response.json();

        return NextResponse.json({
            answer: data.answer
        });

    } catch (error) {
        return NextResponse.json(
            { error: "Chatbot server error" },
            { status: 500 }
        );
    }
}