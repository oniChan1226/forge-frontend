import { AuthService } from "@/services/auth.service";
import { type ApiError, type ApiResponse } from "@/types/common";
import type { AuthResponse, LoginDTO, SignupDTO } from "@/types/services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AuthResponse>, ApiError, LoginDTO>({
    mutationFn: AuthService.login,
    onSuccess: async (data) => {
      const token = data?.data?.token;
      localStorage.setItem("accessToken", token?.accessToken || "");
      localStorage.setItem("refreshToken", token?.refreshToken || "");
      toast.success("Welcome back 👋");
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useSignupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AuthResponse>, ApiError, SignupDTO>({
    mutationFn: AuthService.signup,
    onSuccess: async (data) => {
      const token = data?.data?.token;
      localStorage.setItem("accessToken", token?.accessToken || "");
      localStorage.setItem("refreshToken", token?.refreshToken || "");
      toast.success("Account created successfully! 👋");
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
