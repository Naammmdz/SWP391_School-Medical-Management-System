import axios from "axios";
const API_URL = import.meta.env.VITE_API_INVENTORY;

// Set up axios defaults for authentication
axios.defaults.withCredentials = true;

const InventoryService = {
  createInventory: async (inventoryData, config) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.post(`${API_URL}/items`, inventoryData, { headers, ...config });
      return response.data;
    } catch (error) {
      console.error('Error creating inventory:', error);
      throw error;
    }
  },
  getInventoryList: async (config) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.get(`${API_URL}`, { headers, ...config });
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory list:', error);
      throw error;
    }
  },
  updateInventory: async (id, inventoryData, config) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      const response = await axios.put(`${API_URL}/items/${id}`, inventoryData, { headers, ...config });
      return response.data;
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  },
}
export default InventoryService;