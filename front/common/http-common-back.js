import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081/api/v1",

});

// Interceptador para adicionar o token de autorização a cada solicitação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Substitua por onde você armazena o token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if(!config.headers["Content-Type"]){
  config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default api;