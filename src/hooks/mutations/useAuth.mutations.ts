import { AuthService } from "@/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AuthService.login,
    onSuccess: async (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
