"""Chat-style Q&A tutor mode."""

from datetime import datetime

from ai_client import get_client, MODEL
from storage import record_activity, save_data


def chat_tutor(data):
    client = get_client()
    if not client:
        return

    subject = input("What subject do you want to study? ").strip()
    if not subject:
        print("No subject given, returning to menu.")
        return
    print(f"\nChat tutor mode for '{subject}'. Type 'exit' to return to the menu.\n")

    history = []
    system_prompt = (
        f"You are a patient, encouraging tutor helping a student study {subject}. "
        "Explain concepts clearly, use concrete examples, and occasionally ask "
        "follow-up questions to check understanding. Keep answers focused, not "
        "overly long."
    )
    while True:
        user_input = input("You: ").strip()
        if user_input.lower() in ("exit", "quit"):
            break
        if not user_input:
            continue
        history.append({"role": "user", "content": user_input})
        try:
            response = client.messages.create(
                model=MODEL,
                max_tokens=1000,
                system=system_prompt,
                messages=history,
            )
        except Exception as e:
            print(f"Error talking to the model: {e}")
            history.pop()
            continue
        reply = "".join(b.text for b in response.content if b.type == "text")
        print(f"\nTutor: {reply}\n")
        history.append({"role": "assistant", "content": reply})

    if len(history) >= 2:
        session = {
            "type": "chat",
            "subject": subject,
            "timestamp": datetime.now().isoformat(),
            "turns": len(history) // 2,
        }
        data.setdefault("sessions", []).append(session)
        record_activity(data)
        save_data(data)
        print(f"Session saved: {session['turns']} exchanges on {subject}.\n")