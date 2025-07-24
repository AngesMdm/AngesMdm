// app/api/drive/media/rename/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { renameItem } from "@/lib/requests/drive.requests";

export async function POST(req: Request): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Non autorisé", { status: 401 });

  let { itemType, itemId, newName } = await req.json();
  if (itemType == "Folder") {
    itemId = parseInt(itemId.replace("folder-", ""));
  }else{
    itemId = parseInt(itemId.replace("file-", ""));
  }

  await renameItem(itemType, itemId, newName);

  return new Response("Renommage réussi", { status: 200 });
}
