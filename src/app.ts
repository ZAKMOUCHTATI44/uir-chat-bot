import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PrismaClient, Prisma, Document } from "@prisma/client";
import { OpenAI } from "openai";
import { LRUCache } from "lru-cache";

import dotenv from "dotenv";
dotenv.config();

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY in environment variables");
}

// Initialize services with configuration
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY,
});

const db = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

// Configure cache for embeddings
const embeddingCache = new LRUCache<string, number[]>({
  max: 1000, // Maximum number of embeddings to cache
  ttl: 1000 * 60 * 60 // 1 hour TTL
});

// Rate limiting setup
const rateLimitCache = new LRUCache<string, number>({
  max: 500, // Max 500 users
  ttl: 1000 * 60 // 1 minute window
});

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

/**
 * Generate embedding for text with caching
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!text || text.trim() === "") {
    return null;
  }

  // Check cache first
  const cached = embeddingCache.get(text);
  if (cached) {
    return cached;
  }

  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    const embedding = response.data[0].embedding;
    embeddingCache.set(text, embedding);
    return embedding;
  } catch (error) {
    console.error("Embedding generation failed:", error);
    return null;
  }
}

/**
 * Check if query is rate limited
 */
function checkRateLimit(userId: string): boolean {
  const count = rateLimitCache.get(userId) || 0;
  if (count >= 10) { // 10 requests per minute
    return true;
  }
  rateLimitCache.set(userId, count + 1);
  return false;
}

/**
 * Expand query with related terms using OpenAI
 */
async function expandQuery(query: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Generate synonyms and related terms in French for this query, separated by spaces:"
      }, {
        role: "user",
        content: query
      }],
      temperature: 0.3,
      max_tokens: 50
    });

    return response.choices[0]?.message?.content?.trim() || query;
  } catch (error) {
    console.error("Query expansion failed:", error);
    return query;
  }
}

/**
 * Check if query is date-related
 */
function isDateRelatedQuery(query: string): boolean {
  return /date|jour|horaire|échéance|deadline|temps|quand|calendrier|programme/i.test(query);
}

/**
 * Handle date queries with chronological sorting
 */
async function handleDateQuery(results: any[]): Promise<string | null> {
  const dates = results
    .flatMap(result => {
      const text = `${result.metadata.question} ${result.metadata.answer}`;
      // Improved date pattern matching
      const dateMatches = text.match(
        /\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2} \w+ \d{4}|\d{4}-\d{2}-\d{2}|[A-Za-z]+ \d{1,2},? \d{4}/g
      );
      return dateMatches ? dateMatches.map(d => new Date(d)) : [];
    })
    .filter(date => !isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length === 0) return null;

  const formattedDates = dates.map(date => 
    date.toLocaleDateString('fr-FR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    })
  ).join('\n- ');

  return `Voici les dates pertinentes, classées par ordre chronologique :\n\n- ${formattedDates}\n\nPour plus de détails sur une date spécifique, n'hésitez pas à me demander.`;
}

/**
 * Generate fallback response when no results found
 */
async function generateFallbackResponse(query: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `Vous êtes l'assistant de l'Université Internationale de Rabat. Répondez poliment que vous ne trouvez pas d'information précise sur "${query}" et proposez des alternatives.`
      }],
      temperature: 0.5,
      max_tokens: 150
    });

    return response.choices[0]?.message?.content?.trim() || 
      `Je n'ai pas trouvé d'information précise sur "${query}". Vous pouvez visiter notre site web www.uir.ac.ma ou contacter l'accueil au +212 5 30 10 30 00.`;
  } catch (error) {
    console.error("Fallback response generation failed:", error);
    return "Désolé, je n'ai pas pu traiter votre demande. Pourriez-vous reformuler votre question ?";
  }
}

/**
 * Main function to find response for user input
 */
export const findResponse = async (userInput: string, userId?: string): Promise<string> => {
  // Validate input
  if (!userInput || userInput.trim() === "") {
    return "Pourriez-vous préciser votre question s'il vous plaît ?";
  }

  // Check rate limit
  if (userId && checkRateLimit(userId)) {
    return "Vous avez effectué trop de requêtes récemment. Veuillez patienter une minute avant de réessayer.";
  }

  try {
    const vectorStore = createVectorStore();
    
    // Enhanced query understanding with expansion
    const expandedQuery = await expandQuery(userInput);
    const searchQuery = `${userInput} ${expandedQuery}`.trim();
    
    // Perform similarity search
    const results = await vectorStore.similaritySearch(searchQuery, 3);

    // Special handling for date queries
    if (isDateRelatedQuery(userInput)) {
      const dateResponse = await handleDateQuery(results);
      if (dateResponse) return dateResponse;
    }

    // Fallback if no results found
    if (results.length === 0) {
      return await generateFallbackResponse(userInput);
    }

    // Prepare context from results
    const faqs = results
      .map(
        (result, index) =>
          `[Question similaire ${index + 1}]: ${result.metadata.question}\n` +
          `[Réponse associée]: ${result.metadata.answer}`
      )
      .join("\n\n");

    // Generate response using LLM
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
5. Pour les dates, présentez-les toujours dans l'ordre chronologique avec le format: "Lundi 15 janvier 2024"

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