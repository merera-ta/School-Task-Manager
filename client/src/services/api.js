const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(message, status = 0, errors = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

async function request(path, options = {}) {
  // Ensure path starts with a single leading slash
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  let response;
  try {
    response = await fetch(`${API_URL}${cleanPath}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new ApiError(
      "Cannot reach the server. Make sure the backend is running.",
    );
  }

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    throw new ApiError(
      body?.message || `Request failed (${response.status})`,
      response.status,
      body?.errors || [],
    );
  }

  return body;
}

export const taskApi = {
  list: () => request("/tasks"),
  get: (id) => request(`/tasks/${id}`),
  create: (data) =>
    request("/tasks", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) =>
    request(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  toggle: (id) => request(`/tasks/${id}/toggle`, { method: "PATCH" }),
  remove: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};

export { API_URL };
