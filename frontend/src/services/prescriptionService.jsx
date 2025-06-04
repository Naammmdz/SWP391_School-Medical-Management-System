import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/prescriptions';

class PrescriptionService {
  // Lấy danh sách đơn thuốc cho y tá
  async getPrescriptions() {
    try {
      const response = await axios.get(`${API_URL}/nurse`);
      return response.data;
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    }
  }

  // Lấy danh sách đơn thuốc của học sinh cho phụ huynh
  async getStudentPrescriptions(studentId) {
    try {
      const response = await axios.get(`${API_URL}/student/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student prescriptions:', error);
      throw error;
    }
  }

  // Phụ huynh tạo đơn thuốc mới
  async createPrescription(prescriptionData) {
    try {
      const formData = new FormData();
      
      // Thêm thông tin đơn thuốc
      formData.append('studentId', prescriptionData.studentId);
      formData.append('condition', prescriptionData.condition);
      formData.append('instructions', prescriptionData.instructions);
      formData.append('startDate', prescriptionData.startDate);
      formData.append('endDate', prescriptionData.endDate);
      formData.append('additionalNotes', prescriptionData.additionalNotes);
      
      // Thêm hình ảnh đơn thuốc
      if (prescriptionData.prescriptionImg) {
        formData.append('prescriptionImg', prescriptionData.prescriptionImg);
      }

      const response = await axios.post(`${API_URL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  }

  // Y tá cập nhật trạng thái đơn thuốc
  async updatePrescriptionStatus(prescriptionId, status, nurseNote) {
    try {
      const response = await axios.put(`${API_URL}/${prescriptionId}/status`, {
        status,
        nurseNote
      });
      return response.data;
    } catch (error) {
      console.error('Error updating prescription status:', error);
      throw error;
    }
  }

  // Y tá thêm ghi chú về việc cho học sinh uống thuốc
  async addMedicationRecord(prescriptionId, recordData) {
    try {
      const response = await axios.post(`${API_URL}/${prescriptionId}/medication-record`, recordData);
      return response.data;
    } catch (error) {
      console.error('Error adding medication record:', error);
      throw error;
    }
  }
}

export default new PrescriptionService(); 