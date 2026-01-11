import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;

// Initialize Gemini AFTER dotenv is loaded
export function initGemini(apiKey) {
  if (!apiKey) {
    throw new Error("Gemini API key missing");
  }
  genAI = new GoogleGenerativeAI(apiKey);
}

export async function askGemini(prompt) {
  if (!genAI) {
    throw new Error("Gemini not initialized");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}

