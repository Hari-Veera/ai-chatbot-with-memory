import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// 🔧 Force-load .env (Windows + OneDrive safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import { initGemini } from "./services/gemini.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Initialize Gemini AFTER dotenv
initGemini(process.env.GEMINI_API_KEY);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB error");
    console.error(err);
    process.exit(1);
  });

app.use("/chat", chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});


