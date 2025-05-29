import axios from 'axios';
const API_URL ='';
class HealthRecordService{
    getAllHealthRecords(){
        return axios.get(API_URL + '/health-records');
    }
    getHealthRecordById(id){
        return axios.get(API_URL + '/health-records/' + id);
    }
    createHealthRecord(healthRecord){
        return axios.post(API_URL + '/health-records', healthRecord);
    }   
    updateHealthRecord(id, healthRecord){
        return axios.put(API_URL + '/health-records/' + id, healthRecord);
    }
    deleteHealthRecord(id){
        return axios.delete(API_URL + '/health-records/' + id);
    }   
    

    
}
export default new HealthRecordService();