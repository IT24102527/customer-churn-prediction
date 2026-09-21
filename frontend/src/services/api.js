const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Check if the FastAPI backend is healthy.
 * GET /health
 */
export async function checkHealth() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }
  return response.json();
}

/**
 * Submit customer data to get churn prediction.
 * POST /predict
 *
 * @param {Object} customerData - The 19-field customer payload
 * @returns {Promise<{prediction: number, prediction_label: string, churn_probability: number, churn_percentage: number}>}
 */
export async function predictChurn(customerData) {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.detail || `Prediction request failed: ${response.status}`);
  }

  return response.json();
}
