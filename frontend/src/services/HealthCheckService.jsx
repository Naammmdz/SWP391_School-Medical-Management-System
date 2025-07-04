import axios from 'axios';

const API_URL = import.meta.env.VITE_API_HEALTHCHECK; // <-- Sửa lại đường dẫn API cho Health Check


const HealthCheckService = {
  createHealthCheckCampaign: async (campaignData, config) => {
    try {
      const response = await axios.post(API_URL, campaignData, config); // <-- sửa lại vị trí
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo chiến dịch:', error);
      throw error;
    }
  },
  getAllHealthCheckCampaign: async (config) => {
    try {
      const response = await axios.get(API_URL, config);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      throw error;
    }
  },
  updateHealthCheckCampaign: async (id, campaignData,config) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, campaignData,config);
      return response.data;
    } catch (error) {
      console.error('Lỗi cập nhật chiến dịch:', error);
      throw error;
    }
  },
  getHealthCheckCampaignById: async (id, config) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      throw error;
    }
  },
  approveHealthCheckCampaign: async (id, config) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/approve`, {}, config);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xác nhận :', error);
      throw error;
    }
  },
  rejectHealthCheckCampaign: async (id, config) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/reject`, {}, config);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi từ chối chiến dịch:', error);
      throw error;
    }
  },
  getHealthCheckApproved: async (config) => {
    try {
      const response = await axios.get(`${API_URL}/approved`, config);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      throw error;
    }
  },
  recordHealthCheckResult: async (id, result ,config) => {
    try {
      const response = await axios.post(`${API_URL}/result/${id}`, result, config);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật sức khỏe:', error);
      throw error;
    }
  },
  getHealthCheckResult: async (id, config) => {
    try {
      const response = await axios.get(`${API_URL}/result/${id}`, config);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      throw error;
    }
  },
  getAllHealthCheckResult: async ( config) => {
    try {
      const response = await axios.get(`${API_URL}/results-campaign/all`, config);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      throw error;
    }
  },
  getResultByStudentId: async (studentId, config) => {
    try {
      const response = await axios.get(`${API_URL}/results-campaign/student/${studentId}`, config);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      throw error;
    }
  },
  updateHealthCheckResult: async (id, result, config) => {
    try {
      const response = await axios.put(`${API_URL}/${id}/update`, result, config);
      return response.data;
    } catch (error) {
      console.error('Error updating health check result:', error);
      throw error;
    }
  },
 parentConfirmHealthCheck: async (campaignId, studentId, config) => {
  try {
    // Đúng thứ tự: body là null, config là headers
    const response = await axios.post(`${API_URL}/${campaignId}/student/${studentId}/register`, null, config);
    return response.data;
  } catch (error) {
    console.error('Error confirming health check by parent:', error);
    throw error;
  }
},
  parentRejectHealthCheck: async(campaignId, studentId, config) => {
    try {
      const response = await axios.post(`${API_URL}/${campaignId}/student/${studentId}/reject`,null, config);
      return response.data;
    } catch (error) {
      console.error('Error rejecting health check by parent:', error);
      throw error;
    }
  },
  parentGetConfirmedCampaigns: async (studentId, config) => {
    try {
      const response = await axios.get(`${API_URL}/me/students/${studentId}/campaigns`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching confirmed health check campaigns by parent:', error);
      throw error;
    }
  },
  parentGetStautusCampaigns: async (studentId, parentConfirm, config) => {
    try {
      const response = await axios.get(`${API_URL}/student/${studentId}/campaign-parentConfirmation/${parentConfirm}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching health check campaigns by parent status:', error);
      throw error;
    }
  },
  getHealthCheckNurse: async (campaignId, config) => {
    try {
      const response = await axios.get(`${API_URL}/${campaignId}/students-registrations`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching health check campaigns for nurse:', error);
      throw error;
    }
  },
  filterResult : async (config) => {
    try {
      const response = await axios.get(`${API_URL}/filter-result`, config);
      return response.data;
    } catch (error) {
      console.error('Error filtering health check results:', error);
      throw error;
    }
  }
};

export default HealthCheckService;