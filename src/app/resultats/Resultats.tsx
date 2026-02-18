"use client"
import { use, useEffect, useState } from "react"

type Day = { id: number; label: string; date: string }
type Club = { label: string, logo?: string }
type Ranking = { position: number; club: Club; points: number; j: number; g: number; n: number; p: number; points_won: number; points_loss: number; points_diff: number }
type Team = { name: string; score: number }
type Match = { id: number; date: string; team_a: Team; team_b: Team }

type ChampionshipData = {
    days: Day[]
    rankings: Ranking[]
    matches: Match[]
}

export default function Resultats() {

    const [selectedCoupe, setSelectedCoupe] = useState<string>("Coupe de France")
    const [listPhase, setListPhase] = useState<string[]>([])
    const [selectedPhase, setSelectedPhase] = useState<string>("")
    const [data, setData] = useState<ChampionshipData | null>(null)
    const [openDayId, setOpenDayId] = useState<number | null>(null)

    const fetchPhases = async (coupe: string) => {
        const res = await fetch(`/api/resultats/${encodeURIComponent(coupe)}/list`)
        const data = await res.json();
        let phases = data.phases as string[];
        for (let i = 0; i < phases.length; i++) {
            phases[i] = phases[i].slice(1);
        }
        setListPhase(phases);
        if (phases.length > 0) {
            const firstPhase = phases[0];
            setSelectedPhase(firstPhase);
            fetchResults(coupe, "1" + firstPhase);
        }
    }

    const fetchResults = async (coupe: string, phase: string) => {
        const res = await fetch(`/api/resultats/${encodeURIComponent(coupe)}/${encodeURIComponent(phase)}`)
        const data = await res.json();
        setData(data);
    }

    useEffect(() => {
        fetchPhases(selectedCoupe)
    }, [selectedCoupe])

    useEffect(() => {
        if (selectedPhase) {
            fetchResults(selectedCoupe, listPhase.indexOf(selectedPhase) + 1 + selectedPhase)
        }
    }, [selectedPhase])

    if (!data) return <p>Chargement des résultats...</p>

    const handleDayToggle = (id: number) => setOpenDayId(openDayId === id ? null : id)

    return (
        <div style={{ fontFamily: "Arial, sans-serif", padding: "100px 10px 0 10px", width: "65%", margin: "0 auto", color: "#fff" }}>
            <h1 style={{ marginBottom: 40, fontSize: "2rem", fontWeight: 700, letterSpacing: "1px" }}>Résultats & Classements</h1>

            <div style={{ display: "flex", gap: 10, marginBottom: 25 }}>
                {["Championnat Mixte", "Coupe de France", "Football Américain"].map(coupe => (
                    <button key={coupe} onClick={() => setSelectedCoupe(coupe)} style={{ padding: "10px 18px", borderRadius: 6, border: "1px solid var(--card-border)", cursor: "pointer", backgroundColor: selectedCoupe === coupe ? "var(--orange-color)" : "var(--background-soft)", color: "#fff", fontWeight: 600, transition: "all 0.25s ease", boxShadow: selectedCoupe === coupe ? "0 0 10px rgba(226,96,16,0.4)" : "none" }}>
                        {coupe}
                    </button>
                ))}
            </div>

            <hr style={{ marginBottom: 35, border: "solid 1px var(--card-bg-hover)" }} />

            <div style={{ display: "flex", gap: 10, marginBottom: 40, flexWrap: "wrap", justifyContent: "center" }}>
                {listPhase.map(phase => (
                    <div key={phase} onClick={() => setSelectedPhase(phase)} style={{ padding: "8px 16px", borderRadius: 6, cursor: "pointer", border: selectedPhase === phase ? "2px solid var(--orange-color)" : "2px solid var(--background-soft)", backgroundColor: selectedPhase === phase ? "rgba(226,96,16,0.15)" : "var(--background-soft)", fontWeight: selectedPhase === phase ? 600 : 500, transition: "all 0.25s ease", boxShadow: selectedPhase === phase ? "0 0 12px rgba(226,96,16,0.3)" : "none" }}>
                        {phase}
                    </div>
                ))}
            </div>

            <section style={{ padding: 25, borderRadius: 8, marginBottom: 40, background: "linear-gradient(145deg, #1f1f1f, #242424)", border: "1px solid var(--card-border)", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                <h2 style={{ marginBottom: 20, color: "var(--orange-color)", fontSize: "1.4rem", fontWeight: 700 }}>Classement Général</h2>

                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#111", textAlign: "center", borderBottom: "2px solid var(--orange-color)" }}>
                            <th>#</th>
                            <th style={{ textAlign: "left", paddingLeft: 10 }}>Club</th>
                            <th style={{ color: "var(--orange-color)" }}>Pts</th>
                            <th>J</th><th>G</th><th>N</th><th>P</th><th>PTS+</th><th>PTS-</th><th>Diff</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.rankings.map(team => (
                            <tr key={team.position} style={{ textAlign: "center", borderBottom: "1px solid var(--card-border)", transition: "background 0.2s ease" }}>
                                <td>{team.position}</td>
                                <td style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 10, textAlign: "left" }}>
                                    <img src={"/assets/images/teams/" + team.club.label.replace(/\s+/g, '') + ".png"} alt={team.club.label} width={28} height={28} style={{ borderRadius: "50%" }} />
                                    <span>{team.club.label}</span>
                                </td>
                                <td style={{ fontWeight: 700, color: "var(--orange-color)" }}>{team.points}</td>
                                <td>{team.j}</td><td>{team.g}</td><td>{team.n}</td><td>{team.p}</td><td>{team.points_won}</td><td>{team.points_loss}</td><td style={{ color: team.points_diff < 0 ? "#ff4444" : "inherit" }}>{team.points_diff}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section style={{ marginBottom: 40 }}>
                {data.days.map(day => {
                    const matchesOfDay = data.matches.filter(m => m.id === day.id && (m.team_a.name.toLowerCase().includes("anges") || m.team_b.name.toLowerCase().includes("anges")))
                    const isOpen = openDayId === day.id
                    return matchesOfDay.length > 0 && (
                        <div key={day.id} style={{ marginBottom: 18 }}>
                            <div onClick={() => handleDayToggle(day.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", cursor: "pointer", borderRadius: 6, fontWeight: 600, backgroundColor: isOpen ? "rgba(226,96,16,0.15)" : "var(--background-soft)", border: isOpen ? "2px solid var(--orange-color)" : "2px solid var(--card-border)", transition: "all 0.25s ease" }}>
                                <span>{day.label} ({new Date(day.date).toLocaleDateString()})</span>
                                <span style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "0.3s" }}>▶</span>
                            </div>

                            {isOpen && (
                                <div style={{ padding: "15px 20px", marginTop: 6, backgroundColor: "var(--card-bg-hover)", borderRadius: 6 }}>
                                    {matchesOfDay.map((match, idx) => {
                                        const winner = match.team_a.score > match.team_b.score ? "a" : match.team_b.score > match.team_a.score ? "b" : "draw"
                                        return (
                                            <div key={idx} style={{ display: "grid", gridTemplateColumns: "1fr 90px 1fr", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--card-border)" }}>
                                                <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 10, fontWeight: winner === "a" ? 700 : 500 }}>
                                                    <span>{match.team_a.name}</span>
                                                    <img src={"/assets/images/teams/" + match.team_a.name.replace(/\s+/g, '') + ".png"} alt={match.team_a.name} width={26} height={26} />
                                                </div>

                                                <div style={{ textAlign: "center", fontWeight: 700 }}>
                                                    <span style={{ color: winner === "a" ? "var(--orange-color)" : "#fff" }}>{match.team_a.score}</span> -
                                                    <span style={{ color: winner === "b" ? "var(--orange-color)" : "#fff" }}>{match.team_b.score}</span>
                                                </div>

                                                <div style={{ display: "flex", alignItems: "center", gap: 10, fontWeight: winner === "b" ? 700 : 500 }}>
                                                    <img src={"/assets/images/teams/" + match.team_b.name.replace(/\s+/g, '') + ".png"} alt={match.team_b.name} width={26} height={26} />
                                                    <span>{match.team_b.name}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </section>
        </div>
    )
}
