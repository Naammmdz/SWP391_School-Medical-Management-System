import axios from "axios";
const vaccinationApiUrl = import.meta.env.VITE_API_VACCINATION;

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
    },
    getVaccinationCampaignApproved: (config) => {
        return axios.get(`${vaccinationApiUrl}/approved`, config);
    },
    vaccinationResult: (id, data, config) => {
        return axios.post(`${vaccinationApiUrl}/result/${id}`, data, config);
    },
    getvaccinationResultByStudentId: (studentId, config) => {
        return axios.get(`${vaccinationApiUrl}/results-campaign/student/${studentId}`, config);   
    },
    parentApproveCampaign: (campaignId, studentId, config) => {
        return axios.post(
            `${vaccinationApiUrl}/${campaignId}/student/${studentId}/register`,
            null,
            config
        );
    },
    parentRejectCampaign: (campaignId, studentId, config) => {
          return axios.post(
            `${vaccinationApiUrl}/${campaignId}/student/${studentId}/reject`,
            null,
            config
        );
    },
    getAllVaccinationResults: (config) => {
        return axios.get(`${vaccinationApiUrl}/results-campaign/all`, config);
    },
    
    getVaccinationCampaignsByStudentId: (studentId, parentConfirmation, config) => {
        return axios.get(`${vaccinationApiUrl}/student/${studentId}/campaign-parentConfirmation/${parentConfirmation}`, config);
    },
    getVaccinationParentConfirmation: (campaignId, config) => {
        return axios.get(`${vaccinationApiUrl}/${campaignId}/students-registrations`, config);
    }
}
export default VaccinationService;