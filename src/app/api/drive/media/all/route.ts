import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getAllFolders } from "@/lib/requests/drive.requests";
import { Folder, MediaFile } from "@/types/type";


export async function GET(req: Request): Promise<Response> {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
  }

  const { folders, mediaFiles } = await getAllFolders();

  const foldersMap: Record<string, Folder & { parent_id: number | null }> = {};

  for (const folder of folders) {
    const folderId = `folder-${folder.id}`;
    foldersMap[folderId] = {
      id: folderId,
      name: folder.name,
      type: "folder",
      media_count: folder.media_count,
      children: [],
      parent_id: folder.parent_id,
      updated_at: folder.updated_at || new Date().toISOString(),
    };
  }

  for (const media of mediaFiles) {
    const file: MediaFile = {
      id: `file-${media.id}`,
      name: media.name,
      url: media.url,
      type: "file",
      fileType: media.type,
    };

    const parentId = `folder-${media.folder_id}`;
    if (foldersMap[parentId]) {
      foldersMap[parentId].children.push(file);
    }
  }

  const rootFolders: Folder[] = [];

  for (const [id, folder] of Object.entries(foldersMap)) {
    const { parent_id, ...cleanFolder } = folder;
    const parentKey = parent_id !== null ? `folder-${parent_id}` : null;

    // Trier les enfants : dossiers d'abord, puis fichiers
    cleanFolder.children.sort((a, b) => {
      if (a.type === "folder" && b.type === "file") return -1;
      if (a.type === "file" && b.type === "folder") return 1;
      return a.name.localeCompare(b.name);
    });

    if (!parentKey || !foldersMap[parentKey]) {
      rootFolders.push(cleanFolder);
    } else {
      foldersMap[parentKey].children.push(cleanFolder);
    }
  }

  return new Response(JSON.stringify(rootFolders), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
