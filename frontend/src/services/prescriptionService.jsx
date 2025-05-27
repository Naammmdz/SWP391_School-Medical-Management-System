import axios from 'axios';

export const prescriptionService = {
  getPrescriptions: async () => {
    const response = await axios.get('/api/nurse/prescriptions');
    return response.data;
  },

  updatePrescriptionStatus: async (id, data) => {
    const response = await axios.put(`/api/nurse/prescriptions/${id}/status`, data);
    return response.data;
  },

  searchPrescriptions: async (query) => {
    const response = await axios.get('/api/nurse/prescriptions/search', { params: query });
    return response.data;
  }
}; 