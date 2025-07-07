// app/api/private/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getFaqList } from "@/lib/requests/faq.request";

export async function GET(req: Request): Promise<Response> {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }
    const faqList = await getFaqList();
    if (!faqList) {
        return new Response(JSON.stringify({ error: "Erreur lors de la récupération des FAQ" }), { status: 500 });
    }
    return new Response(JSON.stringify(faqList), { status: 200, headers: { "Content-Type": "application/json" } });
}
