import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { config } from "dotenv";
import { findResponse } from "./services";
import { findReponse } from "./app";
import { sendMessage } from "./sendMessage";

config();

const app = express();
app.use(bodyParser.json());

app.post("/uir-chat-bot", async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).send("No question provided");
  }

  const response = await findReponse(message.Body);

  sendMessage(message.From, response);

  res.json({ response });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
