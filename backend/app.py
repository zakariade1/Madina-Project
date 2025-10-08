from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.get("/healthz")
def healthz():
    return jsonify(ok=True)

@app.get("/api/hello")
def hello():
    return jsonify(message="Hello from Flask")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("APP_PORT", 9000)))