export async function POST() {
    return new Response(JSON.stringify({ success: true, message: "Feedback received!" }), {
        headers: { "Content-Type": "application/json" },
    });
}