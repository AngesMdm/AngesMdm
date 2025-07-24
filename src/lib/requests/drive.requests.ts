import { Folder, MediaFile } from "@/types/type";
import Query from "../db";


/**
 * Récupère l'arborescence des dossiers jusqu'à une profondeur donnée
 * @param depth Profondeur maximale à explorer (par défaut 2)
 * @returns Une promesse contenant la liste des dossiers
 */
export async function getFolderTree(depth = 2): Promise<Folder[]> {
  const bddResponse = await Query(`
    WITH RECURSIVE folder_tree AS (
      SELECT id, name, parent_id, created_at, 1 AS depth
      FROM folders
      WHERE parent_id IS NULL

      UNION ALL

      SELECT f.id, f.name, f.parent_id, f.created_at, ft.depth + 1
      FROM folders f
      JOIN folder_tree ft ON f.parent_id = ft.id
      WHERE ft.depth < $1
    )
    SELECT * FROM folder_tree
    ORDER BY parent_id NULLS FIRST, name;
  `, [depth]);

  return bddResponse.rows as Folder[];
}


/**
 * Récupère les fichiers média directement présents dans un dossier (sans sous-dossiers)
 * @param folderId L'identifiant du dossier
 * @param limit Nombre maximum de fichiers à récupérer (facultatif)
 * @param offset Décalage pour la pagination (facultatif)
 * @returns Une promesse contenant les fichiers trouvés
 */
export async function getMediaInFolder(folderId: number, limit = 50, offset = 0): Promise<MediaFile[]> {
  const bddResponse = await Query(`
    SELECT *
    FROM media_files
    WHERE folder_id = $1
    ORDER BY uploaded_at DESC
    LIMIT $2 OFFSET $3;
  `, [folderId, limit, offset]);

  return bddResponse.rows as MediaFile[];
}

/**
 * Récupère tous les fichiers média d’un dossier et de ses sous-dossiers
 * @param folderId L'identifiant du dossier racine
 * @returns Une promesse contenant les fichiers trouvés
 */
export async function getMediaInFolderAndSubfolders(folderId: number): Promise<MediaFile[]> {
  const bddResponse = await Query(`
    WITH RECURSIVE subfolders AS (
      SELECT id FROM folders WHERE id = $1
      UNION ALL
      SELECT f.id FROM folders f
      JOIN subfolders sf ON f.parent_id = sf.id
    )
    SELECT m.*
    FROM media_files m
    WHERE m.folder_id IN (SELECT id FROM subfolders)
    ORDER BY uploaded_at DESC;
  `, [folderId]);

  return bddResponse.rows as MediaFile[];
}

/**
 * Récupère tous les dossiers
 * @returns Une promesse contenant la liste des dossiers
 */
export async function getAllFolders(): Promise<{
  folders: {
    id: number;
    name: string;
    parent_id: number | null;
    created_at: string;
    media_count: number;
  }[];
  mediaFiles: {
    id: number;
    name: string;
    url: string;
    type: "video" | "image";
    folder_id: number;
  }[];
}> {
  const foldersRes = await Query(`
    SELECT id, name, parent_id, created_at, media_count
    FROM folders
    ORDER BY name;
  `);

  const mediaRes = await Query(`
    SELECT id, name, url, type, folder_id
    FROM media_files
    ORDER BY uploaded_at;
  `);

  return {
    folders: foldersRes.rows,
    mediaFiles: mediaRes.rows,
  };
}

/**
 * Récupère les sous-dossiers + les fichiers du dossier demandé (non récursif)
 * @param folderId ID du dossier courant
 */
export async function getFolderSnapshot(folderId: number): Promise<{
  subfolders: Folder[],
  mediaFiles: MediaFile[]
}> {
  const [foldersResponse, filesResponse] = await Promise.all([
    Query(`
      SELECT id, name, parent_id, created_at, media_count
      FROM folders
      WHERE parent_id = $1
      ORDER BY name;
    `, [folderId]),

    Query(`
      SELECT id, name, url, type, uploaded_at, folder_id
      FROM media_files
      WHERE folder_id = $1
      ORDER BY uploaded_at DESC;
    `, [folderId])
  ]);

  return {
    subfolders: foldersResponse.rows as Folder[],
    mediaFiles: filesResponse.rows as MediaFile[],
  };
}

/**
 * Ajoute des fichiers dans un dossier
 * @param folderId ID du dossier cible
 * @param files Liste des fichiers à ajouter
 */
