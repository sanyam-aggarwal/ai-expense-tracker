import { apiRequest } from "../ApiService";

export const getAnalyticsSummary = () => apiRequest("/api/analytics/summary");
