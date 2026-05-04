import { UserService } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";

export const useMeQuery = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: UserService.me,
    retry: false,
  });
};
