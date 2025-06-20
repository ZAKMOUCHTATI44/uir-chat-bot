import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { findReponse } from "./app";
import { sendMessage } from "./sendMessage";
import { handleAudio } from "./audio";

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
    if (response) {
      sendMessage(message.From, response);
    } else {
      sendMessage(
        message.Form,
        `Bonjour ! Comment puis-je vous aider aujourd'hui ?`
      );
    }
  } else {
    const response = await findReponse(message.Body);
    if (response) {
      sendMessage(message.From, response);
    } else {
      sendMessage(
        message.Form,
        `Bonjour ! Comment puis-je vous aider aujourd'hui ?`
      );
    }
  }

  res.json({ message: "Sending ... " });
});

app.post("/ask-chat-gpt", async (req: Request, res: Response) => {
  const message = req.body.Body;


  sendMessage(
    "whatsapp:+18002428478",
    message
  );


  res.json({ message });
});

const port = 7001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
