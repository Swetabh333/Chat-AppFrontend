import axios from "axios";

const backendURL =  process.env.BACKEND_URL || 'http://localhost:5000/'

const axiosInstance = axios.create({
    baseURL:backendURL,
    withCredentials:true
})

export default axiosInstance;