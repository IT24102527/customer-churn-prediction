import { useState, useEffect } from 'react';
import { Brain, Activity, CheckCircle2, XCircle, Menu, X } from 'lucide-react';
import { checkHealth } from '../services/api';
import './Navbar.css';

export default function Navbar({ onNavigate }) {
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking' | 'online' | 'offline'
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function ping() {
      try {
        await checkHealth();
        if (!cancelled) setApiStatus('online');
      } catch {
        if (!cancelled) setApiStatus('offline');
      }
    }

    ping();
    const interval = setInterval(ping, 30000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const navLinks = [
    { label: 'Dashboard', href: '#hero' },
    { label: 'Predict Churn', href: '#predict' },
    { label: 'Model Info', href: '#model-info' },
  ];

  const handleNav = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="navbar" role="banner">
      <div className="container navbar-inner">
        {/* Brand */}
        <a href="#hero" className="navbar-brand" onClick={(e) => { e.preventDefault(); handleNav('#hero'); }}>
          <span className="navbar-brand-icon">
            <Brain size={20} />
          </span>
          <div className="navbar-brand-text">
            <span className="navbar-brand-name">Customer Churn AI</span>
            <span className="navbar-brand-tagline">ML-Powered Customer Retention Analysis</span>
          </div>
        </a>

        {/* Desktop nav */}
        <nav className="navbar-links" aria-label="Main navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="navbar-link"
              onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* API status + mobile toggle */}
        <div className="navbar-right">
          <div className={`api-status ${apiStatus}`} aria-label={`API status: ${apiStatus}`}>
            {apiStatus === 'checking' && <Activity size={14} className="spin-icon" />}
            {apiStatus === 'online'   && <CheckCircle2 size={14} />}
            {apiStatus === 'offline'  && <XCircle size={14} />}
            <span>
              {apiStatus === 'checking' && 'Connecting…'}
              {apiStatus === 'online'   && 'API Connected'}
              {apiStatus === 'offline'  && 'API Offline'}
            </span>
          </div>

          <button
            className="navbar-mobile-toggle"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="navbar-mobile" aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="navbar-mobile-link"
              onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
