import axios from 'axios';

const API_URL = import.meta.env.VITE_API_MEDICALEVENT; // Adjust this as needed
const API_S = 'http://localhost:8080/api';
const MedicalEventService = {
   
   
    createMedicalEvent: (data, config) => {
        return axios.post(API_URL , data, config);
    }, 
    getAllMedicalEvents: ( config) => {
        return axios.get(`${API_URL}`, config);
    },
    updateMedicalEvent: (eventId, data, config) => {
        return axios.put(`${API_URL}/${eventId}`, data, config);
    }, 
    getMedicalEventByStudentId: (config) => {
        return axios.get(`${API_S}/parent/medical-events/`, config);
    },
  }

export default MedicalEventService;