from pathlib import Path

import joblib
import pandas as pd


# Path to the saved ML model
MODEL_PATH = Path(__file__).resolve().parents[2] / "models" / "churn_model.pkl"


# Load the trained ML pipeline
model = joblib.load(MODEL_PATH)


def predict_churn(customer_data: dict):
    # Convert customer data into a one-row DataFrame
    customer_df = pd.DataFrame([customer_data])

    # Predict churn: 0 = No Churn, 1 = Churn
    prediction = model.predict(customer_df)[0]

    # Get probability of Churn (class 1)
    probability = model.predict_proba(customer_df)[0][1]

    # Convert prediction into readable label
    prediction_label = "Churn" if prediction == 1 else "No Churn"

    # Return prediction result
    return {
        "prediction": int(prediction),
        "prediction_label": prediction_label,
        "churn_probability": round(float(probability), 3),
        "churn_percentage": round(float(probability) * 100, 1)
    }