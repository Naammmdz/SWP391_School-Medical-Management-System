import axios from 'axios';
const API_URL = 'http://localhost:8080/api/notifications';

const NotificationService = {
    getAllNotifications: async (config) => {
        try {
            const response = await axios.get(`${API_URL}/me`, config);
            return response.data;
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }
    },
    // tạo thông báo cho người dùng có id
    createNotification: async (id, notificationData, config) => {
        try {
            const response = await axios.post(`${API_URL}/${id}`, notificationData, config);
            return response.data;
        } catch (error) {
            console.error("Error creating notification:", error);
            throw error;
        }
    },
}
export default NotificationService;