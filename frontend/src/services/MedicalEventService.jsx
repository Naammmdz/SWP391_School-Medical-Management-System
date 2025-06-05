import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Adjust this as needed

class MedicalEventService {
  // Get all medical events
  async getMedicalEvents() {
    try {
      const response = await axios.get(`${API_URL}/medical-events`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medical events:', error);
      throw error;
    }
  }

  // Get a specific medical event
  async getMedicalEventById(id) {
    try {
      const response = await axios.get(`${API_URL}/medical-events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching medical event with id ${id}:`, error);
      throw error;
    }
  }

  // Create a new medical event
  async createMedicalEvent(eventData) {
    try {
      const response = await axios.post(`${API_URL}/medical-events`, eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating medical event:', error);
      throw error;
    }
  }

  // Update a medical event
  async updateMedicalEvent(id, eventData) {
    try {
      const response = await axios.put(`${API_URL}/medical-events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error(`Error updating medical event with id ${id}:`, error);
      throw error;
    }
  }

  // Delete a medical event
  async deleteMedicalEvent(id) {
    try {
      const response = await axios.delete(`${API_URL}/medical-events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting medical event with id ${id}:`, error);
      throw error;
    }
  }

  // Filter medical events
  async filterMedicalEvents(filters) {
    try {
      // Construct query parameters
      const params = new URLSearchParams();
      
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.incidentType) params.append('incidentType', filters.incidentType);
      if (filters.fromDate) params.append('fromDate', filters.fromDate);
      if (filters.toDate) params.append('toDate', filters.toDate);
      if (filters.status) params.append('status', filters.status);
      
      const response = await axios.get(`${API_URL}/medical-events/filter`, { params });
      return response.data;
    } catch (error) {
      console.error('Error filtering medical events:', error);
      throw error;
    }
  }
}

export default new MedicalEventService(); 