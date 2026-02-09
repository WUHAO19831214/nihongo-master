<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Nihongo Master - AI Japanese Learning Tool

An intelligent, interactive web application for learning Japanese vocabulary, featuring handwriting motion detection, AI-powered OCR, and automated feedback loops.

## ✨ New Features

### 1. 📷 Dynamic Vocabulary Input
Create your own study lists instead of just using the default ones.
- **New List**: Click the "New List" tab in the sidebar.
- **Input Methods**:
    - **Text Paste**: Paste words in "Kanji English" format (e.g., "猫 Cat").
    - **Photo Upload**: Upload an image of text (Simulated OCR will extract "Cat" and "Dog" for demo).

### 2. 🔊 Enhanced Flashcards
- **Rich Display**: Shows Kanji, Romaji, English, and **Chinese** definitions.
- **Context**: See the previous and next words for better flow.
- **Pronunciation**: Click the Kanji or the speaker icon to hear the word.

### 3. ⏩ Auto-Navigation
- After a **correct** answer, the app waits 5 seconds and then **automatically moves to the next word**, allowing for hands-free practice.

---

## 🚀 How to Run Locally

**Prerequisites:** Node.js (v18+)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure AI (Optional)**
   - The app uses a simulated AI service by default so it works out of the box.
   - To use real Gemini AI, set `GEMINI_API_KEY` in `.env.local`.

3. **Start the App**
   ```bash
   npm run dev
   ```
   open http://localhost:5173 (or the link shown in your terminal).

## 🎮 Usage Guide

1. **Start**: Launch the app. You will see "Practice" mode with default words.
2. **Review**: Look at the Flashcard. Read the meaning and sentence.
3. **Practice**:
    - Use "Previous" and "Next" buttons to navigate through the words.
    - Click the Kanji or Speaker icon to hear the pronunciation.
4. **Custom List**:
    - Click **"New List"** -> Type "日本 Japan" -> Click **"Load Text"**.
    - Your session now uses your custom words!
