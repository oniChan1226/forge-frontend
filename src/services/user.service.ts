import { apiClient } from ".";


export const getMe = async () => {
  const res = await apiClient.get("/users/me");
  return res.data;
};