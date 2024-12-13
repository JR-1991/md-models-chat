import createCorsHeaders from "../lib/cors";

export const config = {
  runtime: "edge",
};

/**
 * Handles POST requests for login authentication.
 *
 * @param {Request} request - The incoming request object containing the secret.
 * @returns {Promise<Response>} - A response indicating whether the authentication was successful or not.
 */
export async function POST(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const suppliedSecret = url.searchParams.get("secret");
  const envSecret = process.env.SECRET;

  if (!suppliedSecret) {
    return new Response("Unauthorized", {
      status: 401,
      headers: createCorsHeaders(),
    });
  }

  if (!envSecret) {
    return new Response("Authorized", {
      status: 200,
      headers: createCorsHeaders(),
    });
  }

  if (suppliedSecret !== envSecret) {
    return new Response("Unauthorized", {
      status: 401,
      headers: createCorsHeaders(),
    });
  }

  return new Response("Authorized", {
    status: 200,
    headers: createCorsHeaders(),
  });
}
