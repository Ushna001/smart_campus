import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Spring Boot endpoint
});

// Interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        
        // If using mock token, send the stored mock role for the DevAuthFilter
        if (token === 'MOCKED_JWT_TOKEN') {
            const user = JSON.parse(localStorage.getItem('mockUser') || '{}');
            if (user.role) {
                config.headers['X-Mock-Role'] = user.role;
            }
        }
    }
    return config;
});

export default api;
