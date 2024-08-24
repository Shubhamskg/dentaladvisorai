import React, { useState } from 'react';
import './DownloadPage.scss';

const DOWNLOAD_LINKS = {
  windows: "https://mega.nz/file/w6hAybJY#ZkIM0L2ogf-K3Fyf7QaDSUKZJc52-ElRuEPRX9-3Xe0",
  mac: "https://mega.nz/file/w6hAybJY#ZkIM0L2ogf-K3Fyf7QaDSUKZJc52-ElRuEPRX9-3Xe0"
};

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar__container">
      <a href="/" className="navbar__logo">Dental Advisor</a>
      <ul className="navbar__menu">
        <li><a href="/features">Features</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/support">Support</a></li>
        {/* <li><a href="/login" className="btn btn--secondary">Login</a></li> */}
      </ul>
    </div>
  </nav>
);

const DownloadButton = ({ system, version }) => (
  <a href={DOWNLOAD_LINKS[system.toLowerCase()]} className="btn btn--primary download-btn" download>
    Download for {system} (v{version})
  </a>
);

const DownloadPage = () => {
  const [selectedSystem, setSelectedSystem] = useState('windows');
  const version = "1.0.0";

  return (
    <div className="download-page">
      <Navbar />
      <div className="download-page__content">
        <header className="download-page__header">
          <h1>Download DentalAdvisor</h1>
          <p>Choose your operating system to get started</p>
        </header>

        <main className="download-page__main">
          <div className="system-selector">
            <button
              className={`system-btn ${selectedSystem === 'windows' ? 'active' : ''}`}
              onClick={() => setSelectedSystem('windows')}
            >
              <i className="icon icon-windows"></i>
              Windows
            </button>
            <button
              className={`system-btn ${selectedSystem === 'mac' ? 'active' : ''}`}
              onClick={() => setSelectedSystem('mac')}
            >
              <i className="icon icon-mac"></i>
              Mac
            </button>
          </div>

          <div className="download-options">
            <div className="download-option">
              <h2>Download Here (Recommended)</h2>
              <p>Get the full desktop experience with our downloadable app.</p>
              <DownloadButton system={selectedSystem} version={version} />
            </div>

            <div className="download-option">
              <h2>Use Online Version</h2>
              <p>Access DentalAdvisor directly from your web browser.</p>
              <a href="/app" className="btn btn--secondary">Launch Web App</a>
            </div>
          </div>
        </main>

        <footer className="download-page__footer">
          <p>
            By downloading, you agree to our <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DownloadPage;