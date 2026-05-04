import type { LoginDTO, SignupDTO } from "@/types/services/auth";
import { apiClient } from ".";

export const AuthService = {
  login: async (data: LoginDTO) => {
    const res = await apiClient.post("/auth/login", data);
    return res.data;
  },

  signup: async (data: SignupDTO) => {
    const res = await apiClient.post("/auth/signup", data);
    return res.data;
  },
};
