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
    cancelVaccinationCampaign: (id, config) => {
        return axios.put(`${vaccinationApiUrl}/${id}/cancel`, null, config);

    },
    updateStatus: (id, status, config) => {
        return axios.put(`${vaccinationApiUrl}/${id}/status/${status}`, null, config);
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
    },
    getVaccinationParentConfirmed: (config) => {
        return axios.get(`${vaccinationApiUrl}/results-campaign/parent-confirmation-true`, config);
    },
    filterResult : (config) => {
        return axios.get(`${vaccinationApiUrl}/filter-result`, config);
    },
    updateVaccinationResult: (VaccinCheckId, data, config) => {
        return axios.put(`${vaccinationApiUrl}/${VaccinCheckId}/update`, data, config);
    },
    
    // Get all students that can participate in a campaign (based on target group)
    getAllStudentsInCampaign: (campaignId, config) => {
        return axios.get(`${vaccinationApiUrl}/${campaignId}/all-students`, config);
    },
    
    // Get all students with their vaccination status in a campaign
    getStudentsWithVaccinationStatus: (campaignId, config) => {
        return axios.get(`${vaccinationApiUrl}/${campaignId}/students-with-status`, config);
    },
    
}
export default VaccinationService;
