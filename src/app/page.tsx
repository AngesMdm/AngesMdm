"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import "@/styles/home.css";
import "@/styles/slider.css";
import "@/styles/popup.css";
import "@/styles/slider-query.css";
import { ArrowBallLeft, ArrowBallRight } from "@/components/svg/arrowBall.svg";
import { Actus } from "@/types/actus.type";

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
      setVisibleSlides(width < 800 ? 1 : 2);
    };

    updateVisibleSlides();
    window.addEventListener("resize", updateVisibleSlides);

    return () => window.removeEventListener("resize", updateVisibleSlides);
  }, []);

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

  const slide = (direction: number) => {
    setCurrentSlide((prev) => {
      let next = prev + direction;
      if (next < 0) next = slides.length - 1;
      else if (next + (visibleSlides - 1) >= slides.length) next = 0;
      return next;
    });
  };

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
          <a href="" className="card-link card gauche">
            <div className="card"><h3 style={{ margin: "0" }}>Foot</h3></div>
          </a>
          <a href="" className="card-link card face">
            <div className="card"><h3 style={{ margin: "0" }}>Cheer</h3></div>
          </a>
          <a href="" className="card-link card droite">
            <div className="card"><h3 style={{ margin: "0" }}>Flag</h3></div>
          </a>

          {/* Mobile */}
          <div className="mobile-slider-wrapper">
            <div className="mobile-slider" ref={sliderRef}>
              {[0, 1, 2].map((i) => {
                const titles = ["Foot", "Cheer", "Flag"];
                const classes = ["gauche", "face", "droite"];
                return (
                  <a key={i} href="" className={`card-link card ${classes[i]}`} style={{ textDecoration: "none", color: "white" }}>
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
          <div className="team-card" data-scroll="left">
            <div className="team-image" style={{ backgroundImage: "url('/assets/images/staff.png')" }} />
            <div className="team-content">
              <h3>Le Staff</h3>
              <p>Coachs et encadrants dévoués à la progression des joueurs.</p>
            </div>
          </div>
          <div className="team-card" data-scroll="right">
            <div className="team-image" style={{ backgroundImage: "url('/assets/images/bureau.png')" }} />
            <div className="team-content">
              <h3>Le Bureau</h3>
              <p>L'administration et la gestion du club au quotidien.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="slider">
        <h2 className="section-title">L'Actualité</h2>
        <div className="slider-arrow left" onClick={() => slide(-1)}>
          <ArrowBallLeft width={90} height={90} className="slider-arrow-svg arrow-left" />
        </div>
        <div className="slider-wrapper">
          <div className="slider-track" style={{ width: `${(slides.length / visibleSlides) * 100}%`, transform: `translateX(-${(currentSlide * 105) / slides.length}%)`, gap: "0.5rem" }}>
            {slides.map((slide, index) => (
              <div className="slider-card" key={index} onClick={() => setSelectedSlide(slide)} style={{ flex: `0 0 calc(${100 / slides.length}% - 0.5rem)`, boxSizing: "border-box", cursor: "pointer" }}>
                <Image src={slide.images[0].src} alt={`Slide ${index + 1}`} width={300} height={300} />
                <div className="slider-card-text">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="slider-arrow right" onClick={() => slide(1)}>
          <ArrowBallRight width={90} height={90} className="slider-arrow-svg arrow-right" />
        </div>
      </section>

      {selectedSlide && (
        <div className={`popup-overlay ${isClosing ? "fade-out" : ""}`} onClick={handleClosePopup} >
          <div className="popup-content" onClick={(e) => e.stopPropagation()} >
            <button className="popup-close" onClick={handleClosePopup}>✕</button>
            <h2>{selectedSlide.title}</h2>
            <Image src={selectedSlide.images[0].src} alt={selectedSlide.title} width={500} height={300} style={{ borderRadius: "12px", objectFit: "cover" }} />
            <p style={{ marginTop: "1rem" }}>{selectedSlide.description}</p>
            {selectedSlide.link && (
              <a href={selectedSlide.link[0]} target="_blank" rel="noopener noreferrer" className="popup-link">En savoir plus</a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
