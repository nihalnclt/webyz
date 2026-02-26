import { useQuery } from "@tanstack/react-query";
import { getMainGraph, getTopStats } from "../api";

export const useTopStats = () => {
  return useQuery({
    queryKey: ["getTopStats"],
    queryFn: getTopStats,
    staleTime: 1000 * 60 * 5, // 5 min cache
    refetchOnWindowFocus: false,
  });
};

export const useMainGraph = () => {
  return useQuery({
    queryKey: ["getMainGraph"],
    queryFn: getMainGraph,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
