# Perplexity Clone (Gemini-powered)

This is a simple React Native (Expo) mobile application that recreates the look-and-feel of the Perplexity app while using Google Gemini for question answering.

## Features

1. Welcome/Home screen with search bar (text, camera stub, microphone).
2. Discover feed with category tabs (For You, Top Stories, Tech & Science …) and article cards.
3. Voice input modal with live transcription.
4. Bottom tab navigation like the Perplexity UI.
5. Connects to Google Gemini API for answers to user queries.

> Screenshots in the prompt were used as design references.

## Prerequisites

* **Node 18+**
* **Expo CLI** — install globally:
  ```bash
  npm install -g expo-cli
  ```
* A **Google Gemini API key** (Generative Language API).

## Getting started

```bash
# 1. Install dependencies
npm install
# 2. Copy the env template and insert your Gemini key
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=YOUR_KEY
# 3. Run the app
npm run start   # then press a to open Android emulator / i for iOS / w for web
```

## Folder structure

```
.
├── App.tsx                # Entry point & navigation
├── components/            # Reusable UI pieces
├── screens/               # App screens (Home, Discover, Answer …)
├── config/                # Gemini API helper
└── assets/                # Images, icons, etc.
```

## Voice recognition

The app uses `react-native-voice` for speech-to-text. On iOS you need to enable the **Speech Recognition** capability in Xcode. On Android the RECORD_AUDIO permission is requested automatically.

## Note

This project is a **learning/demo** implementation and not production-ready. Feel free to adapt, extend, and improve.