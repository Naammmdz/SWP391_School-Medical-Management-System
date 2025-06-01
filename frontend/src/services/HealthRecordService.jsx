import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api/admin/5/students';
const PR_URL ='http://localhost:8080/api/parent/9/students';

class HealthRecordService {
    getHealthRecordByStudentId(studentId) {
        return axios.get(`${PR_URL}/${studentId}/health-profile`);
    }
    createHealthRecord(studentId, healthRecord) {
        // Nếu backend dùng PUT cho update, POST cho tạo mới, bạn có thể tách hàm
        return axios.post(`${BASE_URL}/${studentId}/health-profile`, healthRecord);
    }
    updateHealthRecord(studentId, healthRecord) {
        // Nếu backend dùng PUT cho update, POST cho tạo mới, bạn có thể tách hàm
        return axios.put(`${PR_URL}/${studentId}/health-profile`, healthRecord);
    }
    
}

export default new HealthRecordService();