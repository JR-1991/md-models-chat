const KNOWLEDGE_GRAPH_PROMPT = `
**Instruction:**
Extract a detailed knowledge graph from the given text by identifying entities, their relationships, and their attributes. 
Represent these facts as triples and include both explicit and reasonably inferred information.

**Output Requirements:**
- **Entities:** Identify key concepts (people, places, things, events, etc.).
- **Relationships:** Show how entities connect or interact.
- **Attributes:** Provide entity attributes or properties as triples (e.g., "("Entity", "attribute_name", "value")").
- **Graph Representation:** List all extracted facts as triples in the format: "(Subject, Predicate, Object)".

**Guidelines:**
1. Use clear, descriptive language for relationships and attributes.
2. Only include facts that are explicitly stated or that can be reasonably inferred from the text.
3. Avoid redundancy; do not repeat the same fact.
4. For vague or uncertain relationships, use ""associated with"".
5. Infer "is_a" or classification relationships when context allows. For example, if a name is mentioned as a known historical figure, you can infer (
  "Name",
  "is_a",
  "Person"
).
6. Attributes can describe properties like profession, achievements, or characteristics of an entity.

**Example Input:**
"Marie Curie discovered radium and polonium and won two Nobel Prizes for her work in chemistry and physics."

**Example Output:**
- **Triples:**
  - ("Marie Curie", "discovered", "Radium")
  - ("Marie Curie", "discovered", "Polonium")
  - ("Marie Curie", "won", "Nobel Prize")
  - ("Nobel Prize", "associated with", "Chemistry")
  - ("Nobel Prize", "associated with", "Physics")
  - ("Marie Curie", "profession", "Scientist")
  - ("Marie Curie", "achievements", "Two Nobel Prizes")
  - ("Radium", "discovered by", "Marie Curie")
  - ("Polonium", "discovered by", "Marie Curie")
  - ("Marie Curie", "is_a", "Person")
  - ("Marie Curie", "is_a", "Scientist")

**Extract the knowledge graph from the text:**
`;

const EVALUATION_PROMPT = `
**Pre-Prompt:**

Evaluate the provided text’s suitability for LLM-based extraction. Your response must be in **markdown** with two sections: **Schema Compatibility** and **Improvement Opportunities**.

**Schema Compatibility**  
- List only critical missing fields.  
- If none, state “No issues.”  
- Do not treat inferable information as missing.

**Improvement Opportunities**  
- Suggest specific additions or changes to enhance schema alignment.  
- If none, state “No improvements needed.”
- When suggesting a field, include the description found in the schema.


**Schema Improvements**
- Provide general suggestions for adapting the schema based on the knowledge graph.
- Ensure suggestions are broad and not specific to the given text.
- Align your suggestions with the overall concept of the schema. Avoid suggesting fields that are not closely related.
- You can also suggest changes to the schema.

**Guidelines**  
- The LLM can infer data; do not be overly strict.  
- If something is stated as not existing, its not an issue.  
- This is a quality assessment, not strict validation.  
- Use *italics* for schema fields.  
- Dont comment on detail level; if a field exists, its fine.  
- No need to restate data that matches the schema.
- If you are mentioneing a missing field, include the description of the field.

Extremely important:
- If the text does not fit add <UNFIT> to the report.
- If the text fits add <FIT> to the report.
- Schema suggestions do not count as UNFIT.

Your final report should be *insightful*, *detailed* and cover both sections effectively. Return the report in markdown format, but do not use backticks or such.
`;

const EXTRACT_PROMPT = `
You are an expert at analyzing knowledge graphs and extracting structured data. Your task is to:

1. Parse the provided knowledge graph triplets
2. Map the relationships and attributes to the target schema
3. Transform the data into the exact schema format
4. Validate the output matches all schema requirements

Be systematic and thorough in your extraction. Ensure all relevant information from the knowledge graph is captured while maintaining strict schema compliance.
`;

export { KNOWLEDGE_GRAPH_PROMPT, EVALUATION_PROMPT, EXTRACT_PROMPT };
