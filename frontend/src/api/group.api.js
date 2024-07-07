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

export const createGroup = (payload) =>
  API.post("/group/createGroup", payload, getAuthHeader());
export const getGroupDetails = (payload) =>
  API.post("/group/viewGroup", payload, getAuthHeader());
export const editGroup = (payload) =>
  API.put("/group/editGroup", payload, getAuthHeader());
export const deleteGroup = (payload) =>
  API.put("group/deleteGroup", payload, getAuthHeader());

export const getUserGroups = (payload) =>
  API.post("/group/getUserGroups", payload, getAuthHeader());

export const getSettle = (payload) =>
  API.post("group/getSettlement", payload, getAuthHeader());
export const makeSettle = (payload) =>
  API.post("group/makeSettlement", payload, getAuthHeader());