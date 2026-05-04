import type { LoginDto } from "@/types/services/auth";
import { apiClient } from ".";

export const AuthService = {
  login: async (data: LoginDto) => {
    const res = await apiClient.post("/auth/login", data);
    return res.data;
  },
};
