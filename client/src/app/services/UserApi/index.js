import { apiRequest } from "../ApiService";

export const getCurrentUser = () => apiRequest("/api/auth/me");
export const updateProfile = (profile) =>
  apiRequest("/api/auth/profile", { method: "PATCH", body: JSON.stringify(profile) });
export const uploadAvatar = (file) => {
  const body = new FormData();
  body.append("avatar", file);
  return apiRequest("/api/auth/profile/avatar", { method: "POST", body });
};
