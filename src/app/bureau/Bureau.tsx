"use client";
import RevealCascade from "@/components/RevealOnSCroll";
import "@/styles/bureau.css";

const bureauData = [
    { name: "Tony", role: "Communication", image: "/assets/images/staff&bureau/tony.png" },
    { name: "Pepito", role: "Président", image: "/assets/images/staff&bureau/pepito.png" },
    { name: "Mag", role: "Secrétaire", image: "/assets/images/staff&bureau/mag.png" },
    { name: "Chris", role: "Gestion des arbitres", image: "/assets/images/staff&bureau/chris.png", fixTop: true },
    { name: "Rémis", role: "Foot", image: "/assets/images/staff&bureau/remis.png" },
    { name: "Ju", role: "Administratif", image: "/assets/images/staff&bureau/ju.png", fixTop: true },
    { name: "Vincent", role: "Trésorier", image: "/assets/images/staff&bureau/vincent.png" },
    { name: "Margaux", role: "Cheerleading", image: "/assets/images/staff&bureau/margaux.png" },
    { name: "Nico", role: "Flag", image: "/assets/images/staff&bureau/nico.png" },
];

export default function BureauPage() {
    return (
        <div style={{ marginTop: "9rem" }}>
            <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Membres du Bureau</h1>
            <div className="bureau-wrapper" >
                <div className="bureau-grid">
                    {bureauData.map((member, index) => (
                        <RevealCascade key={index} index={index}>
                            <div className="bureau-card">
                                <div
                                    className={`bureau-image ${member.fixTop ? "fix-top" : ""}`}
                                    style={{ backgroundImage: `url(${member.image})` }}
                                />
                                <div className="bureau-role">{member.role}</div>
                                <div className="bureau-name">{member.name}</div>
                            </div>
                        </RevealCascade>
                    ))}
                </div>
            </div>
        </div>

    );
}
