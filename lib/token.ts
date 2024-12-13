import { SignJWT, jwtVerify } from "jose";

/**
 * Generates a JWT token with a static payload containing the issuedAt timestamp.
 * The token is signed using the secret from the environment variable JWT_SECRET.
 *
 * @returns {Promise<string>} The generated JWT token.
 * @throws {Error} If the JWT_SECRET environment variable is not set.
 */
export async function generateToken(): Promise<string> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  // Static payload data
  const staticPayload = {
    issuedAt: Math.floor(Date.now() / 1000), // Current timestamp
  };

  return new SignJWT(staticPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(secret));
}

/**
 * Verifies a JWT token extracted from the request cookies.
 *
 * @param {Request} request - The request object containing the cookies.
 * @returns {Promise<boolean>} True if the token is valid, false otherwise.
 * @throws {Error} If the JWT_SECRET environment variable is not set.
 */
export async function verifyToken(request: Request): Promise<boolean> {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  try {
    await jwtVerify(
      getTokenFromCookies(request),
      new TextEncoder().encode(secret)
    );
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Extracts the JWT token from the cookies in the request headers.
 *
 * @param {Request} request - The request object containing the cookies.
 * @returns {string} The extracted JWT token.
 * @throws {Error} If the token is not found in the cookies.
 */
export function getTokenFromCookies(request: Request): string {
  const token = request.headers
    .get("cookie")
    ?.split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    throw new Error("Token not found in cookie");
  }

  return token;
}
