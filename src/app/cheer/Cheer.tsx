// CheerPage.jsx
"use client";
import "@/styles/cheer.css";
import RevealCascade from "@/components/RevealOnSCroll";
import Slider from "@/components/Slider";
import Link from "next/link";

export default function CheerPage() {
    return (
        <div className="cheer-wrapper">
            <section className="cheer-hero">
                <div className="cheer-hero-content">
                    <h1>Le Cheerleading</h1>
                    <p>
                        Discipline complète mêlant danse, acrobatie, gymnastique et esprit d’équipe, le cheerleading soutient les équipes sportives tout en étant une pratique sportive à part entière.
                        Il développe coordination, force, confiance et synchronisation.
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
                        <Link href="/nous-rejoindre" className="cta-button-glow">
                            <span>Nous rejoindre</span>
                            <div className="cta-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </div>
                        </Link>
                    </div>
                </RevealCascade>
            </section>

            <section className="cheer-disciplines">
                <h2>Les Composantes du Cheer</h2>
                <div className="cheer-disciplines-grid">
                    {disciplines.map((el, i) => (
                        <RevealCascade key={i} index={i}>
                            <div className="cheer-discipline-card">
                                <div className="cheer-discipline-img" style={{ backgroundImage: `url(${el.image})` }} />
                                <div className="cheer-discipline-title">{el.nom}</div>
                                <div className="cheer-discipline-desc">{el.description}</div>
                            </div>
                        </RevealCascade>
                    ))}
                </div>
            </section>

            <section className="cheer-galerie">
                <h2>En images</h2>
                <Slider images={sliderImages} />
            </section>
        </div>
    );
}

const disciplines = [
    {
        nom: "Stunts",
        image: "/assets/images/cheer/stunt.png",
        description: "Figures acrobatiques en groupe où une base soulève une fly. Demande force et coordination."
    },
    {
        nom: "Tumbling",
        image: "/assets/images/cheer/tumbling.png",
        description: "Enchaînements gymniques comme flips, roues et saltos, montrant agilité et puissance."
    },
    {
        nom: "Jumps",
        image: "/assets/images/cheer/jumps.png",
        description: "Sauts dynamiques réalisés en synchronisation. Vitesse, explosivité et esthétique sont les clés."
    },
    {
        nom: "Dance",
        image: "/assets/images/cheer/dance.png",
        description: "Chorégraphies rythmées intégrant mouvements de cheer et transitions dynamiques."
    },
];

const sliderImages = [
    "/assets/images/cheer/galerie/cheer1.JPG",
    "/assets/images/cheer/galerie/cheer2.JPG",
    "/assets/images/cheer/galerie/cheer3.JPG",
    "/assets/images/cheer/galerie/cheer4.JPG",
];
