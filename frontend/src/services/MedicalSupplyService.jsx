import axios from 'axios';
const API_URL ='';
class MedicalSupplyService{

    getAllMedicalSupplies(){
           return axios.get(API_URL + '/medical-supplies'); 
    }
    getMedicalSupplyById(id){
        return axios.get(API_URL + '/medical-supplies/' + id);
    }
    createMedicalSupply(medicalSupply){
        return axios.post(API_URL + '/medical-supplies', medicalSupply);
    }
    updateMedicalSupply(id, medicalSupply){
        return axios.put(API_URL + '/medical-supplies/' + id, medicalSupply);
    }
    deleteMedicalSupply(id){
        return axios.delete(API_URL + '/medical-supplies/' + id);
    }
}
export default new MedicalSupplyService();
