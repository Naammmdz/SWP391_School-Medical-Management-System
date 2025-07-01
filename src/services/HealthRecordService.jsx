import axios from 'axios';

const user = JSON.parse(localStorage.getItem('user'));
const userId = user?.userId; // hoặc user.id tùy backend trả về

const BASE_URL = 'http://localhost:8080/api/admin/5/students';


const HEALTH_ST =import.meta.env.VITE_API_HEALTHPROFILE;

class HealthRecordService {
    getHealthRecordByStudentId(studentId, config) {
        return axios.get(`${HEALTH_ST}/health-profile/${studentId}`, config);
    }
    createHealthRecord(studentId, healthRecord) {
        // Nếu backend dùng PUT cho update, POST cho tạo mới, bạn có thể tách hàm
        return axios.post(`${BASE_URL}/${studentId}/health-profile`, healthRecord);
    }
    updateHealthRecord(studentId, healthRecord,config) {
        // Nếu backend dùng PUT cho update, POST cho tạo mới, bạn có thể tách hàm
        return axios.put(`${HEALTH_ST}/${studentId}/health-profile`, healthRecord,config);
    }
    getAllHealthRecord(config) {
        return axios.get(`${HEALTH_ST}/all`, config)
    }
      filterHealthRecord(body, config) {
        return axios.post(`${HEALTH_ST}/filter`,body, config)
    }
  
   
}

export default new HealthRecordService();