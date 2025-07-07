"use client";
import { useState } from "react";
import "@/styles/nous-rejoindre.css";

export default function NousRejoindrePage() {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const openLightbox = (src: string) => setLightboxImage(src);
    const closeLightbox = () => setLightboxImage(null);

    return (
        <div className="nous-rejoindre-wrapper" style={{ marginTop: "8rem" }}>
            <section className="nous-rejoindre-hero">
                <div className="nous-rejoindre-hero-content">
                    <h1 style={{ textAlign: "center" }}>
                        Rejoignez les Anges de Mont-de-Marsan
                    </h1>
                </div>
            </section>

            <section className="nous-rejoindre-info">
                <div
                    data-title="Football US"
                    style={{ backgroundImage: `url('/assets/images/nous_rejoindre/foot.png')` }}
                    onClick={() => openLightbox('/assets/images/nous_rejoindre/foot.png')}
                />
                <div
                    data-title="Cheerleading"
                    style={{ backgroundImage: `url('/assets/images/nous_rejoindre/cheer.png')` }}
                    onClick={() => openLightbox('/assets/images/nous_rejoindre/cheer.png')}
                />
                <div
                    data-title="Flag Football"
                    style={{ backgroundImage: `url('/assets/images/nous_rejoindre/flag.png')` }}
                    onClick={() => openLightbox('/assets/images/nous_rejoindre/flag.png')}
                />
            </section>

            {lightboxImage && (
                <div className="lightbox" onClick={closeLightbox}>
                    <img src={lightboxImage} alt="Aperçu" />
                </div>
            )}
        </div>
    );
}
