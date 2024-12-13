import { getBaseUrl } from "./utils";

/**
 * Creates CORS headers for HTTP responses.
 *
 * @returns {Headers} - A Headers object containing CORS headers.
 */
export default function createCorsHeaders(): Headers {
  const headers = new Headers();
  headers.append("Access-Control-Allow-Origin", getBaseUrl());
  headers.append(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  headers.append("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return headers;
}
