import OpenAI from "openai";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { KnowledgeGraphSchema } from "./schemes";
import {
  EVALUATION_PROMPT,
  EXTRACT_PROMPT,
  KNOWLEDGE_GRAPH_PROMPT,
} from "./prompts";
import { convertKnowledgeGraphToTriplets } from "./utils";

export interface ExtractionEvaluation {
  fits: boolean;
  reason: string;
}

const SUPPORTED_PROVIDERS = ["openai", "ollama", "mistral"];
const DEFAULT_PROVIDER = "openai";

// Fallback model for all LLM calls
const DEFAULT_LLM_MODEL = "gpt-4o";

export enum SupportedProviders {
  OpenAI = "openai",
  Ollama = "ollama",
  Mistral = "mistral",
}

/**
 * Extracts data from a given text based on a specified schema and knowledge graph.
 *
 * @param {string} schema - The JSON schema to validate against.
 * @param {z.infer<typeof KnowledgeGraphSchema>} graph - The knowledge graph containing triplets.
 * @param {string} apiKey - The API key for authentication.
 * @param {boolean} multipleOutputs - Flag indicating if multiple outputs are expected.
 * @returns {Promise<any>} - The extracted data that fits the schema.
 * @throws {Error} - Throws an error if the graph structure is invalid.
 */
export default async function extractToSchema(
  schema: string,
  graph: z.infer<typeof KnowledgeGraphSchema>,
  apiKey: string,
  multipleOutputs: boolean
) {
  if (!graph || !Array.isArray(graph.triplets)) {
    throw new Error(
      "Invalid knowledge graph structure: missing or invalid triplets array"
    );
  }

  const client = setupClient(
    apiKey,
    evaluateProvider(process.env.EXTRACT_PROVIDER)
  );
  const model = process.env.EXTRACT_LLM_MODEL ?? DEFAULT_LLM_MODEL;

  let schema_obj = JSON.parse(schema);

  if (multipleOutputs) {
    schema_obj = {
      type: "object",
      properties: {
        fits: {
          type: "boolean",
          description: "Whether the given text fits the schema.",
        },
        items: {
          type: "array",
          items: schema_obj,
        },
      },
      additionalProperties: false,
      required: [],
    };
  }

  const prompt = convertKnowledgeGraphToTriplets(graph);
  const chatCompletion = await client.chat.completions.create({
    messages: [
      { role: "system", content: EXTRACT_PROMPT },
      { role: "user", content: prompt },
    ],
    model: model,
    temperature: 0,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "response",
        strict: true,
        schema: schema_obj,
      },
    },
  });

  return JSON.parse(chatCompletion.choices[0].message.content ?? "");
}

/**
 * Evaluates a text against a specified schema to determine if it fits.
 *
 * @param {string} text - The text to evaluate.
 * @param {string} schema - The JSON schema to validate against.
 * @param {string} apiKey - The API key for authentication.
 * @returns {Promise<ExtractionEvaluation>} - An object indicating if the text fits the schema and the reason.
 */
export async function evaluateSchemaPrompt(
  text: string,
  schema: string,
  apiKey: string
): Promise<ExtractionEvaluation> {
  const client = setupClient(
    apiKey,
    evaluateProvider(process.env.EVAL_PROVIDER)
  );
  const model = process.env.EVAL_LLM_MODEL ?? DEFAULT_LLM_MODEL;

  const chatCompletion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: EVALUATION_PROMPT,
      },
      { role: "user", content: "Schema: \n" + schema },
      { role: "user", content: "Text: \n" + text },
    ],
    model: model,
    temperature: 0,
  });

  let message = chatCompletion.choices[0].message.content ?? "";
  function evaluateMessage(message: string) {
    const fits = /\s*<FIT>\s*/.test(message);
    const reason = fits
      ? message.replace(/\s*<FIT>\s*/, "").replace(/\s*<UNFIT>\s*/, "")
      : message.replace(/\s*<UNFIT>\s*/, "").replace(/\s*<FIT>\s*/, "");

    return { fits, reason };
  }

  let response = evaluateMessage(message);

  return response;
}

/**
 * Creates a knowledge graph based on a prompt and pre-prompt.
 *
 * @param {string} prompt - The main prompt for generating the knowledge graph.
 * @param {string} pre_prompt - Additional context for the generation.
 * @param {string} apiKey - The API key for authentication.
 * @returns {Promise<typeof KnowledgeGraphSchema>} - The generated knowledge graph.
 */
export async function createKnowledgeGraph(
  prompt: string,
  pre_prompt: string,
  apiKey: string
): Promise<typeof KnowledgeGraphSchema> {
  const client = setupClient(
    apiKey,
    evaluateProvider(process.env.KNOWLEDGE_GRAPH_PROVIDER)
  );
  const schema = zodToJsonSchema(KnowledgeGraphSchema, { target: "openAi" });
  const model = process.env.KNOWLEDGE_GRAPH_LLM_MODEL ?? DEFAULT_LLM_MODEL;

  const chatCompletion = await client.chat.completions.create({
    messages: [
      { role: "system", content: KNOWLEDGE_GRAPH_PROMPT },
      { role: "user", content: pre_prompt },
      { role: "user", content: prompt },
    ],
    model: model,
    temperature: 0,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "response",
        strict: true,
        schema: schema,
      },
    },
  });

  return JSON.parse(chatCompletion.choices[0].message.content ?? "");
}

/**
 * Sets up the OpenAI client with the provided API key.
 *
 * @param {string} apiKey - The API key for authentication.
 * @returns {OpenAI} - The configured OpenAI client.
 */
function setupClient(apiKey: string, provider: SupportedProviders) {
  if (provider !== SupportedProviders.OpenAI) {
    if (!process.env.LLM_BASE_URL) {
      throw new Error("LLM_BASE_URL is not set");
    }

    return new OpenAI({
      apiKey: "some_key",
      baseURL: process.env.LLM_BASE_URL,
    });
  }

  return new OpenAI({
    apiKey: apiKey,
  });
}

function evaluateProvider(provider: string | undefined): SupportedProviders {
  if (provider === "openai" || !provider) {
    return SupportedProviders.OpenAI;
  }

  if (
    !Object.values(SupportedProviders).includes(provider as SupportedProviders)
  ) {
    throw new Error(
      `Invalid provider: Only ${SUPPORTED_PROVIDERS.join(", ")} are supported`
    );
  }

  return provider as SupportedProviders;
}
