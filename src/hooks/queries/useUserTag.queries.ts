import { UserTagService } from "@/services/user-tag.service";
import type { ApiResponse } from "@/types/common";
import type { Tag } from "@/types/services/tags";
import { useQuery } from "@tanstack/react-query";

export const useGetUserTagsQuery = () => {
  return useQuery<ApiResponse<Tag[]>>({
    queryKey: ["user-tags"],
    queryFn: UserTagService.getUserTags,
  });
};
