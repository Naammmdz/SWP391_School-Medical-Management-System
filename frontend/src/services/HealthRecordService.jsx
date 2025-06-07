import axios from 'axios';

const user = JSON.parse(localStorage.getItem('user'));
const userId = user?.userId; // hoặc user.id tùy backend trả về

const BASE_URL = 'http://localhost:8080/api/admin/5/students';
const PR_URL =`http://localhost:8080/api/parent/${userId}/students`;
const HEALTH_RE =`http://localhost:8080/api`;

class HealthRecordService {
    getHealthRecordByStudentId(studentId, config) {
        return axios.get(`${PR_URL}/${studentId}/health-profile`, config);
    }
    createHealthRecord(studentId, healthRecord) {
        // Nếu backend dùng PUT cho update, POST cho tạo mới, bạn có thể tách hàm
        return axios.post(`${BASE_URL}/${studentId}/health-profile`, healthRecord);
    }
    updateHealthRecord(studentId, healthRecord,config) {
        // Nếu backend dùng PUT cho update, POST cho tạo mới, bạn có thể tách hàm
        return axios.put(`${PR_URL}/${studentId}/health-profile`, healthRecord,config);
    }
    getAllHealthRecord(healthRecordList) {
        return axios.get(`${HEALTH_RE}/health-profile/all`, healthRecordList)
    }
}

export default new HealthRecordService();