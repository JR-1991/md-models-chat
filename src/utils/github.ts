/**
 * Fetches the content of a file from a specified GitHub repository.
 *
 * @param {string} repoUrl - The URL of the GitHub repository in the format "username/repo".
 * @param {string} path - The path to the file within the repository.
 * @returns {Promise<string>} The content of the file as a string.
 * @throws {Error} If the repository URL is empty.
 */
export default async function fetchFromGitHub(repoUrl: string, path: string) {
  if (repoUrl.length === 0) {
    throw new Error("Repository URL is required");
  }

  const url = `https://raw.githubusercontent.com/${repoUrl}/main/${path}`;
  const response = await fetch(url);
  return response.text();
}

/**
 * Converts a GitHub URL to a user and repository name.
 *
 * @param {string} githubUrl - The GitHub URL in the format "https://github.com/username/repo.git".
 * @returns {[string, string]} A tuple containing the username and repository name.
 */
export function convertGitHubURLToUserRepo(
  githubUrl: string
): [string, string] {
  const parts = githubUrl.split("/");
  const user = parts[parts.length - 2];
  const repo = parts[parts.length - 1].replace(".git", "");

  return [user, repo];
}

/**
 * Lists all Markdown files in a specified GitHub repository.
 *
 * @param {string} combinedUserRepo - The combined user and repository name in the format "username/repo".
 * @returns {Promise<string[]>} A promise that resolves to an array of Markdown file paths.
 * @throws {Error} If the repository format is invalid or if there is an error fetching the repository data.
 */
export async function listMdFiles(combinedUserRepo: string): Promise<string[]> {
  const [username, repo] = combinedUserRepo.split("/");

  if (!username || !repo) {
    throw new Error(
      'Invalid repository format. Please use the format "username/repo".'
    );
  }

  const url = `https://api.github.com/repos/${username}/${repo}/git/trees/main?recursive=1`;
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error fetching repository data: ${data.message}`);
  }

  return data.tree
    .filter((file: { path: string }) => file.path.endsWith(".md"))
    .map((file: { path: string }) => file.path);
}
