"use client";
import { memo, useEffect, useState, useRef } from "react";
import Image from "next/image";
import { HOME_ROUTE, FLAG_ROUTE, FOOT_ROUTE, CHEER_ROUTE, LOGIN_ROUTE, DRIVE_ROUTE, STAFF_ROUTE, BUREAU_ROUTE, NOUS_REJOINDRE_ROUTE } from "@/constants/app.route.const";
import { useSession, signOut } from "next-auth/react";

export const Header = memo(() => {
    const { data: session } = useSession();
    const [hidden, setHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const prevScroll = useRef(0);
    const menuRef = useRef<HTMLLIElement>(null);

    // Scroll handler pour cacher header
    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            if (currentScroll > prevScroll.current && currentScroll > 100) {
                setHidden(true);
            } else {
                setHidden(false);
            }
            prevScroll.current = currentScroll;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Click outside pour fermer menu desktop user
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Responsive check
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 500);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Toggle menu mobile avec animation fermeture
    const toggleMobileMenu = () => {
        if (mobileMenuOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setMobileMenuOpen(false);
                setIsClosing(false);
            }, 300);
        } else {
            setMobileMenuOpen(true);
        }
    };

    // Fermer menu mobile au clic lien + animation fermeture
    const closeMobileMenu = () => {
        setIsClosing(true);
        setTimeout(() => {
            setMobileMenuOpen(false);
            setIsClosing(false);
        }, 300);
    };

    return (
        <header className={`header ${hidden ? "header-hidden" : ""}`}>
            <div className="header-container">
                <div className="header-left">
                    {isMobile ? (
                        <button className={`burger-button ${mobileMenuOpen && !isClosing ? "rotate-90" : ""}`} onClick={toggleMobileMenu} aria-label="Menu mobile">
                            <Image src="/assets/images/logo.png" alt="Menu" width={32} height={32} />
                        </button>
                    ) : (
                        <a href={HOME_ROUTE} className="logo-link" style={{ marginRight: "1rem" }}>
                            <Image src="/assets/images/logo.png" alt="Logo" width={50} height={50} />
                        </a>
                    )}
                    {!isMobile && (
                        <>
                            <a href={FOOT_ROUTE} className="nav-link">Foot</a>
                            <a href={CHEER_ROUTE} className="nav-link">Cheer</a>
                            <a href={FLAG_ROUTE} className="nav-link">Flag</a>
                            <a href={STAFF_ROUTE} className="nav-link">Staff</a>
                            <a href={BUREAU_ROUTE} className="nav-link">Bureau</a>
                        </>
                    )}
                </div>

                {!isMobile && (
                    <nav className="header-nav">
                        <a href={NOUS_REJOINDRE_ROUTE} className="nav-list" style={{ textDecoration: "none", color: "var(--main-color)" }}>Nous rejoindre</a>
                        <ul className="nav-list">
                            {session?.user ? (
                                <li className="nav-item user-menu" ref={menuRef}>
                                    <button className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
                                        <Image src={session.user.image || "/assets/images/logo.png"} alt="Avatar" width={36} height={36} className="avatar-image" />
                                    </button>
                                    {menuOpen && (
                                        <div className="user-dropdown">
                                            <a href={DRIVE_ROUTE} className="dropdown-item">Drive</a>
                                            <button onClick={() => { signOut(); closeMobileMenu(); }} className="dropdown-item">Se déconnecter</button>
                                        </div>
                                    )}
                                </li>
                            ) : (
                                <a href={LOGIN_ROUTE} className="nav-item" style={{ textDecoration: "none", color: "var(--main-color)" }}>Membre</a>
                            )}
                        </ul>
                    </nav>
                )}
            </div>

            {(mobileMenuOpen || isClosing) && (
                <div className="mobile-dropdown" style={{ animation: isClosing ? "zoomToLogo 0.3s ease-in forwards" : "dezoomFromLogo 0.3s ease-out forwards" }}>
                    <a href={HOME_ROUTE} className="dropdown-item" onClick={closeMobileMenu}>Accueil</a>
                    <a href={FLAG_ROUTE} className="dropdown-item" onClick={closeMobileMenu}>Flag</a>
                    <a href={FOOT_ROUTE} className="dropdown-item" onClick={closeMobileMenu}>Foot</a>
                    <a href={CHEER_ROUTE} className="dropdown-item" onClick={closeMobileMenu}>Cheer</a>
                    <a href={STAFF_ROUTE} className="dropdown-item" onClick={closeMobileMenu}>Staff</a>
                    <a href={BUREAU_ROUTE} className="dropdown-item" onClick={closeMobileMenu}>Bureau</a>
                    {session?.user ? (
                        <>
                            <a href={DRIVE_ROUTE} className="dropdown-item" onClick={closeMobileMenu}>Drive</a>
                            <button onClick={() => { signOut(); closeMobileMenu(); }} className="dropdown-item">Se déconnecter</button>
                        </>
                    ) : (
                        <a href={LOGIN_ROUTE} className="dropdown-item" onClick={closeMobileMenu}>Membre</a>
                    )}
                </div>
            )}
        </header>
    );
});
Header.displayName = "Header";
