import axios from 'axios';
const API_URL = 'http://localhost:3000/api/events/';

const eventService = {

    async getAll(name, tag, startDate) {
        try {
            const params = {};
            if (name) params.name = name;
            if (tag) params.tag = tag;
            if (startDate) params.startDate = startDate;

            const response = await axios.get(API_URL, { params });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "Failed to fetch events";
            throw new Error(message);
        }
    },

    async getById(id){
        try {
            const response = await axios.get(`${API_URL}${id}`)
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || "Failed to fetch events";
            throw new Error(message);
        }
    },

    async enrollInEvent(idEvent){
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const token = storedUser?.token;
            const response = await axios.post(
                `${API_URL}${idEvent}/enrollment`,
                {
                  description: "te inscribiste anashei",
                  attended: 0,
                  observations: "dale q te ganas un beca",
                  rating: 4,
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || "No se pudo inscribir";
            throw new Error(message);
        }
    }
};

export default eventService;