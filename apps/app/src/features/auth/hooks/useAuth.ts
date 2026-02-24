import { useMutation, useQuery } from "@tanstack/react-query";
import { getMe, loginApi, signupApi } from "../api";

export const useSignup = () => {
  return useMutation({
    mutationFn: signupApi,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginApi,
  });
};

export const useAuth = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  return {
    user: data?.user,
    isLoading,
    isLoggedIn: !!data?.user,
    isError,
  };
};
