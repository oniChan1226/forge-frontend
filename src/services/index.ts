import axios from "axios";

export const baseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const code = error.response?.data?.code;
    console.log("API error:", { response: error.response, status, code });

    // only refresh if token expired
    if (status === 401 && (code === "TOKEN_EXPIRED" || code === "ACCESS_TOKEN_MISSING") && !originalRequest._retry) {
      originalRequest._retry = true;

      await apiClient.post("/auth/refresh-token", {
        withCredentials: true,
      });

      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  },
);
