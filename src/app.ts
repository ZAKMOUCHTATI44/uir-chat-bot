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

export async function generateEmbedding(text: string) {
  if (!text || text.trim() === "") {
    return null;
  }
  const embedding = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });

  return embedding;
}

export const findReponse = async (userInput: string): Promise<string> => {

  try {
    // Check if it's a greeting or empty input
    // if (
    //   !userInput.trim() ||
    //   /^(bonjour|salut|hello|hi|hey|bonsoir)/i.test(userInput.trim())
    // ) {
    //   return "Bonjour ! Je suis l'assistant virtuel de l'Université Internationale de Rabat (UIR). Comment puis-je vous aider aujourd'hui ?";
    // }

    const vectorStore = createVectorStore();
    const results = await vectorStore.similaritySearch(userInput, 3);

    console.log(results);
    const faqs = results
      .map(
        (result, index) =>
          `[Question similaire ${index + 1}]: ${result.metadata.question}\n` +
          `[Réponse associée]: ${result.metadata.answer}`
      )
      .join("\n\n");

    const prompt = `
Vous êtes l'assistant virtuel de l'Université Internationale de Rabat. Votre personnalité est:
- Amical(e) et professionnel(le)
- Naturel(le) dans vos réponses
- Serviable et précis(e)
- Utilise un langage courant mais respectueux

Contexte disponible:
${faqs}

Guide de réponse:
1. Répondez comme un humain, pas comme un robot
2. Soyez concis mais complet
3. Si vous n'êtes pas sûr, proposez des alternatives
4. Utilisez des formulations naturelles comme "Je vous conseille..." ou "Pour cela, vous pouvez..."

Question: "${userInput}"

Répondez maintenant comme si vous parliez à un étudiant ou visiteur devant vous, de manière naturelle et utile:`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
      max_tokens: 250,
    });

    const answer = completion.choices[0].message?.content?.trim();

    return (
      answer ||
      "Je n'ai pas assez d'informations pour répondre précisément à votre question. " +
        "Vous pouvez visiter notre site web www.uir.ac.ma ou contacter l'accueil au +212 5 30 10 30 00 pour plus d'aide."
    );
  } catch (error) {
    console.error("Erreur:", error);
    return "Désolé, je rencontre une difficulté technique. Pourriez-vous reformuler votre question ou réessayer plus tard ?";
  } finally {
    await db.$disconnect();
  }
};
