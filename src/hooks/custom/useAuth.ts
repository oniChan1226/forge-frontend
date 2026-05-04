import { useMeQuery } from "../queries/useUser.queries";

export const useAuth = () => {
  const { data, isLoading, isError, error } = useMeQuery();

  console.log("useAuth", { data, isLoading, isError, error });

  return {
    user: data,
    isAuthenticated: !!data,
    isLoading,
    isError,
  };
};
