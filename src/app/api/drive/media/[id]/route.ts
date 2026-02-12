import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getFolderSnapshot } from "@/lib/requests/drive.requests";

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

const { folder, folders, mediaFiles } = await getFolderSnapshot(folderId);

    const children = [
    ...folders.map(f => ({
        id: `folder-${f.id}`,
        name: f.name,
        type: "folder" as const,
        children: [],
        updated_at: f.updated_at,
    })),
    ...mediaFiles.map(m => ({
        id: `file-${m.id}`,
        name: m.name,
        url: m.url,
        type: "file" as const,
        fileType: m.type,
    }))
    ];

    return new Response(
    JSON.stringify({
        id: `folder-${folder.id}`,
        updated_at: folder.updated_at,  // ✅ la date exacte du dossier
        mediaCount: folder.media_count,
        children
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
    );

}
