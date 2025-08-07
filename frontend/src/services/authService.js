import axios from 'axios';
const API_URL = 'http://localhost:3000/api/user/';

const authService = {
        
    async login(username, password) {
        try {
            const response = await axios.post(`${API_URL}login`, { username, password });
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;

        } catch (error) {
                const message = error.response?.data?.message || "Login failed";
                throw new Error(message);
        }
    },

    async register(first_name, last_name, username, password) {
        try {
            const response = await axios.post(`${API_URL}register`, first_name, last_name, username, password);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Registration failed";
            throw new Error(message);
        }
    },
}

export default authService