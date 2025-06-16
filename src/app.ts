import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PrismaClient, Prisma, Document } from "@prisma/client";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment variables");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const db = new PrismaClient();

// Helper to create vector store
const createVectorStore = () => {
  return PrismaVectorStore.withModel<Document>(db).create(
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
};

export const findReponse = async (userInput: string): Promise<string> => {
  try {
    const vectorStore = createVectorStore();

    const results = await vectorStore.similaritySearch(userInput, 3); // fetch top 3 for better context

    if (!results || results.length === 0) {
      return "Je suis désolé, je n'ai pas trouvé de réponse correspondante à votre question.";
    }

    const faqs = results
      .map(
        (result, index) =>
          `Q${index + 1}: ${result.metadata.question}\nA${index + 1}: ${result.metadata.answer}`
      )
      .join("\n");

    const prompt = `
Vous êtes un assistant de l'Université Internationale de Rabat. Utilisez les questions fréquentes ci-dessous pour répondre de manière claire, précise et professionnelle à l'utilisateur.

FAQs :
${faqs}

Question de l'utilisateur : ${userInput}
Réponse :
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const answer = completion.choices[0].message?.content?.trim();

    return answer || "Je suis désolé, je ne peux pas répondre à cette question pour le moment.";
  } catch (error) {
    console.error("Erreur lors de la recherche de réponse :", error);
    return "Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer plus tard.";
  } finally {
    await db.$disconnect();
  }
};
