import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { sendMessage } from "./sendMessage";
import { handleAudio } from "./audio";
import prisma from "../prisma/prisma";
import { findResponse } from "./app";
import { cosineSimilarity, getEmbedding } from "./embeddings";
import { OpenAI } from "openai";

config();
// Initialize Express app
const app = express();

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment variables");
}

// Initialize services with configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Body Parsing
app.use(bodyParser.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database Service
const messageService = {
  async saveMessage(body: string, from: string, type: "audio" | "text") {
    try {
      return await prisma.message.create({
        data: {
          to: "",
          from,
          body,
          type,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },

  async getRecentMessages(from: string, limit = 5) {
    try {
      return await prisma.message.findMany({
        take: limit,
        where: { from },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.log("Failed to fetch recent messages", error);
    }
  },
};

async function buildContext(from: string, currentMessage: string) {
  try {
    const recentMessages = await messageService.getRecentMessages(from);

    const context =
      Array.isArray(recentMessages) && recentMessages.length > 0
        ? recentMessages.map((msg) => `- ${msg.body}`).join("\n")
        : "";

    return context || currentMessage;
  } catch (error) {
    console.error("Erreur lors de la reformulation :", error);
    return currentMessage;
  }
}

// Routes
app.post("/uir-chat-bot", async (req: Request, res: Response) => {
  try {
    const message = req.body;

    // Handle audio messages
    if (message.MediaContentType0 === "audio/ogg") {
      const question = await handleAudio(message.MediaUrl0);
      const response = await findResponse(question);

      await Promise.all([
        sendMessage(message.From, response),
        messageService.saveMessage(question, message.From, "audio"),
      ]);

      res.json({ success: true, message: "Audio response sent" });
    }

    if (!message.Body) {
      res.status(400).json({ error: "Message body is required" });
    }

    const context = await buildContext(message.From, message.Body);

    console.log("********************");
    console.log(context);
    console.log("********************");
    const [response] = await Promise.all([
      findResponse(context),
      messageService.saveMessage(message.Body, message.From, "text"),
    ]);

    await sendMessage(message.From, response);
    res.json({ success: true, message: "Text response sent" });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// Start Server
const port = process.env.PORT || 7001;
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
