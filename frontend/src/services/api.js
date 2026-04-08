import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Spring Boot endpoint
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    // Prevent Spring Security from dropping the request by throwing InvalidBearerToken fallback on fake signatures
    if (token && token !== 'MOCKED_JWT_TOKEN') {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
