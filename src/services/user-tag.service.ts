import { apiClient } from ".";

export const UserTagService = {
  getUserTags: async () => {
    const res = await apiClient.get("/users/tags");
    return res.data;
  },
};
