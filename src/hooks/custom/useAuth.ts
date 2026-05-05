import { useMeQuery } from "../queries/useUser.queries";

export const useAuth = () => {
  const { data, isLoading, isError, isSuccess } = useMeQuery();
  const user = data?.data;

  return {
    user,
    isAuthenticated: !!user && !isError && isSuccess,
    isLoading,
    isError,
    isSuccess,
  };
};
