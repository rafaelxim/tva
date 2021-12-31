import axios from "axios";
import history from "../history";

const BASE_URL = "http://tv-netplay-api.herokuapp.com/v1";

const api = axios.create({
  baseURL: BASE_URL,
});

// Seta o cabeçalho para todas as chamadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@tva_token");
  let newConfig;
  if (token) {
    newConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  return newConfig;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response &&
      error.response.config &&
      error.response.status === 401
    ) {
      history.push("/login");
    }
    throw error;
  }
);

export default api;
