import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_URL = `${API_BASE_URL}api/nurse/medical-events`;

// Set up axios defaults for authentication
axios.defaults.withCredentials = true;

const MedicalEventService = {
    getAllMedicalEvents: (config) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        return axios.get(API_URL, { headers, ...config });
    },
    
    getMedicalEventById: (eventId, config) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        return axios.get(`${API_URL}/${eventId}`, { headers, ...config });

    },
    
    searchMedicalEvents: (filters, config) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        return axios.post(`${API_URL}/search`, filters, { headers, ...config });
    },
    
    updateMedicalEvent: (eventId, data, config) => {

        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        return axios.put(`${API_URL}/${eventId}`, data, { headers, ...config });
    },
   
    createMedicalEvent: (data, config) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        // Debug logging
        console.log('=== MEDICAL EVENT SERVICE DEBUG ===');
        console.log('API_URL:', API_URL);
        console.log('Token available:', !!token);
        console.log('Headers:', headers);
        console.log('Request data:', JSON.stringify(data, null, 2));
        
        return axios.post(API_URL, data, { headers, ...config });
    },
    
    updateMedicalEventStatus: (eventId, config) => {
        const token = localStorage.getItem('token');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        return axios.put(`${API_BASE_URL}api/nurse/medical-events-status/${eventId}`, {}, { headers, ...config });
    }
};


export default MedicalEventService;
