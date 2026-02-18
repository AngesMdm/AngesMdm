"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "@/styles/home.css";
import "@/styles/slider.css";
import "@/styles/popup.css";
import "@/styles/slider-query.css";
import { ArrowBallLeft, ArrowBallRight } from "@/components/svg/arrowBall.svg";
import { Actus } from "@/types/actus.type";
import { STAFF_ROUTE, BUREAU_ROUTE, FOOT_ROUTE, FLAG_ROUTE, CHEER_ROUTE } from "@/constants/app.route.const";
import Calendar from "@/components/Calendar";

export default function Home() {
    const [slides, setSlides] = useState<Actus[]>([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedSlide, setSelectedSlide] = useState<Actus | null>(null);
    const [isClosing, setIsClosing] = useState(false);
    const [visibleSlides, setVisibleSlides] = useState(2);
    const [currentCard, setCurrentCard] = useState(0);
    const sliderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateVisibleSlides = () => {
            const width = window.innerWidth;
            setVisibleSlides(width < 800 ? 1 : 3);
        };

        updateVisibleSlides();
        window.addEventListener("resize", updateVisibleSlides);

        return () => window.removeEventListener("resize", updateVisibleSlides);
    }, []);

    const slide = (direction: number) => {
        setCurrentSlide((prev) => {
            let next = prev + direction;
            if (next < 0) next = slides.length - 1;
            else if (next + (visibleSlides - 1) >= slides.length) next = 0;
            return next;
        });
    };

    useEffect(() => {
        let docTitle = document.title;
        const handleBlur = () => { document.title = "GO FOR TEAM, GO FOR WIN, GO FOR ANGES"; };
        const handleFocus = () => { document.title = docTitle; };
        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);
        return () => {
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.2 }
        );

        document.querySelectorAll(".team-card").forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`/api/actus`);
            const data = await response.json() as Actus[];
            setSlides(data);
        };
        fetchData();
    }, []);

    const handleClosePopup = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedSlide(null);
            setIsClosing(false);
        }, 200);
    };

    // Auto slide mobile (<1000px)
    useEffect(() => {
        if (window.innerWidth > 1000) return;

        const interval = setInterval(() => {
            setCurrentCard((prev) => {
                const next = (prev + 1) % 3;

                const slider = sliderRef.current;
                if (slider) {
                    const slideWidth = slider.clientWidth;
                    slider.scrollTo({ left: next * slideWidth, behavior: "smooth" });
                }

                return next;
            });
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    // Scroll manuel => update currentCard
    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider || window.innerWidth > 1000) return;

        const onScroll = () => {
            const index = Math.round(slider.scrollLeft / slider.clientWidth);
            if (index !== currentCard) setCurrentCard(index);
        };

        slider.addEventListener("scroll", onScroll);
        return () => slider.removeEventListener("scroll", onScroll);
    }, [currentCard]);

    // Reset currentCard si >1000px
    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth > 1000) {
                setCurrentCard(0);
            }
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    useEffect(() => {
        if (selectedSlide) {
            document.documentElement.style.overflow = "hidden";
            document.body.style.overflow = "hidden";
        } else {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        }

        return () => {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
        };
    }, [selectedSlide]);

    return (
        <div>
            <div className="hero-section">
                <div className="hero-bg" />
                <div className="hero-overlay">
                    <h1 className="hero-title">GO FOR TEAM, GO FOR WIN, GO FOR ANGES</h1>

                </div>
            </div>

            <section style={{ marginTop: "8rem" }}>
                <div className="card-container">
                    {/* Desktop */}
                    <a href={FOOT_ROUTE} className="card-link card gauche" style={{ backgroundSize: "90%", height: "650px" }}>
                        <div className="card"><h3 style={{ margin: "0" }}>Foot</h3></div>
                    </a>
                    <a href={CHEER_ROUTE} className="card-link card face" style={{ backgroundSize: "90%", height: "650px" }}>
                        <div className="card"><h3 style={{ margin: "0" }}>Cheer</h3></div>
                    </a>
                    <a href={FLAG_ROUTE} className="card-link card droite" style={{ backgroundSize: "85%", height: "650px" }}>
                        <div className="card"><h3 style={{ margin: "0" }}>Flag</h3></div>
                    </a>

                    {/* Mobile */}
                    <div className="mobile-slider-wrapper">
                        <div className="mobile-slider" ref={sliderRef}>
                            {[0, 1, 2].map((i) => {
                                const titles = ["Foot", "Cheer", "Flag"];
                                const classes = ["gauche", "face", "droite"];
                                return (
                                    <a
                                        key={i}
                                        href={i === 0 ? FOOT_ROUTE : i === 1 ? CHEER_ROUTE : FLAG_ROUTE}
                                        className={`card-link card ${classes[i]}`}
                                        style={{ textDecoration: "none", color: "white" }}
                                    >
                                        <h3 style={{ margin: 0 }}>{titles[i]}</h3>
                                    </a>
                                );
                            })}
                        </div>
                        <div className="pagination-dots">
                            {[0, 1, 2].map((i) => (
                                <span
                                    key={i}
                                    className={currentCard === i ? "active" : ""}
                                    onClick={() => {
                                        setCurrentCard(i);
                                        const slider = sliderRef.current;
                                        if (slider) {
                                            const slideWidth = slider.clientWidth;
                                            slider.scrollTo({ left: i * slideWidth, behavior: "smooth" });
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="team-section">
                <h2 className="section-title">L'Équipe</h2>
                <div className="team-scroll-container">
                    <a href={STAFF_ROUTE} className="team-card" data-scroll="left">
                        <div className="team-image" style={{ backgroundImage: "url('/assets/images/staff.png')" }} />
                        <div className="team-content">
                            <h3>Le Staff</h3>
                            <p>Coachs et encadrants dévoués à la progression des joueurs.</p>
                        </div>
                    </a>
                    <a href={BUREAU_ROUTE} className="team-card" data-scroll="right">
                        <div className="team-image" style={{ backgroundImage: "url('/assets/images/bureau.png')" }} />
                        <div className="team-content">
                            <h3>Le Bureau</h3>
                            <p>L'administration et la gestion du club au quotidien.</p>
                        </div>
                    </a>
                </div>
            </section>

            <Calendar />
            {/* <h2 className="section-title" style={{ textAlign: "center", marginTop: "6rem" }}>L'Actualité</h2>
            <section className="slider" style={{ marginBottom: "10rem" }}>
                <div className="slider-arrow left" onClick={() => slide(-1)}>
                    <ArrowBallLeft width={90} height={90} className="slider-arrow-svg arrow-left" />
                </div>
                <div className="slider-wrapper">
                    <div className="slider-track" style={{ transform: `translateX(-${(currentSlide * 105) / slides.length}%)`, width: `${(slides.length / visibleSlides) * 100}%`, gap: "0.5rem" }}>
                        {slides.map((slide, index) => {
                            const dateObj = new Date(slide.date ?? "");
                            const dateStr = dateObj.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

                            return (
                                <div
                                    className="slider-card"
                                    key={index}
                                    onClick={() => setSelectedSlide(slide)}
                                    style={{ flex: `0 0 calc(${100 / slides.length}% - 1rem)`, height: "320px" }}
                                >
                                    <Image src={slide.images[0].src} alt={`Slide ${index + 1}`} width={300} height={300} />
                                    <div className="slider-card-date">{dateStr}</div>
                                    <div className="slider-card-overlay">
                                        <h3>{slide.title}</h3>
                                        <p>{slide.resume}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
                <div className="slider-arrow right" onClick={() => slide(1)}>
                    <ArrowBallRight width={90} height={90} className="slider-arrow-svg arrow-right" />
                </div>
            </section>

            {selectedSlide && (
                <div className={`popup-overlay ${isClosing ? "fade-out" : ""}`} onClick={handleClosePopup} >
                    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                        <button className="popup-close" onClick={handleClosePopup}>✕</button>

                        <div className="popup-body">
                            <div className="popup-left popup-images">
                                {selectedSlide.images.map((img, idx) => (
                                    <Image
                                        key={idx}
                                        src={img.src}
                                        alt={`${selectedSlide.title} ${idx + 1}`}
                                        width={220}
                                        height={145}
                                        className="popup-side-image"
                                    />
                                ))}
                            </div>

                            <div className="popup-right popup-content-text">
                                <h2 className="popup-title">{selectedSlide.title}</h2>
                                <p className="popup-date">
                                    {new Date(selectedSlide.date ?? "").toLocaleDateString("fr-FR", {
                                        day: "2-digit",
                                        month: "long",
                                        year: "numeric"
                                    })}
                                </p>
                                <p className="popup-description">{selectedSlide.description}</p>
                                {selectedSlide.link && (
                                    <a
                                        href={selectedSlide.link[0]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="popup-link"
                                    >
                                        {selectedSlide.link[1] || "En savoir plus"}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            )} */}

        </div>
    );
}
