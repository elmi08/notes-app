import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
        'BaseUrl': import.meta.env.VITE_BACKEND_SERVER_URL
    },
})

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        console.log('Request Config:', config);
        return config;
    },
    (error) => {
        console.log('Request Config:', config);
        console.error('Error:', error);
        return Promise.reject(error);
    }
)


export default axiosInstance;
