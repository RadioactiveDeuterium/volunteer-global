import axios from "axios";

const baseURL = "http://localhost:5000/";

const app = axios.create({
  baseURL,
  withCredentials: true,
});

app.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error.response.data.err)
);

export default app;
