import { apiClient } from ".";

export const UserService = {
  me: async () => {
    const res = await apiClient.get("/users/me");
    return res.data;
  },
};
