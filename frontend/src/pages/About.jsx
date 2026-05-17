import React from 'react'
import "./about.css"

function About() {
    return (
        <>
            <section className="about-aureon">
                <h1>About Aureon</h1>
                <p>
                    Discover the story behind our streaming platform and our mission to bring
                    entertainment to everyone.
                </p>
            </section>
            <div className="about-content">
                <div className="about-section">
                    <h2>Our Story</h2>
                    <p>
                        Welcome to our Aureon! This project was created as a learning experience
                        to demonstrate modern web development skills using HTML and CSS.
                    </p>
                    <p>
                        Our platform aims to recreate the sleek, user-friendly interface that
                        has made Aureon a global streaming giant. We've focused on responsive
                        design, smooth animations, and an intuitive user experience.
                    </p>
                    <p>
                        Built with passion for web development, this clone showcases the power
                        of pure HTML and CSS to create stunning, interactive websites without
                        the need for complex JavaScript frameworks.
                    </p>
                </div>
                <div className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        To provide an educational example of how modern streaming platforms can
                        be built using fundamental web technologies.
                    </p>
                    <p>
                        We believe in the power of clean code, beautiful design, and
                        user-centered development. This project serves as a testament to what
                        can be achieved with dedication and creativity.
                    </p>
                </div>
                <div className="about-section">
                    <h2>Platform Statistics</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">1000+</div>
                            <div className="stat-label">Movies &amp; Shows</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">50+</div>
                            <div className="stat-label">Countries</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Streaming</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">HD</div>
                            <div className="stat-label">Quality</div>
                        </div>
                    </div>
                </div>
                <div className="about-section">
                    <h2>Technology</h2>
                    <p>This Aureon is built using:</p>
                    <p>
                        • <strong>HTML5:</strong> For semantic structure and accessibility
                    </p>
                    <p>
                        • <strong>CSS3:</strong> For advanced styling, animations, and
                        responsive design
                    </p>
                    <p>
                        • <strong>Modern CSS Features:</strong> Grid, Flexbox, Custom
                        Properties, and Animations
                    </p>
                    <p>
                        • <strong>Responsive Design:</strong> Mobile-first approach for all
                        devices
                    </p>
                </div>
            </div>
        </>

    )
}

export default About
