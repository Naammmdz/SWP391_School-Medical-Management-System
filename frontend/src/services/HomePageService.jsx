import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Adjust this as needed

class HomePageService {
  // Get all health resources
  async getHealthResources() {
    try {
      const response = await axios.get(`${API_URL}/health-resources`);
      return response.data;
    } catch (error) {
      console.error('Error fetching health resources:', error);
      throw error;
    }
  }

  // Get a specific health resource
  async getHealthResourceById(id) {
    try {
      const response = await axios.get(`${API_URL}/health-resources/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching health resource with id ${id}:`, error);
      throw error;
    }
  }

  // Get all blog posts
  async getBlogPosts() {
    try {
      const response = await axios.get(`${API_URL}/blog-posts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  }

  // Get a specific blog post
  async getBlogPostById(id) {
    try {
      const response = await axios.get(`${API_URL}/blog-posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching blog post with id ${id}:`, error);
      throw error;
    }
  }

  // Get school information
  async getSchoolInfo() {
    try {
      const response = await axios.get(`${API_URL}/school-info`);
      return response.data;
    } catch (error) {
      console.error('Error fetching school information:', error);
      throw error;
    }
  }

  // Filter health resources
  async filterHealthResources(filters) {
    try {
      const params = new URLSearchParams();
      
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.type) params.append('type', filters.type);
      if (filters.fromDate) params.append('fromDate', filters.fromDate);
      if (filters.toDate) params.append('toDate', filters.toDate);
      
      const response = await axios.get(`${API_URL}/health-resources/filter`, { params });
      return response.data;
    } catch (error) {
      console.error('Error filtering health resources:', error);
      throw error;
    }
  }

  // Filter blog posts
  async filterBlogPosts(filters) {
    try {
      const params = new URLSearchParams();
      
      if (filters.searchTerm) params.append('searchTerm', filters.searchTerm);
      if (filters.author) params.append('author', filters.author);
      if (filters.fromDate) params.append('fromDate', filters.fromDate);
      if (filters.toDate) params.append('toDate', filters.toDate);
      
      const response = await axios.get(`${API_URL}/blog-posts/filter`, { params });
      return response.data;
    } catch (error) {
      console.error('Error filtering blog posts:', error);
      throw error;
    }
  }

  // Send contact message
  async sendContactMessage(messageData) {
    try {
      const response = await axios.post(`${API_URL}/contact`, messageData);
      return response.data;
    } catch (error) {
      console.error('Error sending contact message:', error);
      throw error;
    }
  }
}

export default new HomePageService(); 