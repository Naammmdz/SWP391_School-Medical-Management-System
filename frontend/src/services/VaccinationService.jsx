import axios from "axios";
const vaccinationApiUrl = 'http://localhost:8080/api/vaccination-campaigns';

const VaccinationService = {
   createVaccinationCampaign: (data, config) => {
        return axios.post(vaccinationApiUrl, data, config);
    },
    getAllVaccinationCampaigns: (config) => {
        return axios.get(vaccinationApiUrl, config);
    },
    getVaccinationCampaignsById: (id, config) => {
        return axios.get(`${vaccinationApiUrl}/${id}`, config);
    },
    getVaccinationCampaignById: (id, config) => {
        return axios.get(`${vaccinationApiUrl}/${id}`, config);
    },
    updateVaccinationCampaign: (id, data, config) => {
        return axios.put(`${vaccinationApiUrl}/${id}`, data, config);
    }, 
    approveVaccinationCampaign: (id, data, config) => {
        return axios.put(`${vaccinationApiUrl}/${id}/approve`, data, config);
    },
     updateStatus: (id, status, config) => {
        return axios.put(`${vaccinationApiUrl}/${id}/status/${status}`, data, config);
    }, 
    deleteVaccinationCampaign: (id, config) => {
        return axios.delete(`${vaccinationApiUrl}/${id}`, config);
    }
}
export default VaccinationService;