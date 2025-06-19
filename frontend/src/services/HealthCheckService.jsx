import axios from 'axios';

const API_URL = 'http://localhost:8080/api/healthcheck-campaigns';


const HealthCheckService = {
  createHealthCheckCampaign: async (campaignData, config) => {
    try {
      const response = await axios.post(API_URL, campaignData, config); // <-- sửa lại vị trí
      return response.data;
    } catch (error) {
      console.error('Error creating health check campaign:', error);
      throw error;
    }
  },
  getAllHealthCheckCampaign: async (config) => {
    try {
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching health check campaigns:', error);
      throw error;
    }
  },
  updateHealthCheckCampaign: async (id, campaignData,config) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, campaignData,config);
      return response.data;
    } catch (error) {
      console.error('Error updating health check campaign:', error);
      throw error;
    }
  },
  getHealthCheckCampaignById: async (id, config) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching health check campaign by ID:', error);
      throw error;
    }
  },
  approveHealthCheckCampaign: async (id, config) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/approve`, {}, config);
      return response.data;
    } catch (error) {
      console.error('Error approving health check campaign:', error);
      throw error;
    }
  },
  getHealthCheckApproved: async (config) => {
    try {
      const response = await axios.get(`${API_URL}/approved`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching approved health check campaigns:', error);
      throw error;
    }
  },
  recordHealthCheckResult: async (id, result ,config) => {
    try {
      const response = await axios.post(`${API_URL}/result/${id}`, result, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching health check result:', error);
      throw error;
    }
  },
  getHealthCheckResult: async (id, config) => {
    try {
      const response = await axios.get(`${API_URL}/result/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching health check result:', error);
      throw error;
    }
  },
  getAllHealthCheckResult: async ( config) => {
    try {
      const response = await axios.get(`${API_URL}/results-campaign/all`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching all health check results:', error);
      throw error;
    }
  },
};

export default HealthCheckService;