import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { VocabularyWord } from "../types";

// Helper to safely get API Key
const getApiKey = (): string | undefined => {
  // Vite uses import.meta.env
  return import.meta.env.VITE_GEMINI_API_KEY;
};

// Initialize Gemini Client
const initGemini = () => {
  const apiKey = getApiKey();
  // Check if key is missing or is the placeholder string
  if (!apiKey || apiKey === 'YOUR_API_KEY') {
    console.warn("Gemini API Key is missing or invalid. AI features will be simulated.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateMnemonic = async (word: VocabularyWord): Promise<string> => {
  const ai = initGemini();
  if (!ai) {
    // Fallback simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`(Simulated) Imagine a ${word.english} sitting on top of the kanji ${word.kanji}. The shape resembles...`);
      }, 1000);
    });
  }

  try {
    const prompt = `
      Create a short, memorable mnemonic to help a student learn the Japanese Kanji "${word.kanji}" (Meaning: ${word.english}, Reading: ${word.romaji}).
      Keep it under 30 words. Make it fun and visual.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Could not generate mnemonic.";
  } catch (error) {
    console.error("Gemini Text Generation Error:", error);
    return "Error connecting to AI service.";
  }
};

export const analyzeHandwriting = async (base64Image: string, targetWord: VocabularyWord): Promise<{ isCorrect: boolean; confidence: number; message: string }> => {
  const ai = initGemini();
  if (!ai) {
    // Fallback simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        const isMatch = Math.random() > 0.3;
        resolve({
          isCorrect: isMatch,
          confidence: isMatch ? Math.floor(Math.random() * 20) + 80 : Math.floor(Math.random() * 40),
          message: isMatch ? "Looks good!" : "Try focusing on stroke order.",
        });
      }, 2000);
    });
  }

  try {
    // Strip header if present (e.g., "data:image/jpeg;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const prompt = `
      Analyze this image of handwritten Japanese.
      Does the character written match the Kanji "${targetWord.kanji}"?
      Return a JSON object with:
      - match: boolean
      - confidence: number (0-100)
      - feedback: string (short advice)
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text);
    return {
      isCorrect: result.match,
      confidence: result.confidence,
      message: result.feedback,
    };

  } catch (error) {
    console.error("Gemini Vision Error:", error);
    return {
      isCorrect: false,
      confidence: 0,
      message: "AI Analysis failed.",
    };
  }
};
