"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type File = {
    id: string;
    name: string;
    type: "file";
    fileType: "image" | "video";
    url: string;
};

type Folder = {
    id: string;
    name: string;
    type: "folder";
    children: Array<File | Folder>;
};

const exampleData: Folder = {
    id: "root",
    name: "Racine",
    type: "folder",
    children: [
        {
            id: "folder1",
            name: "Photos et Vidéos",
            type: "folder",
            children: [
                {
                    id: "folder1-1",
                    name: "Vidéos",
                    type: "folder",
                    children: [
                        {
                            id: "vid2",
                            name: "oui.mp4",
                            type: "file",
                            fileType: "video",
                            url: "/assets/images/oui.MP4",
                        },
                    ],
                },
                {
                    id: "img1",
                    name: "le logo la.jpg",
                    type: "file",
                    fileType: "image",
                    url: "/assets/images/logo.png",
                },
                {
                    id: "vid1",
                    name: "Meilleur QB de France.mp4",
                    type: "file",
                    fileType: "video",
                    url: "/assets/images/rickroll.mp4",
                },
            ],
        },
        {
            id: "folder2",
            name: "Images",
            type: "folder",
            children: [
                {
                    id: "img2",
                    name: "logo.jpg",
                    type: "file",
                    fileType: "image",
                    url: "/assets/images/logo.png",
                },
            ],
        },
    ],
};

export default function Drive() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [pathStack, setPathStack] = useState<Folder[]>([exampleData]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/");
        }
    }, [status, router]);

    if (status === "loading") return <p>Chargement...</p>;
    if (!session) return null;

    const currentFolder = pathStack[pathStack.length - 1];

    function openFolder(folder: Folder) {
        setPathStack((prev) => [...prev, folder]);
        setSelectedFile(null);
    }

    function goBack() {
        if (pathStack.length > 1) {
            setPathStack((prev) => prev.slice(0, prev.length - 1));
            setSelectedFile(null);
        }
    }

    function closePopup() {
        setSelectedFile(null);
    }

    return (
        <main style={{ padding: "1rem", marginTop: "5rem", height: "700px" }}>{/* heigt tempoaire */}
            <h1>Mon Drive</h1>

            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <button onClick={goBack} disabled={pathStack.length === 1} style={{ padding: "0.5rem 1rem", backgroundColor: pathStack.length === 1 ? "#ccc" : "#0070f3", color: "white", border: "none", borderRadius: "6px", cursor: pathStack.length === 1 ? "not-allowed" : "pointer" }}> ← Retour </button>
                <span>Chemin : {pathStack.map((f) => f.name).join(" / ")}</span>
            </div>

            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "flex-start" }}>
                {currentFolder.children.length === 0 && <p>Ce dossier est vide.</p>}

                {currentFolder.children.map((item) =>
                    item.type === "folder" ? (
                        <div key={item.id} style={{ cursor: "pointer", border: "1px solid #aaa", borderRadius: "8px", padding: "1rem", width: "150px", textAlign: "center" }} onClick={() => openFolder(item)} >
                            <div style={{ fontSize: "3rem" }}>📁</div>
                            <div>{item.name}</div>
                        </div>
                    ) : (
                        <div
                            key={item.id}
                            style={{ cursor: "pointer", border: selectedFile?.id === item.id ? "2px solid blue" : "1px solid #ccc", borderRadius: "8px", padding: "0.5rem", width: "150px", textAlign: "center" }} onClick={() => setSelectedFile(item)}>
                            {item.fileType === "image" ? (
                                <img src={item.url} alt={item.name} style={{ width: "100%", borderRadius: "6px" }} />
                            ) : (
                                <video src={item.url} style={{ width: "100%", borderRadius: "6px" }} muted preload="metadata" />
                            )}
                            <div style={{ marginTop: "0.3rem" }}>{item.name}</div>
                        </div>
                    )
                )}
            </div>

            {/* Popup de prévisualisation */}
            {selectedFile && (
                <div
                    style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}
                    onClick={closePopup}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: "white", borderRadius: "12px", padding: "1rem", maxWidth: "80vw", maxHeight: "80vh", overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center", }}
                    >
                        <h2>{selectedFile.name}</h2>
                        {selectedFile.fileType === "image" ? (
                            <img src={selectedFile.url} alt={selectedFile.name} style={{ maxWidth: "100%", maxHeight: "60vh", borderRadius: 8 }} />
                        ) : (
                            <video controls src={selectedFile.url} style={{ maxWidth: "100%", maxHeight: "60vh", borderRadius: 8 }} />
                        )}
                        <a
                            href={selectedFile.url}
                            download={selectedFile.name}
                            style={{ marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#0070f3", color: "white", borderRadius: "6px", textDecoration: "none", }}
                        >
                            Télécharger
                        </a>
                        <button
                            onClick={closePopup}
                            style={{ marginTop: "0.5rem", padding: "0.3rem 0.7rem", backgroundColor: "#999", color: "white", borderRadius: "6px", border: "none", cursor: "pointer", }}
                        >
                            Fermer
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}
