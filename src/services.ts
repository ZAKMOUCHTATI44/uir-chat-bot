import dotenv from "dotenv";
import prisma from "../prisma/prisma";
import { OpenAI } from "openai";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const findResponse = async (userInput: string) => {
  // 1. Embed user question
  const userEmbedding = await openai.embeddings.create({
    input: userInput,
    model: "text-embedding-3-small",
  });

  const topFAQs: any[] = await prisma.$queryRaw`
  SELECT id, question, answer
  FROM "FAQ"
  ORDER BY embedding <-> ${userEmbedding}::vector
  LIMIT 5;
`;

  const prompt = `
  You are an assistant from Université Internationale de Rabat, specializing in providing accurate and helpful information. Use the following FAQs to answer the user's question.

FAQs:
${topFAQs.map((faq: any) => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n")}

User: ${userInput}
Answer:
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });

  const answer = completion.choices[0].message?.content;

  return answer;
};
