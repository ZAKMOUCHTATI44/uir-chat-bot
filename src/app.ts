import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PrismaClient, Prisma, Document } from "@prisma/client";
import dotenv from "dotenv";
import { OpenAI } from "openai";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const findReponse = async (userInput: string) => {
  const db = new PrismaClient();

  // Create vector store instance for searching existing documents
  const vectorStore = PrismaVectorStore.withModel<Document>(db).create(
    new OpenAIEmbeddings(),
    {
      prisma: Prisma,
      tableName: "Document",
      vectorColumnName: "vector",
      columns: {
        id: PrismaVectorStore.IdColumn,
        question: PrismaVectorStore.ContentColumn,
        answer: PrismaVectorStore.ContentColumn,
      },
    }
  );

  // Perform similarity search on existing documents
  const results = await vectorStore.similaritySearch(userInput, 1);

  results.map((result) => {
    console.log(result.metadata.answer);
    console.log(result.metadata.question);
  });

  const prompt = `
    You are an assistant from Université Internationale de Rabat, specializing in providing accurate and helpful information. Use the following FAQs to answer the user's question.

  FAQs:
  ${results
    .map(
      (result) => `Q: ${result.metadata.question}\nA: ${result.metadata.answer}`
    )
    .join("\n")}}
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
