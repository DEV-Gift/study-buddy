import os

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

# Connect to Gemini
client = genai.Client(api_key=api_key) if api_key else None


@app.route("/")
def home():
    return "Studdy Buddy backend is running!"


@app.route("/ask", methods=["POST"])
def ask_question():

    # Check API key
    if client is None:
        return jsonify({
            "error": "Gemini API key is missing. Please check your setup."
        }), 500

    # Get student's question
    data = request.get_json(silent=True) or {}
    question = data.get("question", "")

    # Validate question
    if not isinstance(question, str):
        return jsonify({
            "error": "Please enter a valid question."
        }), 400

    question = question.strip()

    if not question:
        return jsonify({
            "error": "Please enter an academic question."
        }), 400

    if len(question) > 2000:
        return jsonify({
            "error": "Please keep your question under 2,000 characters."
        }), 400

    try:
        # Send question to Gemini
        response = client.interactions.create(
            model="gemini-3.8-flash",
            input=(
                "You are Studdy Buddy, a friendly AI-powered "
                "academic learning assistant. Help students "
                "understand Mathematics, Biology, Chemistry, "
                "Physics, English and other school subjects. "
                "Explain concepts clearly and step by step. "
                "Use simple language and examples where helpful. "
                "If a question is unrelated to education, "
                "politely guide the student back to academic learning.\n\n"
                "Student's question: " + question
            ),
            store=False
        )

        answer = response.output_text

        if not answer:
            return jsonify({
                "error": "No answer was generated. Please try again."
            }), 502

        return jsonify({
            "question": question,
            "answer": answer
        }), 200

    except Exception as error:

        # Record technical details in the terminal
        app.logger.exception("Gemini request failed.")

        error_message = str(error).lower()

        # Gemini temporarily unavailable
        if "503" in error_message or "unavailable" in error_message:
            return jsonify({
                "error": (
                    "Studdy Buddy is temporarily busy. "
                    "Please wait a moment and try again."
                )
            }), 503

        # API usage limit or exhausted credits
        if "429" in error_message or "resource_exhausted" in error_message:
            return jsonify({
                "error": (
                    "The AI service has reached its usage limit. "
                    "Please try again later."
                )
            }), 429

        # Invalid API key or permission problem
        if "401" in error_message or "403" in error_message:
            return jsonify({
                "error": (
                    "There is a problem with the Gemini API key "
                    "or its permissions."
                )
            }), 401

        # Model not found
        if "404" in error_message or "not_found" in error_message:
            return jsonify({
                "error": (
                    "The selected Gemini model is unavailable. "
                    "Please check the model configuration."
                )
            }), 404

        # Other errors
        return jsonify({
            "error": (
                "Something went wrong while generating your answer. "
                "Please try again."
            )
        }), 500


if __name__ == "__main__":
    app.run(debug=True)
