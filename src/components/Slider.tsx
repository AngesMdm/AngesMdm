"use client";
import { useState } from "react";
import "@/styles/flag.css";

type SliderProps = {
    images: string[];
};

export default function Slider({ images }: SliderProps) {
    const [current, setCurrent] = useState(0);

    const next = () => setCurrent((prev) => (prev + 1) % images.length);
    const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="flag-slider">
            <button onClick={prev} className="slider-btn">‹</button>
            <div className="slider-image" style={{ backgroundImage: `url(${images[current]})` }} />
            <button onClick={next} className="slider-btn">›</button>
        </div>
    );
}
