// app/api/private/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { deleteFaqAnswer, upsertFaqAnswer } from "@/lib/requests/faq.request";

export async function POST(req: Request, context: any): Promise<Response> {
    const session = await getServerSession(authOptions);
    
    
    if (!session) {
        return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }
    
    const requestBody = await req.json();
    const { questionId, answer, userId } = requestBody;
    try {
        const response = await upsertFaqAnswer(questionId, answer, userId);
        return new Response(JSON.stringify(response), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Erreur lors de la mise à jour de la réponse" }), { status: 500 });
    }
}


export async function DELETE(req: Request): Promise<Response> {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }
    const requestBody = await req.json();
    const { answerId } = requestBody;
    try {
        const response = await deleteFaqAnswer(answerId);
    } catch (error) {
        return new Response(JSON.stringify({ error: "Erreur lors de la suppression de la réponse" }), { status: 500 });
    }
    return new Response(JSON.stringify(null), { status: 200, headers: { "Content-Type": "application/json" } });
}
