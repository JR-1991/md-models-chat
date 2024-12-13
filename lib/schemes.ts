import { z } from "zod";

/**
 * Schema representing a triplet in a knowledge graph.
 * A triplet consists of a subject, predicate, and object.
 */
const TripletSchema = z.object({
  subject: z.string().describe("The subject of the triplet."),
  predicate: z.string().describe("The predicate of the triplet."),
  object: z.string().describe("The object of the triplet."),
});

/**
 * Schema representing a knowledge graph.
 * A knowledge graph is composed of an array of triplets.
 */
const KnowledgeGraphSchema = z
  .object({
    triplets: z.array(TripletSchema).describe("The triplets of the graph."),
  })
  .describe("The knowledge graph representation of the given text.");

/**
 * Schema for evaluating the extraction of data from text.
 * It indicates whether the text fits the schema and provides a reason.
 */
const EvaluationSchema = z
  .object({
    fits: z.boolean().describe("Whether the given text fits the schema."),
    reason: z
      .string()
      .describe("The reason why the text fits or does not fit the schema."),
  })
  .describe("Extraction evaluation result");

export { KnowledgeGraphSchema, EvaluationSchema };
