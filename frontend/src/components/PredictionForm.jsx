import { useState } from 'react';
import { User, Wifi, CreditCard, AlertCircle, Loader2, ChevronRight } from 'lucide-react';
import { predictChurn } from '../services/api';
import './PredictionForm.css';

/* ── Default form state ── */
const defaultValues = {
  gender: 'Male',
  SeniorCitizen: '0',
  Partner: 'No',
  Dependents: 'No',
  tenure: '',
  PhoneService: 'Yes',
  MultipleLines: 'No',
  InternetService: 'DSL',
  OnlineSecurity: 'No',
  OnlineBackup: 'No',
  DeviceProtection: 'No',
  TechSupport: 'No',
  StreamingTV: 'No',
  StreamingMovies: 'No',
  Contract: 'Month-to-month',
  PaperlessBilling: 'Yes',
  PaymentMethod: 'Electronic check',
  MonthlyCharges: '',
  TotalCharges: '',
};

/* ── Validators ── */
function validate(values) {
  const errors = {};

  if (!values.tenure && values.tenure !== 0) {
    errors.tenure = 'Tenure is required.';
  } else if (Number(values.tenure) < 0) {
    errors.tenure = 'Tenure cannot be negative.';
  }

  if (values.MonthlyCharges === '') {
    errors.MonthlyCharges = 'Monthly charges is required.';
  } else if (Number(values.MonthlyCharges) < 0) {
    errors.MonthlyCharges = 'Monthly charges cannot be negative.';
  }

  if (values.TotalCharges === '') {
    errors.TotalCharges = 'Total charges is required.';
  } else if (Number(values.TotalCharges) < 0) {
    errors.TotalCharges = 'Total charges cannot be negative.';
  }

  return errors;
}

/* ── Build exact 19-field payload ── */
function buildPayload(values) {
  return {
    gender: values.gender,
    SeniorCitizen: Number(values.SeniorCitizen),   // 0 or 1
    Partner: values.Partner,
    Dependents: values.Dependents,
    tenure: parseInt(values.tenure, 10),            // integer
    PhoneService: values.PhoneService,
    MultipleLines: values.MultipleLines,
    InternetService: values.InternetService,
    OnlineSecurity: values.OnlineSecurity,
    OnlineBackup: values.OnlineBackup,
    DeviceProtection: values.DeviceProtection,
    TechSupport: values.TechSupport,
    StreamingTV: values.StreamingTV,
    StreamingMovies: values.StreamingMovies,
    Contract: values.Contract,
    PaperlessBilling: values.PaperlessBilling,
    PaymentMethod: values.PaymentMethod,
    MonthlyCharges: parseFloat(values.MonthlyCharges),  // float
    TotalCharges: parseFloat(values.TotalCharges),       // float
  };
}

/* ── Section wrapper ── */
function FormSection({ icon: Icon, title, children }) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <span className="form-section-icon"><Icon size={16} /></span>
        <span className="form-section-title">{title}</span>
      </div>
      <div className="form-section-grid">
        {children}
      </div>
    </div>
  );
}

/* ── Select field ── */
function SelectField({ id, label, name, value, onChange, options, error }) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">{label}</label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-control${error ? ' error' : ''}`}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && (
        <span className="form-error">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>
  );
}

