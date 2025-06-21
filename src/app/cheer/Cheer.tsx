// CheerPage.jsx
"use client";
import "@/styles/cheer.css";
import RevealCascade from "@/components/RevealOnSCroll";
import Slider from "@/components/Slider";

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

            <section className="cheer-disciplines">
                <h2>Les Composantes du Cheer</h2>
                <div className="cheer-disciplines-grid">
                    {disciplines.map((el, i) => (
                        <RevealCascade key={i} index={i}>
                            <div className="cheer-card">
                                <div className="cheer-img" style={{ backgroundImage: `url(${el.image})` }} />
                                <div className="cheer-title">{el.nom}</div>
                                <div className="cheer-desc">{el.description}</div>
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
        image: "/assets/images/cheer/stunt.jpg",
        description: "Figures acrobatiques en groupe où une base soulève un flyer. Demande force et coordination."
    },
    {
        nom: "Tumbling",
        image: "/assets/images/cheer/tumbling.jpg",
        description: "Enchaînements gymniques comme flips, roues et saltos, montrant agilité et puissance."
    },
    {
        nom: "Jumps",
        image: "/assets/images/cheer/jump.jpg",
        description: "Sauts dynamiques réalisés en synchronisation. Vitesse, explosivité et esthétique sont clés."
    },
    {
        nom: "Dance",
        image: "/assets/images/cheer/dance.jpg",
        description: "Chorégraphies rythmées intégrant mouvements de cheer et transitions dynamiques."
    },
];

const sliderImages = [
    "/assets/images/cheer/galerie/cheer1.JPG",
    "/assets/images/cheer/galerie/cheer2.JPG",
    "/assets/images/cheer/galerie/cheer3.JPG",
    "/assets/images/cheer/galerie/cheer4.JPG",
];
