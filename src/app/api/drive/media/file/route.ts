import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { addFilesToFolder } from "@/lib/requests/drive.requests";
import { r2 } from "@/lib/r2Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

function sanitizeFilename(name: string) {
  // Enlève l'extension, convertit en minuscules et remplace les caractères non alphanum par tirets
  const baseName = name.replace(/\.[^/.]+$/, "");
  return baseName
    .toLowerCase()
    .replace(/[^a-z0-9\-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(req: Request): Promise<Response> {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Non autorisé", { status: 401 });

  const form = await req.formData();
  const folderIdStr = form.get("folderId")?.toString();
  const files = form.getAll("files") as File[];

  if (!folderIdStr || files.length === 0) {
    return new Response("Données manquantes", { status: 400 });
  }

  const folderId = Number(folderIdStr);
  const uploaded: any[] = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split('.').pop();
    const sanitizedBase = sanitizeFilename(file.name);
    const uniqueKey = `${sanitizedBase}-${randomUUID()}.${extension}`;
    const fileType = file.type.startsWith("image") ? "image" : "video";

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: uniqueKey,
      Body: buffer,
      ContentType: file.type,
    });

    await r2.send(command);

    uploaded.push({
      name: file.name,
      url: `${process.env.AWS_S3_PUBLIC_URL}/${uniqueKey}`,
      fileType,
    });
  }

  const insertedFiles = await addFilesToFolder(folderId, uploaded);

  return new Response(JSON.stringify(insertedFiles), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
