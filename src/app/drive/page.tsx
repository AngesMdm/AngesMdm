"use client";

import { Folder, MediaFile } from "@/types/type";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import FaqSection from "@/components/FaqSection";

const exampleData: Folder = {
    id: "root",
    name: "Racine",
    type: "folder",
    mediaCount: 0,
    children: [
        {
            id: "folder1",
            name: "Photos et Vidéos",
            type: "folder",
            mediaCount: 2,
            children: [
                {
                    id: "folder1-1",
                    name: "Vidéos",
                    type: "folder",
                    mediaCount: 1,
                    children: [{ id: "vid2", name: "oui.mp4", type: "file", fileType: "video", url: "/assets/images/oui.MP4" }],
                },
                { id: "img1", name: "le logo la.jpg", type: "file", fileType: "image", url: "/assets/images/logo.png" },
                { id: "vid1", name: "Meilleur QB de France.mp4", type: "file", fileType: "video", url: "/assets/images/rickroll.mp4" },
            ],
        },
        {
            id: "folder2",
            name: "Images",
            type: "folder",
            mediaCount: 1,
            children: [{ id: "img2", name: "logo.jpg", type: "file", fileType: "image", url: "/assets/images/logo.png" }],
        },
    ],
};

export default function Drive() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [rootFolder, setRootFolder] = useState<Folder>(exampleData);
    const [pathStack, setPathStack] = useState<Folder[]>([exampleData]);
    const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
    let currentFolder = pathStack[pathStack.length - 1];
    const [folderListForMove, setFolderListForMove] = useState<{ id: string; name: string }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Modal déplacement
    const [moveModalOpen, setMoveModalOpen] = useState(false);
    const [moveItemId, setMoveItemId] = useState<string | null>(null);

    const isAdmin = session?.user?.admin === true;

    /**
     * Ouvre un dossier et met à jour le chemin actuel
     * @param folder Dossier à ouvrir
     */
    function openFolder(folder: Folder) {
        setPathStack((prev) => [...prev, folder]);
        setSelectedFile(null);
    }

    /**
     * Retourne au dossier précédent
     */
    function goBack() {
        if (pathStack.length > 1) {
            setPathStack((prev) => prev.slice(0, prev.length - 1));
            setSelectedFile(null);
        }
    }

    /**
     * Ferme la popup de visualisation de fichier
     */
    function closePopup() {
        setSelectedFile(null);
    }

    useEffect(() => {
        if (status === "unauthenticated") router.push("/");
    }, [status, router]);

    /**
     * Met à jour la structure des dossiers
     * @param root Dossier racine
     * @param targetId ID du dossier cible
     * @param updater Fonction de mise à jour
     * @returns Dossier mis à jour
     */
    function updateFolderStructure(root: Folder, targetId: string, updater: (folder: Folder) => void): Folder {
        if (root.id === targetId) {
            updater(root);
            return { ...root };
        }
        if (!root.children) return root;
        return {
            ...root,
            children: root.children.map((child) =>
                child.type === "folder" ? updateFolderStructure(child, targetId, updater) : child
            ),
        };
    }

    /**
     * Trouve un dossier par son ID dans la structure
     * @param folder Dossier à parcourir
     * @param id ID du dossier recherché
     * @returns Dossier trouvé ou null
     */
    function findFolderById(folder: Folder, id: string): Folder | null {
        if (folder.id === id) return folder;
        for (const child of folder.children) {
            if (child.type === "folder") {
                const found = findFolderById(child, id);
                if (found) return found;
            }
        }
        return null;
    }

    /**
     * Crée un nouveau dossier
     * @returns Liste des dossiers à déplacer
     */
    async function handleCreateFolder() {
        const folderName = prompt("Nom du dossier :");
        if (!folderName) return;

        // Appel API
        const res = await fetch("/api/drive/media/folder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: folderName,
                parentId: currentFolder.id,
            }),
        });

        if (!res.ok) {
            alert("Erreur lors de la création du dossier");
            return;
        }

        const newFolder = await res.json();

        const updatedRoot = updateFolderStructure(rootFolder, currentFolder.id, (folder) => {
            folder.children.push({
                id: newFolder.id,
                name: newFolder.name,
                type: "folder",
                mediaCount: 0,
                children: [],
            });
        });

        setRootFolder(updatedRoot);
        setPathStack((prev) => {
            const updatedCurrent = findFolderById(updatedRoot, currentFolder.id)!;
            return [...prev.slice(0, -1), updatedCurrent];
        });
        setFolderListForMove(flattenFolders(updatedRoot));
    }


    /**
     * Gère l'ajout de fichiers via l'input
     * @param event Événement de changement de l'input
     */
    async function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("folderId", currentFolder.id.replace("folder-", ""));

            for (const file of files) {
                formData.append("files", file);
            }

            const response = await fetch("/api/drive/media/file", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'envoi des fichiers.");
            }

            const insertedFiles = await response.json();

            const updatedRoot = updateFolderStructure(rootFolder, currentFolder.id, (folder) => {
                folder.children.push(...insertedFiles);
            });

            setRootFolder(updatedRoot);

            setPathStack((prev) => {
                const updatedCurrent = findFolderById(updatedRoot, currentFolder.id)!;
                return [...prev.slice(0, -1), updatedCurrent];
            });
            setFolderListForMove(flattenFolders(updatedRoot));
        } catch (error) {
            console.error("Erreur lors de l'envoi des fichiers :", error);
            alert("Erreur lors de l'envoi des fichiers.");
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    }


    // Supprime un fichier ou dossier par son id, récursivement pour dossiers
    async function handleDeleteItem(
        itemId: string,
        itemName: string,
        itemType: "folder" | "file" = "folder"
    ) {
        if (!confirm(`Voulez-vous vraiment supprimer "${itemName}" ?`)) return;
        setIsDeleting(true);
        try {
            const res = await fetch("/api/drive/media/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemId, itemType }),
            });

            if (!res.ok) {
                throw new Error(`Erreur lors de la suppression : ${res.statusText}`);
            }

            // Mise à jour de l'état côté client (suppression dans l'arborescence)
            function deleteRecursively(folder: Folder): Folder {
                return {
                    ...folder,
                    children: folder.children
                        .filter((child) => child.id !== itemId)
                        .map((child) =>
                            child.type === "folder" ? deleteRecursively(child) : child
                        ),
                };
            }

            const updatedRoot = deleteRecursively(rootFolder);
            setRootFolder(updatedRoot);

            setPathStack((prev) => {
                const updatedCurrent = findFolderById(updatedRoot, currentFolder.id);
                if (!updatedCurrent) {
                    return [updatedRoot];
                }
                return [...prev.slice(0, -1), updatedCurrent];
            });
            setFolderListForMove(flattenFolders(updatedRoot));

            if (selectedFile?.id === itemId) {
                setSelectedFile(null);
            }
        } catch (error) {
            console.error("Erreur lors de la suppression de l'élément :", error);
            alert("Impossible de supprimer l'élément.");
        } finally {
            setIsDeleting(false);
        }
    }

    // Ouvre la modale déplacement avec l'id de l'item
    function openMoveModal(itemId: string) {
        setMoveItemId(itemId);
        setMoveModalOpen(true);
    }

    // Fonction pour déplacer un item vers un dossier cible
    async function moveItemToFolder(itemId: string, targetFolderId: string) { //TODO 
        if (!itemId) return;

        let itemToMove: MediaFile | Folder | null = null;

        // Supprime l'item de son dossier actuel pour l'extraire
        function removeItem(folder: Folder): Folder {
            return {
                ...folder,
                children: folder.children
                    .filter((child): child is MediaFile | Folder => {
                        if (child.id === itemId) {
                            itemToMove = child as MediaFile | Folder;
                            return false;
                        }
                        return true;
                    })
                    .map((child) => (child.type === "folder" ? removeItem(child as Folder) : child)),
            };
        }

        const rootWithoutItem = removeItem(rootFolder);

        if (!itemToMove) {
            alert("Élément introuvable pour déplacement.");
            return;
        }

        // Vérifie que la cible n'est pas un descendant de l'item à déplacer (évite boucle)
        if ((itemToMove as Folder).type === "folder") {
            const isDescendant = (folder: Folder): boolean => {
                if (folder.id === targetFolderId) return true;
                if (!folder.children) return false;
                return folder.children.some(
                    (child) => child.type === "folder" && isDescendant(child)
                );
            };
            if (isDescendant(itemToMove)) {
                alert(
                    "Impossible de déplacer un dossier dans lui-même ou dans un de ses sous-dossiers."
                );
                return;
            }
        }

        try {
            // Envoie la requête au backend
            const res = await fetch("/api/drive/media/move", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemType: (itemToMove as Folder).type,
                    itemId: (itemToMove as Folder).id.replace(/^folder-|file-/, ""), // enlever préfixe
                    targetFolderId: targetFolderId === "root" ? null : parseInt(targetFolderId.replace(/^folder-/, ""), 10),
                }),
            });

            if (!res.ok) {
                throw new Error(`Erreur lors du déplacement : ${res.statusText}`);
            }

            // Ajoute l’item dans le dossier cible côté client
            const newRoot = updateFolderStructure(rootWithoutItem, targetFolderId, (folder) => {
                folder.children.push(itemToMove!);
            });

            setRootFolder(newRoot);
            setPathStack([newRoot]); // Retour à la racine après déplacement
            setSelectedFile(null);
            setMoveModalOpen(false);
            setMoveItemId(null);
            setFolderListForMove(flattenFolders(newRoot));
        } catch (error) {
            console.error("Erreur lors du déplacement :", error);
            alert("Impossible de déplacer l'élément.");
        }
    }


    // Récupérer la liste plate des dossiers pour la sélection de déplacement
    function flattenFolders(folder: Folder, prefix = ""): { id: string; name: string }[] {
        const currentName = prefix ? prefix + " / " + folder.name : folder.name;
        let list = [{ id: folder.id, name: currentName }];
        if (folder.children) {
            folder.children.forEach((child) => {
                if (child.type === "folder") {
                    list = list.concat(flattenFolders(child, currentName));
                }
            });
        }
        return list;
    }

    /**
     * Met à jour la liste des dossiers pour le déplacement
     */
    const fetchDriveList = async () => {
        try {
            const response = await fetch("/api/drive/media/all");
            if (!response.ok) throw new Error("Erreur lors de la récupération des FAQ");
            const data = (await response.json())[0] as Folder;
            console.log("Données récupérées :", data);
            setRootFolder(data);
            setPathStack([data])
            currentFolder = [data][[data].length - 1]
            setFolderListForMove(flattenFolders(data));
        } catch (error) {
            console.error("Erreur lors de la récupération des FAQ :", error);
        }
    };

    useEffect(() => { fetchDriveList(); }, []);

    if (status === "loading") return <p>Chargement...</p>;
    if (!session) return null;

    return (
        <main style={{ padding: "1rem", marginTop: "5rem", minHeight: "700px", backgroundColor: "var(--background)", color: "var(--main-color)" }}>
            <h1>Mon Drive</h1>
            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <button onClick={goBack} disabled={pathStack.length === 1} style={{ padding: "0.5rem 1rem", backgroundColor: pathStack.length === 1 ? "#ccc" : "var(--orange-color)", color: "white", border: "none", borderRadius: "6px", cursor: pathStack.length === 1 ? "not-allowed" : "pointer" }}>
                    ← Retour
                </button>
                <span>Chemin : {pathStack.map((f) => f.name).join(" / ")}</span>
            </div>

            {isAdmin && (
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                    <button onClick={handleCreateFolder} style={{ padding: "0.5rem 1rem", backgroundColor: "var(--orange-color)", color: "white", borderRadius: "6px", cursor: "pointer" }}>
                        Créer un dossier
                    </button>
                    <button onClick={() => fileInputRef.current?.click()} style={{ padding: "0.5rem 1rem", backgroundColor: "var(--orange-color)", color: "white", borderRadius: "6px", cursor: "pointer" }}>
                        Ajouter des fichiers
                    </button>
                    <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" onChange={handleFileInputChange} style={{ display: "none" }} />
                </div>

            )}
            {isUploading && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
                    <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
                        <p>import en cours...</p>
                    </div>
                </div>
            )}

            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "flex-start" }}>
                {currentFolder.children.length === 0 && <p>Ce dossier est vide.</p>}
                {currentFolder.children.map((item) =>
                    item.type === "folder" ? (
                        <div onClick={() => openFolder(item)} key={item.id} style={{ position: "relative", border: "1px solid #aaa", borderRadius: "8px", padding: "1rem", width: "150px", textAlign: "center", backgroundColor: "var(--card-bg)", color: "white", cursor: "pointer", userSelect: "none" }}>
                            <div style={{ fontSize: "3rem" }}>📁</div>
                            <div>{item.name}</div>
                            {isAdmin && (
                                <div style={{ position: "absolute", top: "5px", right: "5px", display: "flex", gap: "0.3rem" }}>
                                    <button onClick={(e) => { e.stopPropagation(); openMoveModal(item.id); }} style={{ cursor: "pointer", backgroundColor: "#555", color: "white", border: "none", borderRadius: "4px", padding: "0 6px" }} title="Déplacer">↪</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id, item.name, item.type); }} style={{ cursor: "pointer", backgroundColor: "#c00", color: "white", border: "none", borderRadius: "4px", padding: "0 6px" }} title="Supprimer">✕</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div key={item.id} style={{ position: "relative", border: selectedFile?.id === item.id ? "2px solid var(--orange-color)" : "1px solid #ccc", borderRadius: "8px", padding: "0.5rem", width: "150px", textAlign: "center", backgroundColor: "var(--card-bg)", color: "white", cursor: "pointer", userSelect: "none" }}>
                            <div onClick={() => setSelectedFile(item)} style={{ cursor: "pointer" }}>
                                {item.fileType === "image" ? (
                                    <img src={item.url} alt={item.name} style={{ width: "100%", borderRadius: "6px" }} />
                                ) : (
                                    <video src={item.url} style={{ width: "100%", borderRadius: "6px" }} muted preload="metadata" />
                                )}
                                <div style={{ marginTop: "0.3rem" }}>{item.name}</div>
                            </div>
                            {isAdmin && (
                                <div style={{ position: "absolute", top: "5px", right: "5px", display: "flex", gap: "0.3rem" }}>
                                    <button onClick={(e) => { e.stopPropagation(); openMoveModal(item.id); }} style={{ cursor: "pointer", backgroundColor: "#555", color: "white", border: "none", borderRadius: "4px", padding: "0 6px" }} title="Déplacer">↪</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteItem(item.id, item.name, item.type); }} style={{ cursor: "pointer", backgroundColor: "#c00", color: "white", border: "none", borderRadius: "4px", padding: "0 6px" }} title="Supprimer">✕</button>
                                </div>
                            )}
                        </div>
                    )
                )}
            </div>

            {isDeleting && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
                    <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "1rem", textAlign: "center" }}>
                        <p>Suppression en cours...</p>
                    </div>
                </div>
            )}

            {selectedFile && (
                <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={closePopup}>
                    <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "white", borderRadius: "12px", padding: "1rem", maxWidth: "80vw", maxHeight: "80vh", overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h2 style={{ color: "var(--background)" }}>{selectedFile.name}</h2>
                        {selectedFile.fileType === "image" ? <img src={selectedFile.url} alt={selectedFile.name} style={{ maxWidth: "100%", maxHeight: "60vh", borderRadius: 8 }} /> : <video controls src={selectedFile.url} style={{ maxWidth: "100%", maxHeight: "60vh", borderRadius: 8 }} />}
                        <a href={selectedFile.url} download={selectedFile.name} style={{ marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "var(--orange-color)", color: "white", borderRadius: "6px", textDecoration: "none" }}>Télécharger</a>
                        <button onClick={closePopup} style={{ marginTop: "0.5rem", padding: "0.3rem 0.7rem", backgroundColor: "#999", color: "white", borderRadius: "6px", border: "none", cursor: "pointer" }}>Fermer</button>
                    </div>
                </div>
            )}

            {isAdmin && moveModalOpen && (
                <div onClick={() => setMoveModalOpen(false)} style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000 }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "var(--card-bg)", borderRadius: "8px", padding: "1rem", width: "300px", maxHeight: "80vh", overflowY: "auto" }}>
                        <h3>Choisir un dossier de destination</h3>
                        <ul style={{ listStyle: "none", padding: 0, maxHeight: "60vh", overflowY: "auto" }}>
                            {folderListForMove.map((folder) => (
                                <li key={folder.id} style={{ marginBottom: "0.5rem" }}>
                                    <button
                                        onClick={() => moveItemToFolder(moveItemId!, folder.id)}
                                        style={{ width: "100%", padding: "0.3rem 0.6rem", borderRadius: "4px", border: "1px solid var(--orange-color)", backgroundColor: folder.id === currentFolder.id ? "var(--orange-color)" : "transparent", color: folder.id === currentFolder.id ? "white" : "var(--orange-color)", cursor: "pointer", textAlign: "left", }}>
                                        {folder.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setMoveModalOpen(false)} style={{ marginTop: "0.5rem", padding: "0.4rem 0.8rem", backgroundColor: "var(--orange-color)", border: "none", borderRadius: "6px", cursor: "pointer", color: "white", width: "100%" }}>
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            <FaqSection session={session} isAdmin={isAdmin} />
        </main>
    );

}
