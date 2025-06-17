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
}
}
export default MedicineDeclarationService;