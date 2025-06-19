import { memo } from "react";
import Image from "next/image";
import { HOME_ROUTE } from "@/constants/app.route.const";

export const Footer = memo(() => {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h4>Contact</h4>
                    <p>Email : contact@anges-foot.com</p>
                    <p>Téléphone : 01 23 45 67 89</p>
                </div>

                <div className="footer-section">
                    <h4>Nous suivre</h4>
                    <div className="social-icons">

                        <a href="https://www.instagram.com/anges.mdm/"><Image src="/assets/icons/instagram.png" alt="Instagram" width={40} height={40} /></a>
                        <a href="https://www.facebook.com/anges.mdm/"><Image src="/assets/icons/facebook.png" alt="Facebook" width={40} height={40} /></a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4>Partenaires</h4>
                    <div className="partner-logos">
                        <Image src="/assets/images/partenaires/addict.png" alt="Addict" width={55} height={55} />
                        <Image src="/assets/images/partenaires/bagarre.png" alt="Bagarre" width={55} height={55} />
                        <Image src="/assets/images/partenaires/cookie.png" alt="Cookie" width={55} height={55} />
                        <Image src="/assets/images/partenaires/havana.png" alt="havana" width={55} height={55} />
                        <Image src="/assets/images/partenaires/ufips.jpg" alt="UFIPS" width={55} height={55} />
                    </div>
                </div>

                <div className="footer-section" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <a href={HOME_ROUTE}>
                        <Image src="/assets/images/logo.png" alt="Retour Home" width={60} height={60} className="footer-logo" />
                    </a>
                </div>
            </div>
        </footer>
    );
});
Footer.displayName = "Footer";
