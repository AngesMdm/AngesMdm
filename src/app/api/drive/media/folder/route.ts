// app/api/drive/media/folder/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { createFolder } from "@/lib/requests/drive.requests";

export async function POST(req: Request): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Non autorisé", { status: 401 });

  let { name, parentId } = await req.json();
  parentId = parentId ? parentId.replace("folder-", "") : null;
  const numParentId = parentId ? parseInt(parentId, 10) : null;

  const newFolderId = await createFolder(name, numParentId);

  return new Response(JSON.stringify({
    id: `folder-${newFolderId}`,
    name,
    parentId,
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
