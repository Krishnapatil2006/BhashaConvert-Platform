from flask import Flask, request, jsonify, render_template, send_file
import google.generativeai as genai
import os

app = Flask(__name__)
api_key = "AIzaSyA1L7pLPyFEnkB2y7i2AETbt3KFNQvhUYY"
model_name = "models/gemini-2.0-flash"

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel(model_name)
    print(f"[INFO] Gemini model '{model_name}' loaded successfully.")
except Exception as e:
    print(f"[ERROR] Could not initialize Gemini model: {e}")
    model = None

@app.route('/')
def home():
    return send_file('app.html')

@app.route('/index.html')
def index():
    return send_file('index.html')

@app.route('/text.html')
def text():
    return send_file('text.html')

@app.route('/audio.html')
def audio():
    return send_file('audio.html')

@app.route('/video.html')
def video():
    return send_file('video.html')

@app.route('/chat', methods=['POST'])
def chat():
    if model is None:
        return jsonify({'response': "Model not initialized."}), 500

    data = request.get_json()
    if not data or 'message' not in data:
        return jsonify({'response': "No message provided."}), 400

    user_input = data['message'].strip()
    if not user_input:
        return jsonify({'response': "Empty message."}), 400

    try:
        response = model.generate_content(user_input)
        return jsonify({'response': response.text})
    except Exception as e:
        return jsonify({'response': f"Error: {e}"}), 500


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
