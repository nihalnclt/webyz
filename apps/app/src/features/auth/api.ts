import api from "../../lib/axios";
import type { LoginFormData, SignupFormData } from "./schema";

export const signupApi = async (data: SignupFormData) => {
  const res = await api.post("/users/auth/signup", data);
  return res.data;
};

export const loginApi = async (data: LoginFormData) => {
  const res = await api.post("/users/auth/login", data);
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/users/auth/me");
  return res.data;
};
