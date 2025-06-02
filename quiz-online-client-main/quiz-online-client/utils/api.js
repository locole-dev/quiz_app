import axios from 'axios';
    import AuthService from "../src/service/authService.js";

    const API_BASE_URL = 'http://localhost:9192/api';

    const api = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    api.interceptors.request.use(
        (config) => {
            // Do not attach token for login or register endpoints
            const isAuthEndpoint = config.url.endsWith('/login') || config.url.endsWith('/register');
            if (!isAuthEndpoint) {
                const token = AuthService.getToken();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                AuthService.logout();
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    export default api;