// app/api/drive/media/move/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { moveItem } from "@/lib/requests/drive.requests";

export async function POST(req: Request): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Non autorisé", { status: 401 });

  let { itemType, itemId, targetFolderId } = await req.json();

  const numericItemId = parseInt(itemId, 10);
  const numericTargetFolderId = targetFolderId === null ? null : parseInt(targetFolderId, 10);

  await moveItem(itemType, numericItemId, numericTargetFolderId);

  return new Response("Déplacement réussi", { status: 200 });
}
