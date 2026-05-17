import React from 'react'
import "./Contact.css"

function Contact() {
    const handleSubmit = (e) => {
        e.preventDefault()
        // handle form submission here
    }

    return (
        <div>
            <section className="contact-hero">
                <h1>Get In Touch</h1>
                <p>Have questions or feedback? We'd love to hear from you!</p>
            </section>

            <div className="contact-content">
                <div className="contact-info">
                    <h2>Contact Information</h2>

                    <div className="info-item">
                        <div className="info-icon">📍</div>
                        <div className="info-text">
                            <h3>Address</h3>
                            <p>123 Streaming Street<br/>Entertainment City, EC 12345</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">📧</div>
                        <div className="info-text">
                            <h3>Email</h3>
                            <p>support.aureon@gmail.com</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">📞</div>
                        <div className="info-text">
                            <h3>Phone</h3>
                            <p>+1 (555) 123-4567</p>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="info-icon">🕒</div>
                        <div className="info-text">
                            <h3>Support Hours</h3>
                            <p>24/7 Customer Support<br/>Always here to help!</p>
                        </div>
                    </div>
                </div>

                <div className="contact-form">
                    <h2>Send us a Message</h2>
                    <form id="contactForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" name="name" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input type="text" id="subject" name="subject" required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" placeholder="Tell us how we can help you..." required></textarea>
                        </div>

                        <button type="submit" className="submit-btn">Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact
