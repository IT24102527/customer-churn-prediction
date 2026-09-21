# Customer Churn Prediction System

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=flat-square&logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?style=flat-square&logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.x-F7931E?style=flat-square&logo=scikit-learn)

An end-to-end machine learning application that predicts whether a telecom customer is likely to churn. The trained ML model is served through a FastAPI REST API and connected to a React frontend that accepts customer data and returns a real-time prediction with churn probability.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Dataset](#dataset)
- [Model](#model)
- [Model Performance](#model-performance)
- [Features](#features)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Run Locally](#run-locally)
- [Environment Variables](#environment-variables)
- [What I Learned](#what-i-learned)
- [Future Improvements](#future-improvements)

---

## Project Overview

Telecom customer churn is a significant business problem — retaining existing customers is generally more cost-effective than acquiring new ones. This project builds a complete pipeline from data cleaning and model training through to a deployed prediction API with a browser-based frontend.

The goal is to identify customers who are likely to churn based on their account information and service usage, enabling support for proactive retention decisions.

---

## Architecture

```
Customer Input (19 features)
         ↓
  React Frontend
         ↓
  FastAPI REST API
         ↓
 Saved Scikit-learn Pipeline
         ↓
     Preprocessing
  (Scaling + Encoding)
         ↓
Balanced Logistic Regression
         ↓
 Prediction + Churn Probability
         ↓
  React Result Display
```

---

## Tech Stack

**Machine Learning**
- Python
- Pandas — data cleaning and EDA
- Scikit-learn — preprocessing pipeline, model training, evaluation
- Joblib — model serialization
- Jupyter Notebook — exploration and experimentation

**Backend**
- FastAPI — REST API framework
- Pydantic — request validation and schema definition
- Uvicorn — ASGI server

**Frontend**
- React 18
- Vite — development server and bundler
- JavaScript (ES6+)
- CSS — custom dark-theme design system

---

## Dataset

**IBM Telco Customer Churn Dataset**

| Property | Detail |
|---|---|
| Records | ~7,043 customer entries |
| Original columns | 21 |
| Target column | `Churn` (Yes / No) |
| Source | IBM Sample Dataset |

**Preprocessing applied:**
- `customerID` removed (identifier, not a feature)
- `TotalCharges` converted from string to numeric; rows with non-numeric values dropped
- `Churn` encoded to binary: `1 = Churn`, `0 = No Churn`
- Numerical features scaled with `StandardScaler`
- Categorical features encoded with `OneHotEncoder`
- Full preprocessing wrapped in a Scikit-learn `Pipeline`

---

## Model

**Final model:** Balanced Logistic Regression (`class_weight='balanced'`)

**Problem type:** Binary Classification

**Target:** Customer Churn (`0 = No Churn`, `1 = Churn`)

### Model Selection

Three models were evaluated on the same train/test split:

| Model | Notes |
|---|---|
| Standard Logistic Regression | Baseline; biased toward the majority class (No Churn) |
| Random Forest | Strong overall accuracy; lower recall on the churn class |
| Balanced Logistic Regression | Improved recall for the churn class by addressing class imbalance |

**Balanced Logistic Regression was selected for the application** because the class weighting improved its ability to identify churn customers (higher recall), which is more useful in practice — missing a customer who is about to churn is typically more costly than a false positive. This does not mean it is universally the best model for this dataset; it was the most appropriate choice given the project objective.

---

## Model Performance

Test-set evaluation metrics — Balanced Logistic Regression:

| Metric | Value | Description |
|---|---|---|
| Accuracy | 73.8% | Overall correct predictions on the test set |
| Precision | 50.4% | Of predicted churn customers, how many were actually churn |
| Recall | 78.3% | Of actual churn customers, how many the model identified |
| F1 Score | 61.4% | Harmonic mean of precision and recall |
| ROC-AUC | 0.842 | Area under the ROC curve |

> All metrics are evaluated on held-out test data as reported in the project notebook.

The relatively lower precision reflects the trade-off made by using class weighting — the model is tuned to catch more actual churn cases at the cost of some false positives, which is a deliberate design choice.

---

## Features

- Real-time customer churn prediction via FastAPI
- Churn probability score returned with each prediction
- UI risk interpretation: **Low** (0–39%) / **Moderate** (40–69%) / **High** (70–100%)
- 19 customer input features covering demographics, services, and billing
- Client-side input validation before API call
- API health status monitoring in the navbar
- Responsive React interface with dark professional design
- Model performance information displayed in the frontend

---

## Project Structure

```
customer-churn-prediction/
├── backend/
│   └── app/
│       ├── __init__.py
│       ├── main.py          # FastAPI app, CORS, route definitions
│       ├── schemas.py       # Pydantic request model (19 fields)
│       └── model_service.py # Loads the saved pipeline, runs prediction
├── data/
│   └── WA_Fn-UseC_-Telco-Customer-Churn.csv   # IBM Telco dataset
├── frontend/
│   ├── src/
│   │   ├── components/      # React components (Navbar, Form, Result, etc.)
│   │   ├── services/
│   │   │   └── api.js       # All fetch calls to the FastAPI backend
│   │   ├── App.jsx
│   │   └── index.css        # Global design system and CSS variables
│   └── .env                 # VITE_API_BASE_URL
├── models/
│   └── churn_model.pkl      # Saved Scikit-learn pipeline (Joblib)
├── notebooks/
│   └── churn_analysis.ipynb # EDA, preprocessing, training, evaluation
└── README.md
```

---

## API Reference

### `GET /`
Health check. Returns a confirmation that the API is running.

### `GET /health`
Used by the frontend to display API connection status.

**Response:**
```json
{ "status": "healthy" }
```

### `POST /predict`
Accepts 19 customer fields and returns a churn prediction.

**Example request body:**
```json
{
  "gender": "Female",
  "SeniorCitizen": 0,
  "Partner": "Yes",
  "Dependents": "No",
  "tenure": 12,
  "PhoneService": "Yes",
  "MultipleLines": "No",
  "InternetService": "Fiber optic",
  "OnlineSecurity": "No",
  "OnlineBackup": "Yes",
  "DeviceProtection": "No",
  "TechSupport": "No",
  "StreamingTV": "Yes",
  "StreamingMovies": "Yes",
  "Contract": "Month-to-month",
  "PaperlessBilling": "Yes",
  "PaymentMethod": "Electronic check",
  "MonthlyCharges": 85.50,
  "TotalCharges": 1026.00
}
```

**Example response:**
```json
{
  "prediction": 1,
  "prediction_label": "Churn",
  "churn_probability": 0.884,
  "churn_percentage": 88.4
}
```

| Field | Type | Description |
|---|---|---|
| `prediction` | int | `1` = Churn, `0` = No Churn |
| `prediction_label` | string | Human-readable label |
| `churn_probability` | float | Raw probability (0–1) |
| `churn_percentage` | float | Probability as percentage (0–100) |

Interactive API documentation is available at `http://127.0.0.1:8000/docs` when the backend is running.

---

## Run Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd customer-churn-prediction
```

### 2. Backend (FastAPI)

**Create and activate a virtual environment (Windows):**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**Install dependencies:**

```powershell
pip install -r backend/requirements.txt
```

**Start the API server:**

```powershell
python -m uvicorn backend.app.main:app --reload
```

The backend will run at: `http://127.0.0.1:8000`  
Swagger UI (interactive docs): `http://127.0.0.1:8000/docs`

### 3. Frontend (React + Vite)

Open a second terminal in the project root:

```powershell
cd frontend
npm install
npm run dev
```

The frontend will run at: `http://localhost:5173`

> **Note:** The FastAPI backend must be running before making predictions. The frontend will display "API Offline" in the navbar if the backend is not reachable.

---

## Environment Variables

The frontend reads the backend URL from an environment variable. The file `frontend/.env` should contain:

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

This is already included in the repository. Do not commit any secrets or credentials to this file.

---

## What I Learned

- **Data cleaning and EDA** — handling missing values, type conversion, understanding feature distributions, and identifying the class imbalance in the churn target
- **Class imbalance** — understanding why accuracy alone is misleading on imbalanced datasets and how class weighting changes model behaviour
- **Classification evaluation** — using precision, recall, F1 score, and ROC-AUC to evaluate models beyond simple accuracy, and understanding the precision–recall trade-off
- **Preprocessing pipelines** — building Scikit-learn pipelines that combine scaling and encoding, ensuring consistent transformation at both training and inference time
- **Serving ML models** — using FastAPI and Joblib to load a saved pipeline and expose it as a REST API with validated input using Pydantic
- **Connecting React to an ML backend** — managing form state, building exact API payloads, handling loading and error states, and displaying prediction results in the browser

---

## Future Improvements

- **Explainable AI** — integrate SHAP or LIME to provide feature-level explanations for individual predictions
- **Classification threshold tuning** — explore adjusting the decision threshold beyond 0.5 to further optimize the precision–recall trade-off for the business use case
- **Additional model experimentation** — evaluate XGBoost, LightGBM, or ensemble methods as potential alternatives
- **Deployment** — containerize with Docker and deploy to a cloud provider (e.g., Render, Railway, or AWS)
- **Automated testing** — add unit tests for the FastAPI endpoints and preprocessing pipeline

---

*Built as an end-to-end ML project covering data analysis, model training, API development, and frontend integration.*
