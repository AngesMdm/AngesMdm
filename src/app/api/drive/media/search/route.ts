import type { NextApiRequest, NextApiResponse } from "next";
import { searchMediaAndFolders } from "@/lib/requests/drive.requests";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getUpdatedDate } from "@/lib/requests/drive.requests";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     const searchTerm = req.query.query as string;
//     if (!searchTerm) return res.status(400).json({ error: "Paramètre query manquant" });

//     try {
//         const likePattern = `%${searchTerm}%`;

//         const { folders, mediaFiles } = await searchMediaAndFolders(likePattern);
//         if (!folders || !mediaFiles) {
//             return res.status(404).json({ error: "Aucun résultat trouvé" });
//         }
//         res.status(200).json({
//             folders: folders,
//             mediaFiles: mediaFiles
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Erreur serveur" });
//     }
// }

// TODO juste pour build
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
