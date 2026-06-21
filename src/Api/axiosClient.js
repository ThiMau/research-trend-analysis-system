import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type":
      "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) =>
    Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
        localStorage.clear();
        sessionStorage.clear();

        const message =
          status === 401
            ? "Session expired. Please log in again."
            : "Access denied. Please log in again.";

        const params = new URLSearchParams({ message });
        // Use replace to avoid leaving protected pages in history
        window.location.replace(`/login?${params.toString()}`);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

