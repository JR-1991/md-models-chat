import createCorsHeaders from "../lib/cors";
import extractToSchema from "../lib/llm";
import { verifyToken } from "../lib/token";
import { getOpenAIApiKey } from "../lib/utils";

export const config = {
  runtime: "edge",
};

interface ExtractRequest {
  text: string;
  schema: string;
  api_key?: string;
  multiple_outputs: boolean;
  system_prompt?: string;
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
    let { text, schema, api_key, multiple_outputs, system_prompt }: ExtractRequest = await request.json();

    // Validate the graph structure
    if (!text || !schema) {
      return new Response(
        JSON.stringify({ error: "Invalid knowledge graph structure" }),
        { status: 400, headers: createCorsHeaders() }
      );
    }

    const apiKey = getOpenAIApiKey(api_key);

    if (!system_prompt) {
      system_prompt = "";
    }

    const res = await extractToSchema(
      schema,
      text,
      apiKey,
      multiple_outputs,
      system_prompt
    );

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
