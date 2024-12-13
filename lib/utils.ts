import { KnowledgeGraphSchema } from "./schemes";
import { z } from "zod";

/**
 * Retrieves the OpenAI API key.
 *
 * This function checks if a user-provided API key is available. If it is,
 * the function returns that key. If not, it attempts to retrieve the API
 * key from the environment variables. If the API key is not set in the
 * environment, an error is thrown.
 *
 * @param userApiKey - An optional user-provided API key.
 * @returns The OpenAI API key.
 * @throws Error if the API key is not set in the environment variables.
 */
export function getOpenAIApiKey(userApiKey?: string): string {
  if (userApiKey && userApiKey.length > 0) {
    return userApiKey;
  }
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in the environment variables.");
  }
  return apiKey;
}

/**
 * Converts a knowledge graph into a string representation of triplets.
 *
 * This function takes a knowledge graph that conforms to the
 * KnowledgeGraphSchema and converts it into a string format where each
 * triplet is represented as "subject predicate object".
 *
 * @param knowledgeGraph - The knowledge graph to convert.
 * @returns A string representation of the knowledge graph triplets.
 */
export function convertKnowledgeGraphToTriplets(
  knowledgeGraph: z.infer<typeof KnowledgeGraphSchema>
): string {
  return (
    "Knowledge Graph representation:\n" +
    knowledgeGraph.triplets
      .map(
        (triplet) => `${triplet.subject} ${triplet.predicate} ${triplet.object}`
      )
      .join("\n")
  );
}

/**
 * Retrieves the base URL for the application.
 *
 * This function checks for the Vercel URL in the environment variables.
 * If it is not set, it checks for an allowed origin. If neither is
 * available, it defaults to "http://localhost:3000".
 *
 * @returns The base URL for the application.
 */
export function getBaseUrl(): string {
  console.log("Importing env", process.env);
  return (
    process.env.VERCEL_URL ??
    process.env.ALLOWED_ORIGIN ??
    "http://localhost:3000"
  );
}
