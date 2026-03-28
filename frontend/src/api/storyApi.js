import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
const API = axios.create({
  baseURL: `${API_URL}/api`,
});

export const generateStory = (data) => {
  return API.post("/story/generate", data);
};