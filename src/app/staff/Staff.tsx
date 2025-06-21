"use client";
import RevealCascade from "@/components/RevealOnSCroll";
import "@/styles/bureau.css";

const staffData = [
    { name: "Tony", role: "Coach Flag", image: "/assets/images/staff&bureau/tony.png" },
    { name: "Nico", role: "Coach Flag", image: "/assets/images/staff&bureau/nico.png" },
    { name: "Kal", role: "Head Coach Foot", image: "/assets/images/staff&bureau/kal.png" },
    { name: "Tony", role: "Cordo off et def Foot", image: "/assets/images/staff&bureau/tony.png" },
    { name: "Margaux", role: "Coach cheer", image: "/assets/images/staff&bureau/margaux.png" },
    { name: "Chris", role: "Arbitre", image: "/assets/images/staff&bureau/chris.png", fixTop: true },
    { name: "Carla", role: "Arbitre", image: "/assets/images/staff&bureau/carla.png", fixTop: true },
    { name: "Mag", role: "Arbitre", image: "/assets/images/staff&bureau/mag.png" },
    { name: "Mateo", role: "Arbitre", image: "/assets/images/staff&bureau/mateo.png" },
    { name: "Tony", role: "Arbitre", image: "/assets/images/staff&bureau/tony.png" },
    { name: "Mams", role: "Arbitre", image: "/assets/images/staff&bureau/mams.png" },
    { name: "Thomas", role: "Arbitre", image: "/assets/images/staff&bureau/thomas.png" },
    { name: "Edouard", role: "Arbitre", image: "/assets/images/staff&bureau/edouard.png" },
];

export default function StaffPage() {
    return (
        <div style={{ marginTop: "9rem" }}>
            <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Membres du Staff</h1>
            <div className="bureau-wrapper" >
                <div className="bureau-grid">
                    {staffData.map((member, index) => (
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
