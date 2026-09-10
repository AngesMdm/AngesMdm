"use client";

import RevealCascade from "@/components/RevealOnSCroll";
import Slider from "@/components/Slider";
import "@/styles/foot.css";
import Link from "next/link";

export default function FootPage() {
    return (
        <div className="foot-wrapper">
            <section className="foot-hero">
                <div className="foot-hero-content">
                    <h1>Football Américain</h1>
                    <p style={{ color: "var(--main-color)" }}>
                        Sport de contact spectaculaire, le football américain repose sur la puissance,
                        la stratégie et la cohésion. Chaque joueur a un rôle unique et essentiel dans
                        un système millimétré.
                    </p>
                </div>
            </section>

            <section className="foot-join-cta">
                <RevealCascade index={0}>
                    <div className="cta-container">
                        <div className="cta-content">
                            <h2>Prêt à relever le défi ?</h2>
                            {/* <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p> */}
                        </div>
                        <Link href="https://www.helloasso.com/associations/les-anges-40/adhesions/adhesion-2026-2027" className="cta-button-glow">
                            {/* <Link href="/nous-rejoindre" className="cta-button-glow"> */}
                            <span>Nous rejoindre</span>
                            <div className="cta-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </div>
                        </Link>
                    </div>
                </RevealCascade>
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
        image: "/assets/images/foot/qb.png",
        description: "Le chef d’orchestre de l’attaque, il lance ou court avec la balle."
    },
    {
        nom: "Running Back (RB)",
        image: "/assets/images/foot/rb.png",
        description: "Rapide et agile, il court avec la balle pour gagner des yards."
    },
    {
        nom: "Wide Receiver (WR)",
        image: "/assets/images/foot/wr.png",
        description: "Il attrape les passes du QB et progresse sur le terrain."
    },
    {
        nom: "Offensive Line (OL)",
        image: "/assets/images/foot/ol.png",
        description: "Protège le QB et ouvre des brèches pour les coureurs."
    },
];

const defense = [
    {
        nom: "Defensive Line (DL)",
        image: "/assets/images/foot/dl.png",
        description: "Gros gabarit chargé de stopper la course ou d’atteindre le QB."
    },
    {
        nom: "Linebacker (LB)",
        image: "/assets/images/foot/lb.png",
        description: "Polyvalent, il défend la course et couvre les passes."
    },
    {
        nom: "Cornerback (CB)",
        image: "/assets/images/foot/cb.png",
        description: "Spécialiste de la couverture des receveurs adverses."
    },
    {
        nom: "Safety (S)",
        image: "/assets/images/foot/safety.png",
        description: "Dernière ligne de défense, rapide et lucide."
    },
];

const teams = [
    {
        nom: "Kicker (K)",
        image: "/assets/images/foot/kicker.png",
        description: "Spécialiste du tir au pied : engagements, transformations et field goals."
    },
    {
        nom: "Punter (P)",
        image: "/assets/images/foot/punter.png",
        description: "Dégage loin la balle lors de la 4ème tentative."
    },
    {
        nom: "Returner (KR)",
        image: "/assets/images/foot/returner.png",
        description: "Remonte les ballons bottés par l’adversaire."
    },
];

const sliderImages = [
    "/assets/images/foot/galerie/foot1.JPG",
    "/assets/images/foot/galerie/foot2.JPG",
    "/assets/images/foot/galerie/foot3.JPG",
    "/assets/images/foot/galerie/foot4.JPG",
    "/assets/images/foot/galerie/foot4.JPG",
];