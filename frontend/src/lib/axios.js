import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: 'https://chat-app-production-ca1f.up.railway.app/api',
    withCredentials: true,
});
