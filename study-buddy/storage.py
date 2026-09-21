"""Local persistence for sessions and study streaks."""

import json
from pathlib import Path
from datetime import date

DATA_DIR = Path.home() / ".study_buddy"
DATA_FILE = DATA_DIR / "data.json"


def ensure_data_dir():
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def load_data():
    if DATA_FILE.exists():
        try:
            with open(DATA_FILE, "r") as f:
                return json.load(f)
        except (json.JSONDecodeError, OSError):
            print("Warning: could not read saved data, starting fresh.")
    return {"activity_log": [], "sessions": [], "streak": 0}


def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)


def record_activity(data):
    """Mark today as an active study day and refresh the streak."""
    today = date.today().isoformat()
    log = data.setdefault("activity_log", [])
    if today not in log:
        log.append(today)
    update_streak(data)


def update_streak(data):
    log = sorted(data.get("activity_log", []))
    if not log:
        data["streak"] = 0
        return
    streak = 1
    for i in range(len(log) - 1, 0, -1):
        d1 = date.fromisoformat(log[i])
        d2 = date.fromisoformat(log[i - 1])
        if (d1 - d2).days == 1:
            streak += 1
        else:
            break
    last = date.fromisoformat(log[-1])
    if (date.today() - last).days > 1:
        streak = 0
    data["streak"] = streak