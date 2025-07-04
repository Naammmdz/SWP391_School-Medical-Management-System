import axios from "axios";

const STUDENT_URL = import.meta.env.VITE_API_STUDENT;


const studentService = {
    getAllStudents: (config) => {
        return axios.get(`${STUDENT_URL}`, config);
    },
    getStudentByParentID(parentId, config) {
        return axios.get(`${STUDENT_URL}/${parentId}`,config)
    },
    createStudent: (data, config) => {
        return axios.post(`${STUDENT_URL}/create-students`, data, config);
    },
     filterHealthRecord(body, config) {
        return axios.post(`${STUDENT_URL}/filter`,body, config)
    },
    updateStudent: (id, data, config) => {
        return axios.put(`${STUDENT_URL}/${id}`, data, config);
    },
    deleteStudent: (id, config) => {
        return axios.delete(`${STUDENT_URL}/${id}`, config);
    }
}
export default studentService;