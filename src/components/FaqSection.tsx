"use client";

import { useEffect, useState } from "react";
import { TrashIcon, EditIcon } from "@/components/svg/edit.svg";
import { FAQ } from "@/types/type";

type FAQWithState = FAQ & { open: boolean };
type Props = { session: any; isAdmin: boolean };

export default function FaqSection({ session, isAdmin }: Props) {
    const [faqList, setFaqList] = useState<FAQWithState[]>([]);
    const [newQuestion, setNewQuestion] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editContent, setEditContent] = useState({ question: "", answer: "" });

    function toggleFaq(index: number) {
        setFaqList((prev = []) => prev.map((faq, i) => (i === index ? { ...faq, open: !faq.open } : faq)));
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

    useEffect(() => { fetchFaqList(); }, []);

    function handleAddQuestion() {
        if (newQuestion.trim() !== "") {
            fetch("/api/drive/faq/question", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: newQuestion, userId: session?.user?.id }),
            }).then(() => fetchFaqList()).catch((err) => console.error(err));
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
        }).then(() => {
            setEditingIndex(null);
            fetchFaqList();
        }).catch(console.error);
    }

    function handleDeleteAnswer(id: number) {
        if (!confirm("Supprimer cette réponse ?")) return;
        fetch("/api/drive/faq/answer", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ answerId: id }),
        }).then(() => fetchFaqList()).catch(console.error);
    }

    function handleDeleteQuestion(id: number) {
        if (!confirm("Supprimer cette question ?")) return;
        fetch("/api/drive/faq/question", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionId: id }),
        }).then((res) => {
            if (!res.ok) throw new Error("Erreur lors de la suppression");
            return res.json();
        }).then(() => fetchFaqList()).catch(console.error);
    }

    return (
        <section style={{ marginTop: "3rem" }}>
            <h2>FAQ</h2>
            <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
                <input type="text" placeholder="Posez votre question..." value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #666", backgroundColor: "var(--background-soft)", color: "white" }} />
                <button onClick={handleAddQuestion} style={{ padding: "0.75rem 1.5rem", fontSize: "1rem", backgroundColor: "var(--orange-color)", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--orange-color-hover)")} onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--orange-color)")}>Envoyer</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {faqList.map((faq, index) => (
                    <div key={index} onClick={() => toggleFaq(index)} style={{ backgroundColor: faq.answer ? "var(--card-bg)" : "#3b2f2f", borderLeft: `6px solid ${faq.answer ? "var(--orange-color)" : "#999"}`, borderRadius: "8px", padding: "1rem", cursor: "pointer", position: "relative" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ color: "var(--orange-color)", fontWeight: "bold" }}>❓: {faq.question}</span>
                            <span style={{ transform: faq.open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▶</span>
                        </div>
                        {isAdmin && (
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(faq.id); }} style={{ position: "absolute", top: "10px", right: "40px", backgroundColor: "#e74c3c", border: "none", borderRadius: "4px", padding: "0.4rem 0.7rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} title="Supprimer la question">
                                <TrashIcon width={16} height={16} />
                            </button>
                        )}
                        {faq.open && (
                            <div style={{ marginTop: "0.7rem", padding: "0.75rem 1rem", backgroundColor: "var(--background-soft)", borderLeft: "4px solid var(--orange-color)", borderRadius: "4px", color: "var(--main-color)" }}>
                                {editingIndex === index ? (
                                    <>
                                        <input value={editContent.question} onChange={(e) => setEditContent({ ...editContent, question: e.target.value })} placeholder="Modifier la question" style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "4px", border: "1px solid #666" }} onClick={(e) => e.stopPropagation()} />
                                        <textarea value={editContent.answer} onChange={(e) => setEditContent({ ...editContent, answer: e.target.value })} placeholder="Modifier ou ajouter une réponse" style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "4px", border: "1px solid #666" }} onClick={(e) => e.stopPropagation()} />
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            <button onClick={(e) => { e.stopPropagation(); handleEditSubmit(faq.id); }} style={{ backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", padding: "0.6rem 1rem", cursor: "pointer" }}>Enregistrer</button>
                                            <button onClick={(e) => { e.stopPropagation(); setEditingIndex(null); }} style={{ backgroundColor: "#999", color: "white", border: "none", borderRadius: "4px", padding: "0.6rem 1rem", cursor: "pointer" }}>Annuler</button>
                                        </div>
                                    </>
                                ) : faq.answer ? (
                                    <> <strong style={{ color: "#90ee90" }}>R :</strong> {faq.answer} </>
                                ) : (
                                    <>
                                        <strong style={{ color: "#ffcc00" }}>En attente :</strong> Cette question n’a pas encore reçu de réponse.
                                        {isAdmin && (
                                            <div style={{ marginTop: "0.5rem" }}>
                                                <button onClick={(e) => { e.stopPropagation(); handleEdit(index); }} style={{ backgroundColor: "#4CAF50", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer" }}>Répondre</button>
                                            </div>
                                        )}
                                    </>
                                )}
                                {isAdmin && editingIndex !== index && faq.answer && (
                                    <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
                                        <button onClick={(e) => { e.stopPropagation(); handleEdit(index); }} style={{ backgroundColor: "#3498db", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer" }} title="Éditer">
                                            <EditIcon width={16} height={16} />
                                        </button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteAnswer(faq.answerid || 0); }} style={{ backgroundColor: "#e74c3c", color: "white", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", cursor: "pointer" }} title="Supprimer">
                                            <TrashIcon width={16} height={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
