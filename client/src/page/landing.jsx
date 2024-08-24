import React from 'react';
import './landing.scss';

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-container">
      <div className="navbar-logo">
        <img src="../../public/favicon.png" alt="Dental Advisor Logo" className="logo-image" />
        <span className="logo-text">Dental Advisor</span>
      </div>
      <div className="navbar-links">
        <a href="#revenue-boost">Revenue Boost</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="navbar-auth">
        <a className='btn btn-secondary' href='/login/auth'>Login</a>
        <a className="btn btn-primary" href='/signup'>Register</a>
      </div>
    </div>
  </nav>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const LandingPage = () => {
  return (
    <div className="dental-advisor-landing">
      <Navbar />

      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Transform Your Dental Practice with AI</h1>
            <p>Enhance patient care, boost revenue, and streamline your workflow with our cutting-edge AI technology.</p>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </section>

        <section id="revenue-boost" className="revenue-boost">
          <div className="revenue-boost-content">
            <h2>Boost Your Practice Revenue</h2>
            <div className="revenue-boost-details">
              <ul>
                <li>Automate personalized follow-up emails after each patient visit</li>
                <li>Provide tailored product recommendations based on patient needs</li>
                <li>Generate additional revenue through product sales</li>
              </ul>
              <a href='/login' className="btn btn-primary">Start Boosting Revenue</a>
            </div>
          </div>
        </section>

        <section id="features" className="features">
          <div className="features-content">
            <h2>Why Choose DentalAdvisor?</h2>
            <div className="features-grid">
              <FeatureCard
                icon="🎙️"
                title="Transcription Features"
                description="Utilize session recordings to generate clinical notes, patient letters, and other useful documentation automatically."
              />
              <FeatureCard
                icon="💡"
                title="AI-Powered Insights"
                description="Get real-time recommendations to improve patient care and practice efficiency."
              />
              <FeatureCard
                icon="🦷"
                title="Smart Dental GPT"
                description="Access instant, AI-powered dental knowledge to enhance your clinical decision-making."
              />
              <FeatureCard
                icon="📊"
                title="Automated Reporting"
                description="Generate comprehensive reports and actionable summaries with ease."
              />
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <div className="about-content">
            <h2>About DentalAdvisor</h2>
            <p>DentalAdvisor is a cutting-edge AI-powered platform designed to revolutionize dental practices. Our mission is to empower dental professionals with advanced technology, enabling them to provide superior patient care while optimizing their practice management.</p>
            <p>Founded by a team of dental experts and AI specialists, DentalAdvisor combines deep industry knowledge with state-of-the-art artificial intelligence to deliver unparalleled insights and solutions tailored to the unique needs of dental practices.</p>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="contact-content">
            <h2>Contact Us</h2>
            <p>Have questions or want to learn more about DentalAdvisor? Get in touch with our team!</p>
            <form className="contact-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" required></textarea>
              <button type="submit" className="btn btn-primary">Send Message</button>
            </form>
          </div>
        </section>

        <section className="cta">
          <div className="cta-content">
            <h2>Ready to Revolutionize Your Practice?</h2>
            <p>Join thousands of dental professionals already benefiting from DentalAdvisor.</p>
            <a href='/login' className="btn btn-primary">Get Started</a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;