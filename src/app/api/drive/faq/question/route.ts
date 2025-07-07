// app/api/private/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { addFaqQuestion, deleteFaqQuestion } from "@/lib/requests/faq.request";

export async function POST(req: Request, context: any): Promise<Response> {
    const session = await getServerSession(authOptions);
    
    
    if (!session) {
        return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }
    
    const requestBody = await req.json();
    const { question, userId } = requestBody;
    try {
        const response = await addFaqQuestion(question, userId);
        return new Response(JSON.stringify(response), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        return new Response(JSON.stringify({ error: "Erreur lors de l'ajout de la question" }), { status: 500 });
    }
}

export async function DELETE(req: Request): Promise<Response> {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }
    const requestBody = await req.json();
    const { questionId } = requestBody;
    try{
        const response = await deleteFaqQuestion(questionId);
    }catch(error){
        return new Response(JSON.stringify({ error: "Erreur lors de la suppression de la question" }), { status: 500 });
    }
    return new Response(JSON.stringify(null), { status: 200, headers: { "Content-Type": "application/json" } });
}
