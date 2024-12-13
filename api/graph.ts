import createCorsHeaders from "../lib/cors";
import { createKnowledgeGraph } from "../lib/llm";
import { verifyToken } from "../lib/token";
import { getOpenAIApiKey } from "../lib/utils";

export const config = {
  runtime: "edge",
};

interface GraphRequest {
  prompt: string;
  pre_prompt: string;
  api_key?: string;
}

/**
 * Handles POST requests to generate a knowledge graph.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Response>} - A promise that resolves to a Response object.
 */
export async function POST(request: Request): Promise<Response> {
  const token = await verifyToken(request);

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  let { prompt, pre_prompt, api_key }: GraphRequest = await request.json();
  const apiKey = getOpenAIApiKey(api_key);

  try {
    const res = await createKnowledgeGraph(prompt, pre_prompt, apiKey);
    return new Response(JSON.stringify(res), {
      headers: createCorsHeaders(),
    });
  } catch (error) {
    return new Response(`Error generating response: ${error.message}`, {
      status: 500,
      headers: createCorsHeaders(),
    });
  }
}
