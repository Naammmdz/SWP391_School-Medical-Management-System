import axios from "axios";
const API_URL = 'http://localhost:8080/api/medicine-submissions';

const MedicineDeclarationService = {
 createMedicineSubmission: async (data, config) => {
  try {
    const response = await axios.post(API_URL, data, config);
    return response.data;
  } catch (error) {
    console.error("Error creating medicine submission:", error);
    throw error;
  } 

},
 getMedicineSubmissions: async (config) => {
  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error("Error fetching medicine submissions:", error);
    throw error;
  }
},
updateMedicineSubmissionStatus: async (id, data, config) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/status`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error updating medicine submission status:", error.response?.data || error);
    throw error;
  }
},


 deleteMedicineSubmission: async (id, config) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error("Error deleting medicine submission:", error);
    throw error;
  }
 },

 markMedicineTaken: async (id, data, config) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/mark-taken`, data, config);
    return response.data;
  } catch (error) {
    console.error("Error marking medicine as taken:", error.response?.data || error);
    throw error;
  }
 }

}
export default MedicineDeclarationService;