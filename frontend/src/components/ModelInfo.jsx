import { BarChart3, Target, Layers, Scale } from 'lucide-react';
import './ModelInfo.css';

/* ── Metric card ── */
function MetricCard({ label, value, description }) {
  return (
    <div className="metric-card card-sm">
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      {description && <div className="metric-desc">{description}</div>}
    </div>
  );
}

/* ── Info row ── */
function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-row-label">{label}</span>
      <span className="info-row-value">{value}</span>
    </div>
  );
}

export default function ModelInfo() {
  return (
    <section id="model-info" className="model-info-section" aria-labelledby="model-info-heading">
      <div className="container">
        <div className="section-header">
          <h2 id="model-info-heading" className="section-title">About the Model</h2>
          <p className="section-subtitle">
            Technical details and evaluation metrics for the trained ML pipeline.
          </p>
        </div>

        <div className="model-info-grid">
          {/* ── Model details ── */}
          <div className="card model-details-card">
            <div className="model-details-header">
              <span className="model-details-icon"><Target size={18} /></span>
              <h3 className="model-details-title">Model Details</h3>
            </div>

            <div className="info-rows">
              <InfoRow label="Model"        value="Balanced Logistic Regression" />
              <InfoRow label="Problem Type" value="Binary Classification" />
              <InfoRow label="Target"       value="Customer Churn" />
              <InfoRow label="Classes"      value="0 — No Churn, 1 — Churn" />
            </div>

            <div className="divider" />

            <div className="model-description">
              <div className="model-desc-item">
                <Layers size={14} className="model-desc-icon" />
                <p>
                  The model uses a preprocessing pipeline that applies <strong>numerical scaling</strong> and{' '}
                  <strong>categorical one-hot encoding</strong> before classification.
                </p>
              </div>
              <div className="model-desc-item">
                <Scale size={14} className="model-desc-icon" />
                <p>
                  <strong>Class weighting</strong> was applied during training to improve identification of
                  churn customers, addressing the natural class imbalance in the dataset.
                </p>
              </div>
            </div>
          </div>

          {/* ── Performance metrics ── */}
          <div className="card model-perf-card">
            <div className="model-details-header">
              <span className="model-details-icon"><BarChart3 size={18} /></span>
              <h3 className="model-details-title">Model Performance</h3>
            </div>
            <p className="model-perf-note">
              Test-set evaluation metrics — Balanced Logistic Regression
            </p>

            <div className="metrics-grid">
              <MetricCard label="Accuracy"  value="73.8%" description="Overall correct predictions" />
              <MetricCard label="Precision" value="50.4%" description="Of predicted churn customers, how many were actually churn." />
              <MetricCard label="Recall"    value="78.3%" description="Of actual churn customers, how many the model identified." />
              <MetricCard label="F1 Score"  value="61.4%" description="Harmonic mean of precision & recall" />
              <MetricCard label="ROC-AUC"   value="0.842" description="Area under the ROC curve" />
            </div>

            <div className="model-perf-note-bottom">
              <span>⚠</span>
              All metrics are evaluated on held-out test data and reported from the project notebook.
              No metrics have been invented or estimated.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
