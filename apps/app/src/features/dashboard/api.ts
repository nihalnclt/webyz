import api from "../../lib/axios";

export const getTopPages = async () => {
  const { data } = await api.get("/dashboard/top-pages");
  return data;
};

export const getTopEntries = async () => {
  const { data } = await api.get("/dashboard/top-entries");
  return data;
};

export const getTopExits = async () => {
  const { data } = await api.get("/dashboard/top-exits");
  return data;
};
