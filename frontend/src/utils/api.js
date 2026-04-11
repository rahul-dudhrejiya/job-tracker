import axios from 'axios';

// Create axios instance with base URL
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
})


//       Interceptor 
// Runs BEFORE every request automatically
// Attaches token to every request header
API.interceptors.request.use((config) => {

    // Get token from localStorage
    const token = localStorage.getItem('token')

    // If token exists → add to headers
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

export default API;