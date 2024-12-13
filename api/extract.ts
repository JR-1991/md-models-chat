import createCorsHeaders from "../lib/cors";
import extractToSchema from "../lib/llm";
import { KnowledgeGraphSchema } from "../lib/schemes";
import { verifyToken } from "../lib/token";
import { getOpenAIApiKey } from "../lib/utils";
import { z } from "zod";

export const config = {
  runtime: "edge",
};

interface ExtractRequest {
  graph: z.infer<typeof KnowledgeGraphSchema>;
  schema: string;
  api_key?: string;
  multiple_outputs: boolean;
}

/**
 * Handles POST requests to extract data to a specified schema.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Response>} - A response containing the extraction result or an error message.
 */
export async function POST(request: Request): Promise<Response> {
  const token = await verifyToken(request);

  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    let { graph, schema, api_key, multiple_outputs }: ExtractRequest =
      await request.json();

    // Validate the graph structure
    if (!graph || !Array.isArray(graph.triplets)) {
      return new Response(
        JSON.stringify({ error: "Invalid knowledge graph structure" }),
        { status: 400, headers: createCorsHeaders() }
      );
    }

    const apiKey = getOpenAIApiKey(api_key);

    const res = await extractToSchema(schema, graph, apiKey, multiple_outputs);

    if (res.error) {
      return new Response(JSON.stringify(res), {
        status: 400,
        headers: createCorsHeaders(),
      });
    }

    return new Response(JSON.stringify(res), {
      headers: createCorsHeaders(),
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Extraction failed: ${error.message}` }),
      { status: 500, headers: createCorsHeaders() }
    );
  }
}
