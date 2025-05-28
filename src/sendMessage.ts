import { twilioInstance } from "./twilio";

export async function sendMessage(sendTo: string, message: string) {
  const client = await twilioInstance();

  client.messages
    .create({
      body: message,
      from: "whatsapp:+212719507879",
      to: "whatsapp:+212621586010",
    })
    .then((res) => {
      console.log("SENDING ...");
    })
    .catch((err) => {
      console.log(err);
    });
}
