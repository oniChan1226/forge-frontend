import { UserService } from "@/services/user.service";
import type { ApiResponse } from "@/types/common";
import type { User } from "@/types/services/user";
import { useQuery } from "@tanstack/react-query";

export const useMeQuery = () => {
  return useQuery<ApiResponse<User>>({
    queryKey: ["me"],
    queryFn: UserService.me,
    retry: false,
    staleTime: Infinity,
  });
};
