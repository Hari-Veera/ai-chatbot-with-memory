import express from "express";
import User from "../models/User.js";
import { askAI } from "../services/ai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: "Invalid request" });
    }

    let user = await User.findOne({ userId });

    // 🔹 Manual memory recall (works even without AI)
    if (
      message.toLowerCase().includes("what is my name") &&
      user?.name
    ) {
      return res.json({
        reply: `Your name is ${user.name} 😊`
      });
    }

    const prompt = `
You are a friendly, human-like chatbot.
Never say you are an AI or language model.
Maintain a consistent personality.

User memory:
${user?.summary || "No previous memory"}

User message:
${message}
`;

    let reply;

    // 🔹 AI call with graceful fallback
    try {
      reply = await askAI(prompt);
    } catch (err) {
      console.error("AI ERROR:", err.message);
      reply =
        "I'm currently unavailable, but I remember our conversation 😊 Please try again later.";
    }

    // 🔹 Simple memory extraction
    if (message.toLowerCase().includes("my name is")) {
      const name = message.split("my name is")[1]?.trim();
      if (name) {
        await User.findOneAndUpdate(
          { userId },
          {
            name,
            summary: `User name is ${name}`
          },
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


