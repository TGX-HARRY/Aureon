import React from "react";
import "./LegalPages.css";

function Terms() {
  return (
    <div className="legal-container">
      <header className="legal-header">
        <h1>Terms & Conditions</h1>
        <p>Welcome to Aureon. Please read our terms carefully before using our platform.</p>
      </header>

      <section className="legal-section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing Aureon, you agree to comply with and be bound by these terms. 
          If you do not agree, please refrain from using our services.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. User Responsibilities</h2>
        <p>
          Users are expected to maintain account confidentiality and comply with all 
          applicable laws while using Aureon. Any misuse of content or services may 
          result in suspension or termination.
        </p>
      </section>

      <section className="legal-section">
        <h2>3. Intellectual Property</h2>
        <p>
          All content, design, and branding elements are the property of Aureon. 
          Unauthorized use, reproduction, or distribution is strictly prohibited.
        </p>
      </section>

      <section className="legal-section">
        <h2>4. Limitation of Liability</h2>
        <p>
          Aureon shall not be held responsible for any damages arising from the use 
          or inability to use the platform, including but not limited to data loss or 
          service interruptions.
        </p>
      </section>

      <section className="legal-section">
        <h2>5. Modifications</h2>
        <p>
          Aureon reserves the right to modify these terms at any time. Updated terms 
          will be posted on this page, and your continued use constitutes acceptance.
        </p>
      </section>

      <footer className="legal-footer">
        <p>Last updated: November 2025</p>
      </footer>
    </div>
  );
}

export default Terms;
