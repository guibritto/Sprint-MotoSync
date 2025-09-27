import axios, { AxiosInstance } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // adicione este import

const api: AxiosInstance = axios.create({
  baseURL: "https://motosync.onrender.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para incluir token JWT
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;