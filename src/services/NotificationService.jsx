import axios from 'axios';
const API_URL = import.meta.env.VITE_API_NOTIFICATION;

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
    //lấy thông báo chưa đọc
    getNotificationUnread: async (config) => {
        try {
            const response = await axios.get(`${API_URL}/me-unread`, config);
            return response.data;
        } catch (error) {
            console.error("Error fetching unread notifications:", error);
            throw error;
        }
    },
    // đọc thông báo
    removeEventListener: async (id, config) => {
        try {
            const response = await axios.post(`${API_URL}/${id}/read`, {}, config);
            return response.data;
        }
        catch (error) {
            console.error("Error marking notification as read:", error);
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
    // đánh dấu tất cả thông báo là đã đọc
    markAllAsRead: async (config) => {
        try {
            const response = await axios.post(`${API_URL}/mark-all-read`, {}, config);
            return response.data;
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            throw error;
        }
    },
    //dếm số thông báo chưa đọc
    countUnreadNotifications: async (config) => {
        try {
            const response = await axios.get(`${API_URL}/unread-count`, config);
            return response.data;
        } catch (error) {
            console.error("Error counting unread notifications:", error);
            throw error;
        }
    },
}
export default NotificationService;