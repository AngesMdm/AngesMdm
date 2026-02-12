"use client";
import { Folder } from "@/types/type";

let db: IDBDatabase | null = null;

// Initialisation du IndexedDB côté client uniquement
const initDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    if (db) return resolve(db);

    const request = indexedDB.open("driveCache", 1);

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains("folders")) {
        database.createObjectStore("folders", { keyPath: "folderId" });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onerror = () => reject(request.error);
  });

// Récupérer un dossier depuis le cache
export const getFolderFromCache = async (folderId: string): Promise<Folder | undefined> => {
  try {
    const database = await initDB();
    return new Promise((resolve) => {
      const tx = database.transaction("folders", "readonly");
      const store = tx.objectStore("folders");
      const req = store.get(folderId);
      
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(undefined);
    });
  } catch (e) {
    console.error("Erreur IndexedDB get:", e);
    return undefined;
  }
};

export const saveFolderToCache = async (folder: Folder): Promise<void> => {
  if (!folder.id) {
    console.error("Impossible de mettre en cache le dossier : id manquant", folder);
    return;
  }

  try {
    const database = await initDB();
    const tx = database.transaction("folders", "readwrite");
    const store = tx.objectStore("folders");
    store.put(folder);
  } catch (e) {
    console.error("Erreur IndexedDB put:", e);
  }
};
