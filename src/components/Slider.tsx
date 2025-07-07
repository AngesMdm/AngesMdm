"use client";
import { useState } from "react";
import "@/styles/flag.css";

type SliderProps = {
    images: string[];
};

export default function Slider({ images }: SliderProps) {
    const [current, setCurrent] = useState(0);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const next = () => setCurrent((prev) => (prev + 1) % images.length);
    const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    return (
        <>
            <div className="flag-slider">
                <button onClick={prev} className="slider-btn">‹</button>
                <div
                    className="slider-image"
                    style={{ backgroundImage: `url(${images[current]})` }}
                    onClick={openPopup}
                />
                <button onClick={next} className="slider-btn">›</button>
            </div>

            {isPopupOpen && (
                <div className="popup-overlay" onClick={closePopup}>
                    <img src={images[current]} className="popup-image" alt="Popup" />
                    <button className="popup-close" onClick={closePopup}>×</button>
                </div>
            )}
        </>
    );
}
