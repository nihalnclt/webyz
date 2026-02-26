import api from "../../lib/axios";

export const getTopPages = async () => {
  const { data } = await api.get("/76721cf4-18a6-4fd5-906c-c5f604187710/top-pages?period=today");
  return data;
};

export const getTopEntries = async () => {
  const { data } = await api.get("/76721cf4-18a6-4fd5-906c-c5f604187710/top-entries?period=today");
  return data;
};

export const getTopExits = async () => {
  const { data } = await api.get("/76721cf4-18a6-4fd5-906c-c5f604187710/top-exits?period=today");
  return data;
};

export const getTopStats = async () => {
  const { data } = await api.get(`/76721cf4-18a6-4fd5-906c-c5f604187710/top-stats?period=today`);
  return data;
};

export const getMainGraph = async () => {
  const { data } = await api.get(`/76721cf4-18a6-4fd5-906c-c5f604187710/main-graph?period=today`);
  return data;
};
