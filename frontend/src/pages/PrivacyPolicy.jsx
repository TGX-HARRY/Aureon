import React from "react";
import "./LegalPages.css";

function PrivacyPolicy() {
  return (
    <div className="legal-container">
      <header className="legal-header">
        <h1>Privacy Policy</h1>
        <p>Your privacy is important to us at Aureon.</p>
      </header>

      <section className="legal-section">
        <h2>1. Information We Collect</h2>
        <p>
          We collect personal information such as your name, email address, and preferences 
          when you create an account or interact with our platform. We also gather analytics 
          data to improve performance and user experience.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. How We Use Your Information</h2>
        <p>
          We use collected data to personalize recommendations, enhance streaming quality, 
          provide customer support, and ensure platform security.
        </p>
      </section>

      <section className="legal-section">
        <h2>3. Data Sharing</h2>
        <p>
          We do not sell or rent your personal information. Limited data may be shared with 
          trusted service providers who assist in operating our services under strict confidentiality agreements.
        </p>
      </section>

      <section className="legal-section">
        <h2>4. Your Rights</h2>
        <p>
          You may access, modify, or delete your account data at any time through your account 
          settings. If you wish to permanently remove your account, contact our support team.
        </p>
      </section>

      <section className="legal-section">
        <h2>5. Policy Updates</h2>
        <p>
          We may update this Privacy Policy periodically. Continued use of Aureon after updates 
          implies your acceptance of the revised policy.
        </p>
      </section>

      <footer className="legal-footer">
        <p>Last updated: November 2025</p>
      </footer>
    </div>
  );
}

export default PrivacyPolicy;
