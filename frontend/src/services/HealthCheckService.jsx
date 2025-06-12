import axios from 'axios';

const API_URL = 'http://localhost:8080/api/healthcheck-campaigns';

const HealthCheckService = {
  createHealthCheckCampaign: async (config, campaignData) => {
    try {
      const response = await axios.post(API_URL, config, campaignData);
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
  }

};

export default HealthCheckService;