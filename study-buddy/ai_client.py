"""Shared Anthropic API client setup."""

import os

MODEL = "claude-sonnet-4-6"


def get_client():
    """Return an Anthropic client, or None (with guidance printed) if unavailable."""
    try:
        import anthropic
    except ImportError:
        print("\nThe 'anthropic' package isn't installed.")
        print("Install it with: pip install anthropic --break-system-packages\n")
        return None

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("\nNo ANTHROPIC_API_KEY found in your environment.")
        print("Set it with: export ANTHROPIC_API_KEY=sk-ant-...\n")
        return None

    return anthropic.Anthropic(api_key=api_key)