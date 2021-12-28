import axios from "axios";

const BASE_URL = "http://tv-netplay-api.herokuapp.com/v1";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
