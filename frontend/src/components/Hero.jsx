import { ArrowRight, Sparkles } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  const handleCTA = () => {
    const el = document.querySelector('#predict');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero" aria-labelledby="hero-heading">
      <div className="container hero-inner">
        <div className="hero-badge badge badge-primary">
          <Sparkles size={13} />
          Machine Learning &bull; Logistic Regression
        </div>

        <h1 id="hero-heading" className="hero-heading">
          Predict Customer Churn
          <span className="hero-heading-accent"> Before It Happens</span>
        </h1>

        <p className="hero-description">
          Use machine learning to identify customers who may be at risk of leaving
          and support proactive retention decisions.
        </p>

        <div className="hero-actions">
          <button id="hero-cta-btn" className="btn btn-primary hero-cta" onClick={handleCTA}>
            Start Prediction
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </section>
  );
}
