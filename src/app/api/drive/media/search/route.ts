import { searchMediaAndFolders } from "@/lib/requests/drive.requests";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request): Promise<Response> {
    const session = await getServerSession(authOptions);

    if (!session) {
        return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim() ?? "";

    if (query.length < 2) {
        return new Response(JSON.stringify({ folders: [], mediaFiles: [] }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const { folders, mediaFiles } = await searchMediaAndFolders(query);

        return new Response(JSON.stringify({
            folders: folders.map((folder) => ({
                id: `folder-${folder.id}`,
                name: folder.name,
                type: "folder",
                path: folder.path_names.join(" / "),
                pathIds: folder.path_ids.map((id) => `folder-${id}`),
            })),
            mediaFiles: mediaFiles.map((file) => ({
                id: `file-${file.id}`,
                name: file.name,
                type: "file",
                fileType: file.type,
                url: file.url,
                path: file.path_names.join(" / "),
                pathIds: file.path_ids.map((id) => `folder-${id}`),
            })),
        }), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error("Erreur lors de la recherche du drive :", error);
        return new Response(JSON.stringify({ error: "Erreur serveur" }), { status: 500 });
    }
}
