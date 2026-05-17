import React from 'react'
import "./Footer.css"
import { Link, useLocation } from 'react-router-dom'

function Footer() {
    const location = useLocation();

    const aboutPage = ["/about"];
    const contactPage = ["/contact"];
    const highlightTerms = aboutPage.includes(location.pathname);
    const highlightContact = contactPage.includes(location.pathname);

    return (
        <div>
            <footer className="footer">
                <div className="footer-content">
                    <p>© 2025 Aureon - Premium Entertainment Experience</p>
                    <div className="footer-links">
                        <Link to="/privacy">Privacy Policy</Link>
                        <Link to="/terms">Terms of Service</Link>
                        <Link to="/about">About Us</Link>
                        <Link to="/contact">Contact Support</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer
