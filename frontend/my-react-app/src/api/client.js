import { getToken, clearSession } from "./session.js";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/+$/, "");

const PUBLIC_PATHS = ["/auth/login", "/auth/register"];

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

const parseBody = async (response) => {
  const type = response.headers.get("content-type") || "";
  if (!type.includes("application/json")) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const onUnauthorized = (path) => {
  if (PUBLIC_PATHS.includes(path)) return;
  clearSession();
  if (window.location.pathname !== "/dashboard") {
    window.location.replace("/dashboard");
  }
};

const request = async (path, { method = "GET", body, auth = true, signal } = {}) => {
  const headers = {};
  const isFormData = body instanceof FormData;

  if (body !== undefined && !isFormData) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new ApiError("Cannot reach the server. Check your connection.", 0);
  }

  const payload = await parseBody(response);

  if (!response.ok) {
    if (response.status === 401) onUnauthorized(path);
    throw new ApiError(
      payload?.message || `Request failed (${response.status})`,
      response.status,
      payload?.errors
    );
  }

  return payload ?? {};
};

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  del: (path, options) => request(path, { ...options, method: "DELETE" }),
};

export default apiClient;
