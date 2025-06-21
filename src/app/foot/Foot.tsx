"use client";

import RevealCascade from "@/components/RevealOnSCroll";
import Slider from "@/components/Slider";
import "@/styles/foot.css";

export default function FootPage() {
    return (
        <div className="foot-wrapper">
            <section className="foot-hero">
                <div className="foot-hero-content">
                    <h1>Football Américain</h1>
                    <p>
                        Sport de contact spectaculaire, le football américain repose sur la puissance,
                        la stratégie et la cohésion. Chaque joueur a un rôle unique et essentiel dans
                        un système millimétré.
                    </p>
                </div>
            </section>

            <section className="foot-postes">
                <h2>Postes en Attaque</h2>
                <div className="foot-postes-grid">
                    {attaque.map((poste, i) => (
                        <RevealCascade key={i} index={i}>
                            <div className="foot-poste-card attaque">
                                <div className="foot-poste-img" style={{ backgroundImage: `url(${poste.image})` }} />
                                <div className="foot-poste-title">{poste.nom}</div>
                                <div className="foot-poste-desc">{poste.description}</div>
                            </div>
                        </RevealCascade>
                    ))}
                </div>

                <h2>Postes en Défense</h2>
                <div className="foot-postes-grid">
                    {defense.map((poste, i) => (
                        <RevealCascade key={i} index={i}>
                            <div className="foot-poste-card defense">
                                <div className="foot-poste-img" style={{ backgroundImage: `url(${poste.image})` }} />
                                <div className="foot-poste-title">{poste.nom}</div>
                                <div className="foot-poste-desc">{poste.description}</div>
                            </div>
                        </RevealCascade>
                    ))}
                </div>

                <h2>Special Teams</h2>
                <div className="foot-postes-grid">
                    {teams.map((poste, i) => (
                        <RevealCascade key={i} index={i}>
                            <div className="foot-poste-card teams">
                                <div className="foot-poste-img" style={{ backgroundImage: `url(${poste.image})` }} />
                                <div className="foot-poste-title">{poste.nom}</div>
                                <div className="foot-poste-desc">{poste.description}</div>
                            </div>
                        </RevealCascade>
                    ))}
                </div>
            </section>

            <section className="foot-galerie">
                <h2>En images</h2>
                <Slider images={sliderImages} />
            </section>
        </div>
    );
}

const attaque = [
    {
        nom: "Quarterback (QB)",
        image: "/assets/images/foot/qb.jpg",
        description: "Le chef d’orchestre de l’attaque, il lance ou court avec la balle."
    },
    {
        nom: "Running Back (RB)",
        image: "/assets/images/foot/rb.jpg",
        description: "Rapide et agile, il court avec la balle pour gagner des yards."
    },
    {
        nom: "Wide Receiver (WR)",
        image: "/assets/images/foot/wr.jpg",
        description: "Il attrape les passes du QB et progresse sur le terrain."
    },
    {
        nom: "Offensive Line (OL)",
        image: "/assets/images/foot/ol.jpg",
        description: "Protège le QB et ouvre des brèches pour les coureurs."
    },
];

const defense = [
    {
        nom: "Defensive Line (DL)",
        image: "/assets/images/foot/dl.jpg",
        description: "Gros gabarits chargés de stopper la course ou d’atteindre le QB."
    },
    {
        nom: "Linebacker (LB)",
        image: "/assets/images/foot/lb.jpg",
        description: "Polivalent, il défend la course et couvre les passes."
    },
    {
        nom: "Cornerback (CB)",
        image: "/assets/images/foot/cb.jpg",
        description: "Spécialiste de la couverture des receveurs adverses."
    },
    {
        nom: "Safety",
        image: "/assets/images/foot/safety.jpg",
        description: "Dernière ligne de défense, rapide et lucide."
    },
];

const teams = [
    {
        nom: "Kicker",
        image: "/assets/images/foot/kicker.jpg",
        description: "Spécialiste du tir au pied : engagements, transformations et field goals."
    },
    {
        nom: "Punter",
        image: "/assets/images/foot/punter.jpg",
        description: "Dégage loin la balle lors des 4e tentatives."
    },
    {
        nom: "Returner",
        image: "/assets/images/foot/returner.jpg",
        description: "Remonte les ballons bottés par l’adversaire."
    },
];

const sliderImages = [
    "/assets/images/foot/galerie/foot1.jpg",
    "/assets/images/foot/galerie/foot2.jpg",
    "/assets/images/foot/galerie/foot3.jpg",
    "/assets/images/foot/galerie/foot4.jpg",
    "/assets/images/foot/galerie/foot4.jpg",
];
