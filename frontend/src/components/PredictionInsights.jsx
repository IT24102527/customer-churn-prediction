import { Lightbulb } from 'lucide-react';
import './PredictionInsights.css';

/**
 * PredictionInsights — Placeholder for future SHAP/explainability integration.
 * The backend does not yet provide feature-level explanations.
 * No fake SHAP values or feature importance are shown here.
 */
export default function PredictionInsights() {
  return (
    <section id="prediction-insights" className="insights-section" aria-labelledby="insights-heading">
      <div className="container">
        <div className="card insights-card">
          <div className="insights-icon-wrap">
            <Lightbulb size={18} />
          </div>

          <div className="insights-text">
            <h2 id="insights-heading" className="insights-title">Prediction Insights</h2>
            <p className="insights-message">Feature-level explanations are not yet available.</p>
            <p className="insights-secondary">
              Explainable AI support can be integrated in a future version.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
