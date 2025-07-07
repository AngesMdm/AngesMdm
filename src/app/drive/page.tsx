"use client";

import { Folder, File, FAQ } from "@/types/type";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TrashIcon, EditIcon } from "@/components/svg/edit.svg";

type FAQWithState = FAQ & { open: boolean };

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
                        { id: "vid2", name: "oui.mp4", type: "file", fileType: "video", url: "/assets/images/oui.MP4" }
                    ]
                },
                { id: "img1", name: "le logo la.jpg", type: "file", fileType: "image", url: "/assets/images/logo.png" },
                { id: "vid1", name: "Meilleur QB de France.mp4", type: "file", fileType: "video", url: "/assets/images/rickroll.mp4" }
            ]
        },
        {
            id: "folder2",
            name: "Images",
            type: "folder",
            children: [
                { id: "img2", name: "logo.jpg", type: "file", fileType: "image", url: "/assets/images/logo.png" }
            ]
        }
    ]
};

export default function Drive() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [pathStack, setPathStack] = useState<Folder[]>([exampleData]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [faqList, setFaqList] = useState<FAQWithState[]>([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editContent, setEditContent] = useState({ question: "", answer: "" });

    const isAdmin = session?.user?.admin === true;

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
    function toggleFaq(index: number) {
        setFaqList((prev = []) =>
            prev.map((faq, i) => (i === index ? { ...faq, open: !faq.open } : faq))
        );
    }

    const fetchFaqList = async () => {
        try {
            const response = await fetch("/api/drive/faq/all");
            if (!response.ok) throw new Error("Erreur lors de la récupération des FAQ");
            const data = (await response.json()) as FAQ[];
            setFaqList(data.map((faq) => ({ ...faq, open: false })));
        } catch (error) {
            console.error("Erreur lors de la récupération des FAQ :", error);
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") router.push("/");
    }, [status, router]);

    function handleAddQuestion() {
        if (newQuestion.trim() !== "") {
            fetch("/api/drive/faq/question", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: newQuestion, userId: session?.user?.id }),
            })
                .then(() => fetchFaqList())
                .catch((err) => console.error(err));

            setNewQuestion("");
        }
    }

    function handleEdit(index: number) {
        const current = faqList[index];
        setEditingIndex(index);
        setEditContent({ question: current.question, answer: current.answer ?? "" });
    }

    function handleEditSubmit(id: number) {
        fetch("/api/drive/faq/answer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId: id, ...editContent, userId: session?.user?.id }),
        })
            .then(() => {
                setEditingIndex(null);
                fetchFaqList();
            })
            .catch(console.error);
    }

    function handleDeleteAnswer(id: number) {
        if (!confirm("Supprimer cette réponse ?")) return;
        fetch("/api/drive/faq/answer", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answerId: id }),
        })
            .then(() => fetchFaqList())
            .catch(console.error);
    }

    function handleDeleteQuestion(id: number) {
        if (!confirm("Supprimer cette question ?")) return;
        fetch("/api/drive/faq/question", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId: id }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Erreur lors de la suppression");
                return res.json();
            })
            .then(() => fetchFaqList())
            .catch(console.error);
    }

    useEffect(() => {
        fetchFaqList();
    }, []);

    if (status === "loading") return <p>Chargement...</p>;
    if (!session) return null;

    return (
        <main style={{ padding: "1rem", marginTop: "5rem", minHeight: "700px", backgroundColor: "var(--background)", color: "var(--main-color)" }}>
            <h1>Mon Drive</h1>

            <div style={{ marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <button onClick={goBack} disabled={pathStack.length === 1} style={{ padding: "0.5rem 1rem", backgroundColor: pathStack.length === 1 ? "#ccc" : "var(--orange-color)", color: "white", border: "none", borderRadius: "6px", cursor: pathStack.length === 1 ? "not-allowed" : "pointer" }}>← Retour</button>
                <span>Chemin : {pathStack.map((f) => f.name).join(" / ")}</span>
            </div>

            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "flex-start" }}>
                {currentFolder.children.length === 0 && <p>Ce dossier est vide.</p>}
                {currentFolder.children.map((item) =>
                    item.type === "folder" ? (
                        <div key={item.id} style={{ cursor: "pointer", border: "1px solid #aaa", borderRadius: "8px", padding: "1rem", width: "150px", textAlign: "center", backgroundColor: "var(--card-bg)", color: "white" }} onClick={() => openFolder(item)}>
                            <div style={{ fontSize: "3rem" }}>📁</div>
                            <div>{item.name}</div>
                        </div>
                    ) : (
                        <div key={item.id} style={{ cursor: "pointer", border: selectedFile?.id === item.id ? "2px solid var(--orange-color)" : "1px solid #ccc", borderRadius: "8px", padding: "0.5rem", width: "150px", textAlign: "center", backgroundColor: "var(--card-bg)", color: "white" }} onClick={() => setSelectedFile(item)}>
                            {item.fileType === "image" ? <img src={item.url} alt={item.name} style={{ width: "100%", borderRadius: "6px" }} /> : <video src={item.url} style={{ width: "100%", borderRadius: "6px" }} muted preload="metadata" />}
                            <div style={{ marginTop: "0.3rem" }}>{item.name}</div>
                        </div>
                    )
                )}
            </div>

            <section style={{ marginTop: "3rem" }}>
                <h2>FAQ</h2>

                <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
                    <input
                        type="text"
                        placeholder="Posez votre question..."
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #666", backgroundColor: "var(--background-soft)", color: "white" }}
                    />
                    <button
                        onClick={handleAddQuestion}
                        style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", backgroundColor: "var(--orange-color)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", transition: "background-color 0.3s ease" }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = "var(--orange-color-hover)"}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = "var(--orange-color)"}
                    >
                        Envoyer
                    </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {(faqList ?? []).map((faq, index) => (
                        <div
                            key={index}
                            onClick={() => toggleFaq(index)}
                            style={{ backgroundColor: faq.answer ? "var(--card-bg)" : "#3b2f2f", borderLeft: `6px solid ${faq.answer ? "var(--orange-color)" : "#999"}`, borderRadius: "8px", padding: "1rem", cursor: "pointer", position: "relative" }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ color: "var(--orange-color)", fontWeight: "bold" }}>❓: {faq.question}</span>
                                <span style={{ transform: faq.open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▶</span>
                            </div>

                            <button
                                onClick={e => {
                                    e.stopPropagation();
                                    handleDeleteQuestion(faq.id);
                                }}
                                style={{ position: "absolute", top: "10px", right: "40px", backgroundColor: "#e74c3c", border: "none", borderRadius: "4px", padding: "0.4rem 0.7rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 0.3s ease" }}
                                title="Supprimer la question"
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#c0392b"}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#e74c3c"}
                            >
                                <TrashIcon width={16} height={16} />
                            </button>

                            {faq.open && (
                                <div style={{ marginTop: "0.7rem", padding: "0.75rem 1rem", backgroundColor: "var(--background-soft)", borderLeft: "4px solid var(--orange-color)", borderRadius: "4px", color: "var(--main-color)" }}>
                                    {editingIndex === index ? (
                                        <>
                                            <input
                                                value={editContent.question}
                                                onChange={(e) => setEditContent({ ...editContent, question: e.target.value })}
                                                placeholder="Modifier la question"
                                                style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "4px", border: "1px solid #666" }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <textarea
                                                value={editContent.answer}
                                                onChange={(e) => setEditContent({ ...editContent, answer: e.target.value })}
                                                placeholder="Modifier ou ajouter une réponse"
                                                style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "4px", border: "1px solid #666" }}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditSubmit(faq.id);
                                                    }}
                                                    style={{ backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", padding: "0.6rem 1rem", cursor: "pointer", fontSize: "1rem", transition: "background-color 0.3s ease" }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
                                                >
                                                    Enregistrer
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingIndex(null);
                                                    }}
                                                    style={{ backgroundColor: "#999", color: "white", border: "none", borderRadius: "4px", padding: "0.6rem 1rem", cursor: "pointer", fontSize: "1rem", transition: "background-color 0.3s ease" }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#666")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#999")}
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </>
                                    ) : faq.answer ? (
                                        <>
                                            <strong style={{ color: "#90ee90" }}>R :</strong> {faq.answer}
                                        </>
                                    ) : (
                                        <>
                                            <strong style={{ color: "#ffcc00" }}>En attente :</strong> Cette question n’a pas encore reçu de réponse.
                                            {isAdmin && (
                                                <div style={{ marginTop: "0.5rem" }}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(index);
                                                        }}
                                                        style={{ display: "flex", alignItems: "center", gap: "0.3rem", backgroundColor: "#4CAF50", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", transition: "background-color 0.3s ease" }}
                                                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#45a049")}
                                                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
                                                    >
                                                        Répondre
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}


                                    {isAdmin && editingIndex !== index && (
                                        <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                                            {faq.answer && (
                                                <>
                                                    <button onClick={(e) => { e.stopPropagation(); handleEdit(index); }} style={{ display: "flex", alignItems: "center", gap: "0.3rem", backgroundColor: "#3498db", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", transition: "background-color 0.3s ease" }} title="Éditer" onMouseEnter={e => e.currentTarget.style.backgroundColor = "#2980b9"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#3498db"}>
                                                        <EditIcon width={16} height={16} />
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteAnswer(faq.answerid || 0); }} style={{ display: "flex", alignItems: "center", gap: "0.3rem", backgroundColor: "#e74c3c", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", transition: "background-color 0.3s ease" }} title="Supprimer" onMouseEnter={e => e.currentTarget.style.backgroundColor = "#c0392b"} onMouseLeave={e => e.currentTarget.style.backgroundColor = "#e74c3c"}>
                                                        <TrashIcon width={16} height={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>


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
        </main>
    );
}
