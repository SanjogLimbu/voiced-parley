# Voiced Parley

A language practicing webapp made primarily for beginners where you're able to pick a language and a situation to roleplay in. You can then act it out by talking to an AI character in real time. If you get stuck, you can ask for help and continue on with the session.

## Tech stack

- Next.js (App Router), React and TypeScript
- Tailwind CSS
- OpenAI Realtime API and Agents SDK 
- OpenAI Responses API 

## Getting started

### Requirements

- Node.js and npm compatible with the project's Next.js version
- An OpenAI API key with access to the models the project uses
- A modern browser with granted microphone access

### Configure

Create a `.env` file in the project root:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### Run locally

```bash
npm run dev
```

Then open http://localhost:3000.

### Try a voice conversation

1. Pick a target language.
2. Pick a scenario.
3. Select voice mode and grant permission to use microphone.

If you're running the project locally on a computer make sure to have a microphone plugged in.

## Project structure

```text
app/
  api/
    chat/route.ts       # Text conversation
    start/route.ts      # Start a text scenario
    realtime/route.ts   # Short-lived realtime session credentials
  parley/page.tsx       # Language, scenario selection, and conversation page
components/
  VoiceChat.tsx         # Live voice UI and session
lib/
  prompts.ts            # Agent instructions
```
