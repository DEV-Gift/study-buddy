import os

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI


# Load the secret API key from the .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Create the OpenAI client using your secret API key
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key) if api_key else None


@app.route("/")
def home():
    return "Study Buddy backend is running!"


@app.route("/ask", methods=["POST"])
def ask_question():
    # Check whether the API key is configured
    if client is None:
        return jsonify({
            "error": "The AI service is not configured yet."
        }), 500

    # Read the question sent by the website
    data = request.get_json(silent=True) or {}
    question = data.get("question", "")

    # Make sure the question is text
    if not isinstance(question, str):
        return jsonify({
            "error": "Please enter a valid question."
        }), 400

    question = question.strip()

    # Reject empty questions
    if not question:
        return jsonify({
            "error": "Please enter an academic question."
        }), 400

    # Limit the length of questions
    if len(question) > 2000:
        return jsonify({
            "error": "Please keep your question under 2,000 characters."
        }), 400

    try:
        # Ask the AI to act as an academic learning assistant
        response = client.responses.create(
            model="gpt-4.1-mini",
            instructions=(
                "You are Study Buddy, a friendly academic learning "
                "assistant for students. Help students understand "
                "school subjects such as Mathematics, Biology, "
                "Chemistry, Physics, English, and other academic "
                "subjects. Explain concepts clearly and step by step "
                "using language appropriate for a student. Give "
                "examples when useful. If a question is unrelated "
                "to education or learning, politely explain that "
                "you focus on academic questions and invite the "
                "student to ask about a school subject. Never claim "
                "to know something you do not know."
            ),
            input=question,
            max_output_tokens=800,
        )

        answer = response.output_text

        return jsonify({
            "question": question,
            "answer": answer
        })

    except Exception:
        # Keep secret credentials and technical details out of responses
        app.logger.exception("Study Buddy AI request failed.")

        return jsonify({
            "error": (
                "Sorry, Study Buddy could not generate an answer. "
                "Please check your API setup and try again."
            )
        }), 500


if __name__ == "__main__":
    app.run(debug=True)