import axios from "axios";
import history from "../history";

const BASE_URL = "https://tvanetplay.mihub.com.br:8000/v1";

const api = axios.create({
  baseURL: BASE_URL,
});

async function refreshToken(error) {
  // eslint-disable-next-line consistent-return
  const refresh_token = localStorage.getItem("@tva_refresh_token");

  const body = {
    refresh: refresh_token,
  };

  return (
    axios
      .post(`${BASE_URL}/refresh-token/`, body)
      // eslint-disable-next-line consistent-return
      .then(async (res) => {
        if (res.status === 200 || res.status === 201) {
          localStorage.setItem("@tva_token", res.data.access);
          // Fazer algo caso seja feito o refresh token
          return api(error.config);
        }
      })
      .catch(() => {
        // Fazer algo caso não seja feito o refresh token
        history.push("/login?msg=expired", { from: "expired" });
      })
  );
  // eslint-disable-next-line no-promise-executor-return
}

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
    return newConfig;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const token = localStorage.getItem("@tva_token");
    if (
      error.response &&
      error.response.config &&
      error.response.status === 401 &&
      token
    ) {
      return refreshToken(error);
      // history.push("/login?msg=expired", { from: "expired" });
    }
    throw error;
  }
);

export default api;
