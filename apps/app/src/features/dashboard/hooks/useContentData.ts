import { useQuery } from "@tanstack/react-query";
import { getTopPages } from "../api";

export const useTopPages = (enabled: boolean) => {
  return useQuery({
    queryKey: ["getTopPages"],
    queryFn: getTopPages,
    enabled,
  });
};
