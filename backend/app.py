from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Intent Classification API",
    description="API for intent classification using multiple ML models",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load models and vectorizer at startup
try:
    vectorizer = joblib.load("models/tfidf_vectorizer.pkl")
    naive_bayes_model = joblib.load("models/naive_bayes_model.pkl")
    logistic_regression_model = joblib.load("models/logistic_regression_model.pkl")
    linear_svm_model = joblib.load("models/linear_svm_model.pkl")
    logger.info("All models loaded successfully")
except Exception as e:
    logger.error(f"Error loading models: {e}")
    raise

class PredictionRequest(BaseModel):
    text: str
    model_name: str

class PredictionResponse(BaseModel):
    text: str
    model_name: str
    predicted_intent: str
    # confidence: float = None

# Model mapping
MODELS = {
    "naive_bayes": naive_bayes_model,
    "logistic_regression": logistic_regression_model,
    "linear_svm": linear_svm_model
}

@app.get("/")
async def root():
    return {"message": "Intent Classification API is running"}

@app.get("/models")
async def get_available_models():
    """Get list of available models"""
    return {
        "models": list(MODELS.keys()),
        "description": {
            "naive_bayes": "Naive Bayes Classifier",
            "logistic_regression": "Logistic Regression Classifier",
            "linear_svm": "Linear Support Vector Machine"
        }
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_intent(request: PredictionRequest):
    """Predict intent using the specified model"""
    try:
        # Validate model name
        if request.model_name not in MODELS:
            raise HTTPException(
                status_code=400,
                detail=f"Model '{request.model_name}' not found. Available models: {list(MODELS.keys())}"
            )
        
        # Validate input text
        if not request.text.strip():
            raise HTTPException(
                status_code=400,
                detail="Input text cannot be empty"
            )
        
        # Get the selected model
        selected_model = MODELS[request.model_name]
        
        # Transform text using vectorizer
        X_tfidf = vectorizer.transform([request.text])
        
        # Make prediction
        prediction = selected_model.predict(X_tfidf)
        
        # Try to get prediction probability (confidence) if available
        # confidence = None
        # if hasattr(selected_model, 'predict_proba'):
        #     try:
        #         proba = selected_model.predict_proba(X_tfidf)
        #         confidence = float(max(proba[0])) if len(proba) > 0 else None
        #     except Exception as e:
        #         logger.warning(f"Could not get prediction probability: {e}")
        
        return PredictionResponse(
            text=request.text,
            model_name=request.model_name,
            predicted_intent=prediction[0]
            # confidence=confidence
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during prediction: {str(e)}"
        )

@app.post("/predict-all")
async def predict_all_models(text: str):
    """Predict intent using all available models"""
    try:
        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Input text cannot be empty"
            )
        
        results = {}
        X_tfidf = vectorizer.transform([text])
        
        for model_name, model in MODELS.items():
            try:
                prediction = model.predict(X_tfidf)
                
                # Try to get confidence
                # confidence = None
                # if hasattr(model, 'predict_proba'):
                #     try:
                #         proba = model.predict_proba(X_tfidf)
                #         confidence = float(max(proba[0])) if len(proba) > 0 else None
                #     except Exception:
                #         pass
                
                results[model_name] = {
                    "predicted_intent": prediction[0]
                    # "confidence": confidence
                }
            except Exception as e:
                results[model_name] = {
                    "error": str(e)
                }
        
        return {
            "text": text,
            "results": results
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error during prediction: {str(e)}"
        )
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "models_loaded": len(MODELS)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)