"use client";
import RevealCascade from "@/components/RevealOnSCroll";
import "@/styles/bureau.css";

const staffData = [
    { name: "Tony", role: "Coach Flag", image: "/assets/images/staff&bureau/tony.png" },
    { name: "Pepito", role: "Coach Flag", image: "/assets/images/staff&bureau/pepito.png" },
    { name: "Remis", role: "Coach Foot", image: "/assets/images/staff&bureau/remis.png" },
    { name: "Nico", role: "Coach Foot", image: "/assets/images/staff&bureau/nico.png" },
    { name: "Margaux", role: "Coach cheer", image: "/assets/images/staff&bureau/margaux.png" },
    { name: "Mag", role: "Arbitre", image: "/assets/images/staff&bureau/mag.png" },
    { name: "Mams", role: "Arbitre", image: "/assets/images/staff&bureau/mams.png" },
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
                                    className={`bureau-image`}
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
