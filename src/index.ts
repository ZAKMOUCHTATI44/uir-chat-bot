import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { findReponse } from "./app";
import { sendMessage } from "./sendMessage";

config();

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/uir-chat-bot", async (req: Request, res: Response) => {
  const message = req.body;

  console.log("************");
  console.log(message);
  console.log("************");
  if (!message) {
    res.status(400).send("No question provided");
  }

  const response = await findReponse(message.Body);

  if (response) {
    sendMessage(message.From, response);
  } else {
    sendMessage(
      message.Form,
      `Bonjour ! Comment puis-je vous aider aujourd'hui ?`
    );
  }

  res.json({ response });
});

const port = 7001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
