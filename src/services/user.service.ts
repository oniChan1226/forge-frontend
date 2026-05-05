import { apiClient } from ".";

export const UserService = {
  me: async () => {
    const res = await apiClient.get("/users/me", {
      headers: {
        "Cache-Control": "no-store",
        Pragma: "no-cache",
      },
      params: {
        _t: Date.now(),
      },
    });
    return res.data;
  },
};