/* ── Number field ── */
function NumberField({ id, label, name, value, onChange, error, placeholder, step = '1', min = '0' }) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">{label}</label>
      <input
        type="number"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-control${error ? ' error' : ''}`}
        placeholder={placeholder}
        step={step}
        min={min}
      />
      {error && (
        <span className="form-error">
          <AlertCircle size={12} /> {error}
        </span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════ */
export default function PredictionForm({ onResult }) {
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => { const copy = { ...prev }; delete copy[name]; return copy; });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Scroll to first error
      const firstError = document.querySelector('.form-control.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    onResult(null); // clear previous result

    try {
      const payload = buildPayload(values);
      const result = await predictChurn(payload);
      onResult(result);
      // Scroll to result
      setTimeout(() => {
        const el = document.querySelector('#prediction-result');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setApiError(err.message || 'An unexpected error occurred. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  /* Yes/No options */
  const yesNo = [{ value: 'Yes', label: 'Yes' }, { value: 'No', label: 'No' }];
  const yesNoNoService = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
    { value: 'No internet service', label: 'No internet service' },
  ];
  const yesNoNoPhone = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' },
    { value: 'No phone service', label: 'No phone service' },
  ];

  return (
    <section id="predict" className="predict-section" aria-labelledby="predict-heading">
      <div className="container">
        <div className="section-header">
          <h2 id="predict-heading" className="section-title">Customer Information</h2>
          <p className="section-subtitle">Enter the customer's service and account information.</p>
        </div>

        <form id="prediction-form" className="card predict-form" onSubmit={handleSubmit} noValidate>

          {/* ── CUSTOMER PROFILE ── */}
          <FormSection icon={User} title="Customer Profile">
            <SelectField
              id="field-gender"
              label="Gender"
              name="gender"
              value={values.gender}
              onChange={handleChange}
              options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]}
            />
            <SelectField
              id="field-senior-citizen"
              label="Senior Citizen"
              name="SeniorCitizen"
              value={values.SeniorCitizen}
              onChange={handleChange}
              options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }]}
            />
            <SelectField
              id="field-partner"
              label="Partner"
              name="Partner"
              value={values.Partner}
              onChange={handleChange}
              options={yesNo}
            />
            <SelectField
              id="field-dependents"
              label="Dependents"
              name="Dependents"
              value={values.Dependents}
              onChange={handleChange}
              options={yesNo}
            />
            <NumberField
              id="field-tenure"
              label="Tenure (months)"
              name="tenure"
              value={values.tenure}
              onChange={handleChange}
              error={errors.tenure}
              placeholder="e.g. 24"
              step="1"
              min="0"
            />
          </FormSection>

          <div className="divider" />

          {/* ── SERVICES ── */}
          <FormSection icon={Wifi} title="Services">
            <SelectField
              id="field-phone-service"
              label="Phone Service"
              name="PhoneService"
              value={values.PhoneService}
              onChange={handleChange}
              options={yesNo}
            />
            <SelectField
              id="field-multiple-lines"
              label="Multiple Lines"
              name="MultipleLines"
              value={values.MultipleLines}
              onChange={handleChange}
              options={yesNoNoPhone}
            />
            <SelectField
              id="field-internet-service"
              label="Internet Service"
              name="InternetService"
              value={values.InternetService}
              onChange={handleChange}
              options={[
                { value: 'DSL', label: 'DSL' },
                { value: 'Fiber optic', label: 'Fiber optic' },
                { value: 'No', label: 'No' },
              ]}
            />
            <SelectField
              id="field-online-security"
              label="Online Security"
              name="OnlineSecurity"
              value={values.OnlineSecurity}
              onChange={handleChange}
              options={yesNoNoService}
            />
            <SelectField
              id="field-online-backup"
              label="Online Backup"
              name="OnlineBackup"
              value={values.OnlineBackup}
              onChange={handleChange}
              options={yesNoNoService}
            />
            <SelectField
              id="field-device-protection"
              label="Device Protection"
              name="DeviceProtection"
              value={values.DeviceProtection}
              onChange={handleChange}
              options={yesNoNoService}
            />
            <SelectField
              id="field-tech-support"
              label="Tech Support"
              name="TechSupport"
              value={values.TechSupport}
              onChange={handleChange}
              options={yesNoNoService}
            />
            <SelectField
              id="field-streaming-tv"
              label="Streaming TV"
              name="StreamingTV"
              value={values.StreamingTV}
              onChange={handleChange}
              options={yesNoNoService}
            />
            <SelectField
              id="field-streaming-movies"
              label="Streaming Movies"
              name="StreamingMovies"
              value={values.StreamingMovies}
              onChange={handleChange}
              options={yesNoNoService}
            />
          </FormSection>

          <div className="divider" />

          {/* ── BILLING & CONTRACT ── */}
          <FormSection icon={CreditCard} title="Billing &amp; Contract">
            <SelectField
              id="field-contract"
              label="Contract"
              name="Contract"
              value={values.Contract}
              onChange={handleChange}
              options={[
                { value: 'Month-to-month', label: 'Month-to-month' },
                { value: 'One year', label: 'One year' },
                { value: 'Two year', label: 'Two year' },
              ]}
            />
            <SelectField
              id="field-paperless-billing"
              label="Paperless Billing"
              name="PaperlessBilling"
              value={values.PaperlessBilling}
              onChange={handleChange}
              options={yesNo}
            />
            <SelectField
              id="field-payment-method"
              label="Payment Method"
              name="PaymentMethod"
              value={values.PaymentMethod}
              onChange={handleChange}
              options={[
                { value: 'Electronic check', label: 'Electronic check' },
                { value: 'Mailed check', label: 'Mailed check' },
                { value: 'Bank transfer (automatic)', label: 'Bank transfer (automatic)' },
                { value: 'Credit card (automatic)', label: 'Credit card (automatic)' },
              ]}
            />
            <NumberField
              id="field-monthly-charges"
              label="Monthly Charges ($)"
              name="MonthlyCharges"
              value={values.MonthlyCharges}
              onChange={handleChange}
              error={errors.MonthlyCharges}
              placeholder="e.g. 85.50"
              step="0.01"
              min="0"
            />
            <NumberField
              id="field-total-charges"
              label="Total Charges ($)"
              name="TotalCharges"
              value={values.TotalCharges}
              onChange={handleChange}
              error={errors.TotalCharges}
              placeholder="e.g. 1026.00"
              step="0.01"
              min="0"
            />
          </FormSection>

          {/* ── API Error ── */}
          {apiError && (
            <div className="api-error-banner" role="alert">
              <AlertCircle size={16} />
              <span>{apiError}</span>
            </div>
          )}

          {/* ── Submit ── */}
          <div className="form-actions">
            <button
              id="submit-prediction-btn"
              type="submit"
              className="btn btn-primary form-submit-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Analyzing Customer…
                </>
              ) : (
                <>
                  Analyze Churn Risk
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </section>
  );
}
