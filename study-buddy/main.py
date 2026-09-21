#!/usr/bin/env python3
"""
Study Buddy — a terminal-based study companion.

Features:
  - Chat-style Q&A tutor for any subject
  - AI-generated multiple-choice quizzes from a topic or your own notes
  - Local progress tracking with daily study streaks

Requires the `anthropic` package and an ANTHROPIC_API_KEY environment
variable to use the AI features. Progress tracking works regardless.
"""

import os
import sys

from storage import ensure_data_dir, load_data
from tutor import chat_tutor
from quiz import generate_quiz
from stats import show_stats


def main_menu():
    ensure_data_dir()
    data = load_data()
    has_key = bool(os.environ.get("ANTHROPIC_API_KEY"))

    print("=" * 40)
    print("           STUDY BUDDY")
    print("=" * 40)
    if not has_key:
        print("\n(No ANTHROPIC_API_KEY set — AI features will prompt you to add one.")
        print(" export ANTHROPIC_API_KEY=sk-ant-...)")

    while True:
        print("\n1. Chat with tutor")
        print("2. Take an AI-generated quiz")
        print("3. View stats & streak")
        print("4. Exit")
        choice = input("\nChoose an option: ").strip()

        if choice == "1":
            chat_tutor(data)
        elif choice == "2":
            generate_quiz(data)
        elif choice == "3":
            show_stats(data)
        elif choice == "4":
            print("Happy studying! See you next time.")
            break
        else:
            print("Please choose 1-4.")


if __name__ == "__main__":
    try:
        main_menu()
    except KeyboardInterrupt:
        print("\n\nGoodbye!")
        sys.exit(0)