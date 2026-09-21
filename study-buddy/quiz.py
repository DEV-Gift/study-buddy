"""AI-generated multiple-choice quizzes."""

import json
from datetime import datetime

from ai_client import get_client, MODEL
from storage import record_activity, save_data


def generate_quiz(data):
    client = get_client()
    if not client:
        return

    topic = input("Quiz topic (or paste your notes): ").strip()
    if not topic:
        print("Nothing to quiz on.")
        return
    try:
        num_q = int(input("How many questions? [5]: ") or "5")
    except ValueError:
        num_q = 5

    print("\nGenerating quiz...\n")
    prompt = (
        f"Create a {num_q}-question multiple-choice quiz based on the following "
        f"topic or notes:\n\n{topic}\n\n"
        "Return ONLY valid JSON, with no preamble or markdown fences, in exactly "
        "this format:\n"
        '{"questions": [{"question": "...", "options": ["A", "B", "C", "D"], '
        '"correct_index": 0, "explanation": "..."}]}'
    )
    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=2000,
            messages=[{"role": "user", "content": prompt}],
        )
    except Exception as e:
        print(f"Error generating quiz: {e}")
        return

    raw = "".join(b.text for b in response.content if b.type == "text").strip()
    if raw.startswith("```"):
        raw = raw.strip("`")
        if raw.lower().startswith("json"):
            raw = raw[4:]
    try:
        quiz = json.loads(raw)
    except json.JSONDecodeError:
        print("Couldn't parse the quiz response. Raw output:\n")
        print(raw)
        return

    run_quiz(quiz.get("questions", []), topic, data)


def run_quiz(questions, topic, data):
    if not questions:
        print("No questions were generated.")
        return

    score = 0
    for i, q in enumerate(questions, 1):
        print(f"\nQ{i}. {q['question']}")
        for j, opt in enumerate(q["options"]):
            print(f"  {chr(65 + j)}. {opt}")
        answer = input("Your answer: ").strip().upper()
        correct_letter = chr(65 + q["correct_index"])
        if answer == correct_letter:
            print("Correct!")
            score += 1
        else:
            print(f"Not quite — correct answer: {correct_letter}. {q.get('explanation', '')}")

    pct = round(100 * score / len(questions))
    print(f"\nScore: {score}/{len(questions)} ({pct}%)\n")

    session = {
        "type": "quiz",
        "topic": topic,
        "timestamp": datetime.now().isoformat(),
        "score": score,
        "total": len(questions),
    }
    data.setdefault("sessions", []).append(session)
    record_activity(data)
    save_data(data)