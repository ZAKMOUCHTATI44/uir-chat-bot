import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PrismaClient, Prisma, Document } from "@prisma/client";

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
  const resultOne = await vectorStore.similaritySearch(userInput, 1);
  return resultOne[0].metadata.answer;
};
