import joblib
from sentence_transformers import SentenceTransformer

bundle = joblib.load("app/models/intent_detect_v1.pkl")

svm_model = bundle["model"]
label_encoder = bundle["label_encoder"] 

embedder = SentenceTransformer("all-MiniLM-L6-v2")


def predict_intent(text):
    embedding = embedder.encode([text])

    pred_encoded = svm_model.predict(embedding)[0]
    intent = label_encoder.inverse_transform([pred_encoded])[0]

    probabilities = svm_model.predict_proba(embedding)[0]
    confidence = max(probabilities)

    return intent, confidence 
 