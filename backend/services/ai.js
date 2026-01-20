import OpenAI from "openai";

let client = null;

export function initAI(apiKey) {
  if (!apiKey) {
    throw new Error("OpenAI API key missing");
  }
  client = new OpenAI({ apiKey });
}

export async function askAI(prompt) {
  if (!client) {
    throw new Error("AI not initialized");
  }

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: "You are a friendly, human-like chatbot." },
      { role: "user", content: prompt }
    ]
  });

  return response.choices[0].message.content;
}
