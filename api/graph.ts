import createCorsHeaders from "../lib/cors";
import { createKnowledgeGraph, OpenAIFileReference } from "../lib/llm";
import { verifyToken } from "../lib/token";
import { getOpenAIApiKey } from "../lib/utils";

export const config = {
  runtime: "edge",
};

interface GraphRequest {
  prompt: string;
  pre_prompt: string;
  api_key?: string;
  file_references?: OpenAIFileReference[];
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

  try {
    let { prompt, pre_prompt, api_key, file_references }: GraphRequest = await request.json();

    if (!prompt || !pre_prompt) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: prompt and pre_prompt" }),
        { status: 400, headers: createCorsHeaders() }
      );
    }

    const apiKey = getOpenAIApiKey(api_key);
    const fileRefs = file_references || [];

    const res = await createKnowledgeGraph(
      prompt,
      pre_prompt,
      apiKey,
      fileRefs
    );

    return new Response(JSON.stringify(res), {
      headers: createCorsHeaders(),
    });
  } catch (error) {
    return new Response(`Error generating response: ${error}`, {
      status: 500,
      headers: createCorsHeaders(),
    });
  }
}
