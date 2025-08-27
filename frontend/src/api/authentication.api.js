import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_BACKEND_BASE_URL });

const getAuthHeader = () => {
  const profile = JSON.parse(localStorage.getItem("profile"));
  return {
    headers: {
      Authorization: `token ${profile ? profile.accessToken : ""}`,
    },
  };
};

export const login = (payload) => API.post("/auth/loginUser", payload);
export const register = (payload) => API.post("/auth/registerUser", payload);
export const updatePassword = (payload) =>
  API.post("/auth/updatePassword", payload, getAuthHeader());

export const getUser = (payload) =>
  API.post("/user/userProfile", payload, getAuthHeader());
export const editUser = (payload) =>
  API.put("/user/userProfile", payload, getAuthHeader());
export const getEmailList = () => API.get("/user/users", getAuthHeader());
export const deleteUser = (payload) =>
  API.delete("/user/deleteUser", { ...getAuthHeader(), data: payload });
