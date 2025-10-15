import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authReducer";
import { API_URL } from "../apiConfig.ts";

export const axiosAuthInstance = axios.create({
    baseURL: `${API_URL}/api`,
    withCredentials: true,
});

// Request interceptor → attach access token
axiosAuthInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken || sessionStorage.getItem("accessToken");
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor → handle 401
axiosAuthInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // If token is invalid/expired → force logout
      store.dispatch(logout());
    }
    return Promise.reject(error);
  }
);