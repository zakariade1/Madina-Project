from functools import wraps
from flask import Flask, request, jsonify, g
from flask_cors import CORS
import firebase_admin
from firebase_admin import auth as fb_auth
from google.cloud import firestore

firebase_admin.initialize_app()     # uses ADC on Cloud Run
db = firestore.Client()

app = Flask(__name__)
CORS(app)

@app.get("/api/hello")
def hello():
    return jsonify(message="Hello from Flask")

def require_firebase_user(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        parts = auth.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"error": "Missing/invalid Authorization header"}), 401
        try:
            g.user = fb_auth.verify_id_token(parts[1])
        except Exception as e:
            return jsonify({"error":"Invalid token","detail":str(e)}), 401
        return fn(*args, **kwargs)
    return wrapper

@app.post("/api/profile")
@require_firebase_user
def profile():
    uid = g.user["uid"]
    body = request.get_json() or {}
    db.collection("profiles").document(uid).set(
        {"displayName": body.get("displayName","")},
        merge=True
    )
    return jsonify(ok=True)