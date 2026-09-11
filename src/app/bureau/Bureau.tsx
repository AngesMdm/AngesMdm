"use client";
import "@/styles/bureau.css";
import RevealCascade from "@/components/RevealOnSCroll";

const presidents = [
    { name: "Christophe Baptiste", role: "CO-PRÉSIDENT", image: "/assets/images/staff&bureau/chris.png" },
    { name: "Yoann Calderon", role: "CO-PRÉSIDENT", image: "/assets/images/staff&bureau/pepito.png" },
    { name: "Tony Graziani", role: "CO-PRÉSIDENT / TRÉSORIER", image: "/assets/images/staff&bureau/tony2.png" },
];

const secretaire = { name: "Magalie Calderon", role: "SECRÉTAIRE", image: "/assets/images/staff&bureau/mag2.png" };

const membres = [
    { name: "Pierre Baudoin", role: "MEMBRE", image: "/assets/images/staff&bureau/pierre.png" },
    { name: "Julien Fabre", role: "MEMBRE", image: "/assets/images/staff&bureau/julien.png" },
    { name: "Rémi Nagiscarde", role: "MEMBRE", image: "/assets/images/staff&bureau/remis.png" },
    { name: "Benjamin Fillancq", role: "MEMBRE", image: "/assets/images/staff&bureau/benjamin.png" },
    { name: "Zoe Lamothe", role: "MEMBRE", image: "/assets/images/staff&bureau/zoe.png" },
];

const Card = ({ member, index }: any) => (
    <RevealCascade index={index}>
        <div className="bureau-card">
            <div className="bureau-image">
                <img src={member.image} alt={member.name} />
            </div>
            <div className="bureau-role">{member.role}</div>
            <div className="bureau-name" style={{ fontSize: '1.2rem' }}>{member.name}</div>
        </div>
    </RevealCascade>
);

export default function BureauPage() {
    return (
        <div className="org-container">
            <h1 style={{ marginBottom: "3rem" }}>COMITÉ DIRECTEUR</h1>

            <div className="org-presidents">
                {presidents.map((p, i) => <Card key={i} member={p} index={i} />)}
            </div>

            <div className="org-line"></div>

            <div className="org-secretary">
                <Card member={secretaire} index={3} />
            </div>

            <div className="org-line"></div>
            <div className="org-horizontal-line"></div>

            <div className="org-members-row">
                {membres.map((m, i) => (
                    <div key={i} className="org-member-wrapper">
                        <div className="org-member-line"></div>
                        <Card member={m} index={i + 4} />
                    </div>
                ))}
            </div>
        </div>
    );
}
