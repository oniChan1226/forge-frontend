import { AuthService } from "@/services/auth.service";
import { type ApiAxiosError, type ApiResponse } from "@/types/common";
import type { AuthResponse, LoginDTO, SignupDTO } from "@/types/services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AuthResponse>, ApiAxiosError, LoginDTO>({
    mutationFn: AuthService.login,
    onSuccess: async () => {
      toast.success("Welcome back 👋");
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useSignupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<AuthResponse>, ApiAxiosError, SignupDTO>({
    mutationFn: AuthService.signup,
    onError: (error) => {
      const code = error?.response?.data?.code || "";
      if (code === "USER_EXISTS") {
        toast.error("User already exists. Please login instead.");
      } else {
        console.error("Signup failed", error);
        toast.error("Failed to create account. Please try again.");
      }
    },
    onSuccess: async () => {
      toast.success("Account created successfully! 👋");
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, ApiAxiosError, void>({
    mutationFn: AuthService.logout,
    onSettled: async () => {
      await queryClient.cancelQueries({ queryKey: ["me"] });
      queryClient.removeQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries();
    },
    onSuccess: async () => {
      toast.success("Logged out");
    },
  });
};
