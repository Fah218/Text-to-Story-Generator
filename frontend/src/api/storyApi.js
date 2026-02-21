import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const generateStory = (data) => {
  return API.post("/story/generate", data);
};