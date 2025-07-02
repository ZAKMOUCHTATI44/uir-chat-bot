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

async function savedMessage(body: string, from: string, text: string) {
  await prisma?.message.create({
    data: {
      to: "",
      from: from,
      body: body,
      type: text,
    },
  });
}
app.post("/uir-chat-bot", async (req: Request, res: Response) => {
  const message = req.body;

  // Get The 5 latest message for understand the context

  const latestMessages = await prisma.message.findMany({
    take: 5,
    where: {
      from: message.From,
    },
  });

  let basicContext = latestMessages.map(item => item.body).join(' ');


  if (!message) {
    res.status(400).send("No question provided");
  }

  if (message.MediaContentType0 === "audio/ogg") {
    const question = await handleAudio(message.MediaUrl0);
    const response = await findReponse(question);
    sendMessage(message.From, response);
    // Saved the message for get more context
    await savedMessage(question, message.From, "audio");
  } else {
    const response = await findReponse(message.Body);
    
    sendMessage(`${basicContext} ${message.From}`, response);
    // Saved the message for get more context
    await savedMessage(message.Body, message.From, "text");
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
