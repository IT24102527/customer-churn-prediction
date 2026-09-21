import { Brain } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="footer-brand-icon"><Brain size={18} /></span>
          <span className="footer-brand-name">Customer Churn Prediction System</span>
        </div>

        <p className="footer-stack">
          Machine Learning &bull; FastAPI &bull; React
        </p>

      </div>
    </footer>
  );
}
