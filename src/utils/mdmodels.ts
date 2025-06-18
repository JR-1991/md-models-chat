import { parse_model, json_schema } from "mdmodels-core";
import fetchFromGitHub from "./github";

/**
 * Parses the given content to extract model objects.
 *
 * @param {string} content - The content to parse for model objects.
 * @returns {string[]} An array of object names extracted from the model.
 */
export default function getMdModelObjects(content: string) {
  try {
    const model = parse_model(content);
    return model.objects.map((object: { name: string }) => {
      return object.name;
    });
  } catch (error) {
    return [];
  }
}

/**
 * Checks if the content at the specified path in the given GitHub repository is a valid MD model.
 *
 * @param {string} combinedUserRepo - The combined user and repository name (e.g., "user/repo").
 * @param {string} path - The path to the file in the repository.
 * @returns {Promise<boolean>} A promise that resolves to true if the content is a valid MD model, otherwise false.
 */
export async function isMdModel(
  combinedUserRepo: string,
  path: string
): Promise<boolean> {
  const content = await fetchFromGitHub(combinedUserRepo, path);
  try {
    parse_model(content);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Generates a JSON schema from the given content and root.
 *
 * @param {string} content - The content to generate the JSON schema from.
 * @param {string} root - The root for the JSON schema generation.
 * @returns {string} The generated JSON schema as a string.
 */
export function getJSONSchema(content: string, root: string): string {
  try {
    // @ts-ignore
    const schema = json_schema(content, root, true);
    return schema;
  } catch (error) {
    alert("Error generating JSON schema: " + error);
    return "";
  }
}
