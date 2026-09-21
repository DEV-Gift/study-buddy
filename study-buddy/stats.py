"""Progress and streak reporting."""

from datetime import datetime


def show_stats(data):
    sessions = data.get("sessions", [])
    streak = data.get("streak", 0)
    print(f"\nCurrent streak: {streak} day{'s' if streak != 1 else ''}")
    print(f"Total sessions: {len(sessions)}")

    quiz_sessions = [s for s in sessions if s["type"] == "quiz"]
    if quiz_sessions:
        total_score = sum(s["score"] for s in quiz_sessions)
        total_qs = sum(s["total"] for s in quiz_sessions)
        avg = round(100 * total_score / total_qs) if total_qs else 0
        print(f"Quizzes taken: {len(quiz_sessions)}  |  Overall accuracy: {avg}%")

    chat_sessions = [s for s in sessions if s["type"] == "chat"]
    if chat_sessions:
        print(f"Tutor chat sessions: {len(chat_sessions)}")

    if sessions:
        print("\nRecent activity:")
        for s in sessions[-5:]:
            ts = datetime.fromisoformat(s["timestamp"]).strftime("%b %d, %H:%M")
            if s["type"] == "quiz":
                print(f"  [{ts}] Quiz on '{s['topic']}': {s['score']}/{s['total']}")
            else:
                print(f"  [{ts}] Chat on '{s['subject']}': {s['turns']} exchanges")
    print()