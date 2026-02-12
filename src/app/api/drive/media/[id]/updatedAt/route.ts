import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getUpdatedDate } from "@/lib/requests/drive.requests";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> } 
    ): Promise<Response> {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }

    const { id } = await context.params;
    const folderId = parseInt(id, 10);

    if (isNaN(folderId)) {
        return new Response(JSON.stringify({ error: "ID invalide" }), { status: 400 });
    }

    const updated_at = await getUpdatedDate(folderId);

    return new Response(
        JSON.stringify({
            id: `folder-${folderId}`,
            updated_at,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
    );
}
