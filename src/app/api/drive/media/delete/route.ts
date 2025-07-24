import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import {
  deleteFile,
  deleteFolderAndContents,
  getFileById,
  getFilesInFolderTree,
} from "@/lib/requests/drive.requests";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2Client";

export async function DELETE(req: Request): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Non autorisé", { status: 401 });

  let { itemId, itemType } = await req.json();

  if (itemType === "folder") {
    const folderId = parseInt(itemId.replace("folder-", ""), 10);

    // Supprimer tous les fichiers R2 dans le dossier récursif
    const allFiles = await getFilesInFolderTree(folderId);

    for (const file of allFiles) {
      // Extraire la clé dans R2 à partir de l'URL (suppression du prefix)
      const key = file.url.replace(`${process.env.AWS_S3_PUBLIC_URL}/`, "");
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: key,
      });
      await r2.send(command);
    }

    // Ensuite supprimer en base
    await deleteFolderAndContents(folderId);
  } else {
    const fileId = parseInt(itemId.replace("file-", ""), 10);

    const file = await getFileById(fileId);
    if (!file) return new Response("Fichier introuvable", { status: 404 });

    const key = file.url.replace(`${process.env.AWS_S3_PUBLIC_URL}/`, "");
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    });
    await r2.send(command);

    await deleteFile(fileId);
  }

  return new Response("Élément supprimé", { status: 200 });
}