export async function addFilesToFolder(folderId: number, files: { name: string; url: string; fileType: "image" | "video" }[]) {
  if (files.length === 0) return [];

  const values = files.map((_, i) =>
    `($1, $${i * 3 + 2}, $${i * 3 + 3}, $${i * 3 + 4}, NOW())`
  ).join(", ");

  const params = [folderId, ...files.flatMap(f => [f.name, f.url, f.fileType])];

  const res = await Query(`
    INSERT INTO media_files (folder_id, name, url, type, uploaded_at)
    VALUES ${values}
    RETURNING id, name, url, type, folder_id;
  `, params);

  return res.rows.map(row => ({
    id: `file-${row.id}`,
    name: row.name,
    url: row.url,
    type: "file",
    fileType: row.type,
    folder_id: `folder-${row.folder_id}`,
  }));
}


/**
 * Crée un nouveau dossier
 * @param name Nom du dossier
 * @param parentId ID du dossier parent (null si c'est un dossier racine)
 */
export async function createFolder(name: string, parentId: number | null = null): Promise<number> {
  const result = await Query(`
    INSERT INTO folders (name, parent_id, created_at)
    VALUES ($1, $2, NOW())
    RETURNING id;
  `, [name, parentId]);

  return result.rows[0].id;
}


/**
 * Déplace un dossier ou un fichier vers un autre dossier
 * @param itemType Type de l'élément ("folder" ou "file")
 * @param itemId ID de l'élément à déplacer
 * @param targetFolderId ID du dossier cible (null pour déplacer vers la racine)
 */
export async function moveItem(itemType: "folder" | "file", itemId: number, targetFolderId: number | null) {
  if (itemType === "folder") {
    await Query(`
      UPDATE folders
      SET parent_id = $1
      WHERE id = $2;
    `, [targetFolderId, itemId]);
  } else {
    await Query(`
      UPDATE media_files
      SET folder_id = $1
      WHERE id = $2;
    `, [targetFolderId, itemId]);
  }
}

/**
 * Supprime un fichier
 * @param fileId ID du fichier à supprimer
 */
export async function deleteFile(fileId: number) {
  await Query(`
    DELETE FROM media_files
    WHERE id = $1;
  `, [fileId]);
}

/**
 * Supprime un dossier et tout son contenu (fichiers et sous-dossiers)
 * @param folderId ID du dossier à supprimer
 */
export async function deleteFolderAndContents(folderId: number) {
  await Query(`
    WITH RECURSIVE to_delete AS (
      SELECT id FROM folders WHERE id = $1
      UNION ALL
      SELECT f.id FROM folders f
      JOIN to_delete td ON f.parent_id = td.id
    )
    DELETE FROM media_files WHERE folder_id IN (SELECT id FROM to_delete);
  `, [folderId]);

  await Query(`
    WITH RECURSIVE to_delete AS (
      SELECT id FROM folders WHERE id = $1
      UNION ALL
      SELECT f.id FROM folders f
      JOIN to_delete td ON f.parent_id = td.id
    )
    DELETE FROM folders WHERE id IN (SELECT id FROM to_delete);
  `, [folderId]);
}

/**
 * Renomme un dossier ou un fichier
 * @param itemType Type de l'élément ("folder" ou "file")
 * @param itemId ID de l'élément à renommer
 * @param newName Nouveau nom de l'élément
 */
export async function renameItem(itemType: "folder" | "file", itemId: number, newName: string) {
  if (itemType === "folder") {
    await Query(`
      UPDATE folders
      SET name = $1
      WHERE id = $2;
    `, [newName, itemId]);
  } else {
    await Query(`
      UPDATE media_files
      SET name = $1
      WHERE id = $2;
    `, [newName, itemId]);
  }
}

/**
 * Récupère tous les fichiers d'un dossier et de ses sous-dossiers
 * @param folderId ID du dossier dont on veut récupérer les fichiers
 * @returns Une liste d'URLs de fichiers
 */
export async function getFilesInFolderTree(folderId: number): Promise<{ url: string }[]> {
  const result = await Query(`
    WITH RECURSIVE to_delete AS (
      SELECT id FROM folders WHERE id = $1
      UNION ALL
      SELECT f.id FROM folders f
      JOIN to_delete td ON f.parent_id = td.id
    )
    SELECT url FROM media_files WHERE folder_id IN (SELECT id FROM to_delete);
  `, [folderId]);
  return result.rows;
}

/**
 * Récupère un fichier par son ID
 * @param fileId ID du fichier à récupérer
 * @returns L'URL du fichier ou null si non trouvé
 */
export async function getFileById(fileId: number): Promise<{ url: string } | null> {
  const result = await Query(`
    SELECT url FROM media_files WHERE id = $1
  `, [fileId]);

  return result.rows[0] ?? null;
}
