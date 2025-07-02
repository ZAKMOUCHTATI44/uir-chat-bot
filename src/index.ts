import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { findReponse } from "./app";
import { sendMessage } from "./sendMessage";
import { handleAudio } from "./audio";
import prisma from "../prisma/prisma";
config();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/uir-chat-bot", async (req: Request, res: Response) => {
  const message = req.body;

  if (!message) {
    res.status(400).send("No question provided");
  }

  if (message.MediaContentType0 === "audio/ogg") {
    const question = await handleAudio(message.MediaUrl0);
    const response = await findReponse(question);
    sendMessage(message.From, response);
    // Saved the message for get more context
    await prisma?.message.create({
      data: {
        to: "",
        from: message.From,
        body: question,
        type: "audio",
      },
    });
  } else {
    const response = await findReponse(message.Body);
    sendMessage(message.From, response);

    // Saved the message for get more context
    await prisma?.message.create({
      data: {
        to: "",
        from: message.From,
        body: message.Body,
        type: "text",
      },
    });
  }

  res.json({ message: "Sending ... " });
});

app.post("/ask-chat-gpt", async (req: Request, res: Response) => {
  const message = req.body.Body;

  sendMessage("whatsapp:+18002428478", message);

  res.json({ message });
});

const port = 7001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
