import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createWebsiteApi, getWebsitesApi } from "../api";

export const useCreateWebsite = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createWebsiteApi,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["websites"] });
    },
  });
};

export const useWebsites = () => {
  return useQuery({
    queryKey: ["getWebsitesApi"],
    queryFn: getWebsitesApi,
  });
};
