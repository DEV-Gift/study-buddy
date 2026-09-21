# Study Buddy

A terminal-based study companion: chat with an AI tutor, take AI-generated
quizzes on any topic or your own notes, and track your study streak over
time.

## Setup

```bash
pip install -r requirements.txt --break-system-packages
export ANTHROPIC_API_KEY=sk-ant-...   # from console.anthropic.com
```

## Run

```bash
python3 main.py
```

## Project structure

```
study_buddy/
├── main.py            # entry point / menu loop
├── ai_client.py        # Anthropic API client setup
├── tutor.py            # chat-style Q&A tutor
├── quiz.py             # AI-generated quiz generation + grading
├── stats.py             # progress/streak reporting
├── storage.py           # local JSON persistence
├── requirements.txt
└── README.md
```

## Data

Progress, quiz history, and your daily streak are stored locally at:

```
~/.study_buddy/data.json
```

Nothing is synced anywhere else.