import { API_URL } from "../../config/env";
import { authService } from "../authService";

export async function apiRequest(path, options = {}) {
  const isFormData = options.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(authService.getToken() ? { Authorization: `Bearer ${authService.getToken()}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Unable to complete request");
  return data;
}
