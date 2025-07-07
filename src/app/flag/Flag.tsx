"use client";
import "@/styles/flag.css";
import RevealCascade from "@/components/RevealOnSCroll";
import Slider from "@/components/Slider";

export default function FlagPage() {
    return (
        <div className="flag-wrapper">
            <section className="flag-hero">
                <div className="flag-hero-content">
                    <h1>Le Flag Football</h1>
                    <p>
                        Le Flag est une variante sans contact du football américain. Accessible, ludique, rapide,
                        il se joue en équipe de 5 à 7 joueurs. Ici, pas de plaquages : pour arrêter un adversaire,
                        il suffit de lui arracher une bande de tissu attachée à la ceinture. C’est un sport mêlant
                        stratégie, agilité et coordination.
                    </p>
                </div>
            </section>

            <section className="flag-postes">
                <h2>Les Postes Offensifs</h2>
                <div className="flag-postes-grid">
                    {positions.filter(p => p.type === "attaque").map((poste, i) => (
                        <RevealCascade key={i} index={i}>
                            <div className="flag-poste-card attaque">
                                <div className="flag-poste-img" style={{ backgroundImage: `url(${poste.image})` }} />
                                <div className="flag-poste-title">{poste.nom}</div>
                                <div className="flag-poste-desc">{poste.description}</div>
                            </div>
                        </RevealCascade>
                    ))}
                </div>

                <h2 style={{ marginTop: "6rem" }}>Les Postes Défensifs</h2>
                <div className="flag-postes-grid">
                    {positions.filter(p => p.type === "defense").map((poste, i) => (
                        <RevealCascade key={i + 100} index={i}>
                            <div className="flag-poste-card defense">
                                <div className="flag-poste-img" style={{ backgroundImage: `url(${poste.image})` }} />
                                <div className="flag-poste-title">{poste.nom}</div>
                                <div className="flag-poste-desc">{poste.description}</div>
                            </div>
                        </RevealCascade>
                    ))}
                </div>
            </section>

            <section className="flag-galerie">
                <h2>En images</h2>
                <Slider images={images} />
            </section>
        </div>
    );
}

const positions = [
    {
        type: "attaque",
        nom: "Quarterback (QB)",
        image: "/assets/images/flag/qb.png",
        description: "Le cerveau de l’attaque. Il reçoit la balle au snap et décide de lancer, courir ou remettre la balle à un coéquipier."
    },
    {
        type: "attaque",
        nom: "Receiver (WR)",
        image: "/assets/images/flag/wr.png",
        description: "Joueur agile et rapide, il court des tracés précis pour se démarquer et recevoir les passes du QB."
    },
    {
        type: "attaque",
        nom: "Center",
        image: "/assets/images/flag/center.png",
        description: "Il engage le jeu en passant la balle au QB. Il peut aussi participer au blocage ou se libérer pour recevoir."
    },
    {
        type: "attaque",
        nom: "Running Back (RB)",
        image: "/assets/images/flag/run.png",
        description: "Spécialiste des courses, il prend la balle en main pour gagner du terrain au sol et percer la défense."
    },
    {
        type: "defense",
        nom: "Rusher",
        image: "/assets/images/flag/rusher.png",
        description: "Le sprinteur défensif qui part à pleine vitesse dès le snap pour gêner ou stopper le QB."
    },
    {
        type: "defense",
        nom: "Defensive Back (DB)",
        image: "/assets/images/flag/db.png",
        description: "Responsable de la couverture des receveurs adverses. Il anticipe, intercepte ou empêche la réception."
    },
    {
        type: "defense",
        nom: "Safety",
        image: "/assets/images/flag/safety.png",
        description: "Dernière ligne de défense. Il lit le jeu et intervient pour couvrir les passes longues ou soutenir contre la course."
    },
];

const images = [
    "/assets/images/flag/galerie/flag1.JPG",
    "/assets/images/flag/galerie/flag2.JPG",
    "/assets/images/flag/galerie/flag3.JPG",
    "/assets/images/flag/galerie/flag4.JPG",
];
