import api from "../../lib/axios";
import type { AddWebsiteInput } from "./schema";

export const createWebsiteApi = async (data: AddWebsiteInput) => {
  const res = await api.post("/websites", data);
  return res.data;
};

export const getWebsitesApi = async () => {
  const res = await api.get("/websites");
  return res.data;
};
