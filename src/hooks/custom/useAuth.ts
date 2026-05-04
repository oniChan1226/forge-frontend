import { useMeQuery } from "../queries/useUser.queries";

export const useAuth = () => {
  const { data, isLoading, isError } = useMeQuery();

  return {
    user: data,
    isAuthenticated: !!data,
    isLoading,
    isError,
  };
};
