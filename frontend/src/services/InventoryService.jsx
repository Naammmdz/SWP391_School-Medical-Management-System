import axios from "axios";
const API_URL = import.meta.env.VITE_API_INVENTORY;
const InventoryService = {
  createInventory: async (inventoryData, config) => {
    try {
      const response = await axios.post(`${API_URL}/items`, inventoryData, config);
      return response.data;
    } catch (error) {
      console.error('Error creating inventory:', error);
      throw error;
    }
  },
  getInventoryList: async (config) => {
    try {
      const response = await axios.get(`${API_URL}`, config);
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory list:', error);
      throw error;
    }
  },
  updateInventory: async (id, inventoryData, config) => {
    try {
      const response = await axios.put(`${API_URL}/items/${id}`, inventoryData, config);
      return response.data;
    } catch (error) {
      console.error('Error updating inventory:', error);
      throw error;
    }
  },
}
export default InventoryService;