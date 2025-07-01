import axios from 'axios';

const API_URL = import.meta.env.VITE_API_MEDICALEVENT; // Adjust this as needed

const MedicalEventService = {
    getAllMedicalEvents: (eventId, config) => {
        return axios.get(`${API_URL}/${eventId}`, config);
    },
    updateMedicalEvent: (eventId, data, config) => {
        return axios.put(`${API_URL}/${eventId}`, data, config);
    },
   
    createMedicalEvent: (data, config) => {
        return axios.post(API_URL , data, config);
    },    
  }

export default MedicalEventService;