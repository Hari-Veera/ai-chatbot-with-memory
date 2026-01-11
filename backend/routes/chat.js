import express from "express";
import User from "../models/User.js";
import { askGemini } from "../services/gemini.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "Invalid request" });
    }

    let user = await User.findOne({ userId });

    const prompt = `
You are a friendly, human-like chatbot.
Never say you are an AI or language model.
Maintain consistent personality.

User memory:
${user?.summary || "No previous memory"}

User message:
${message}
`;

    const reply = await askGemini(prompt);

    // Simple memory extraction (enough for assignment)
    if (message.toLowerCase().includes("my name is")) {
      const name = message.split("my name is")[1]?.trim();
      if (name) {
        user = await User.findOneAndUpdate(
          { userId },
          { name, summary: `User name is ${name}` },
          { upsert: true, new: true }
        );
      }
    }

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
