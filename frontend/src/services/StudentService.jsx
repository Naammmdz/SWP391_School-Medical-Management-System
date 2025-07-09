import axios from "axios";

const STUDENT_URL = import.meta.env.VITE_API_STUDENT;

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

const studentService = {
    getAllStudents: (config) => {
        const headers = getAuthHeaders();
        return axios.get(`${STUDENT_URL}`, { headers, ...config });
    },
    
    getStudentById: (studentId, config) => {
        const headers = getAuthHeaders();
        return axios.get(`${STUDENT_URL}/list/${studentId}`, { headers, ...config });
    },
    
    getStudentByParentID: (parentId, config) => {
        const headers = getAuthHeaders();
        return axios.get(`${STUDENT_URL}/${parentId}`, { headers, ...config });
    },
    
    createStudent: (data, config) => {
        const headers = getAuthHeaders();
        return axios.post(`${STUDENT_URL}/create-students`, data, { headers, ...config });
    },
    
    filterHealthRecord: (body, config) => {
        const headers = getAuthHeaders();
        return axios.post(`${STUDENT_URL}/filter`, body, { headers, ...config });
    },
    
    updateStudent: (id, data, config) => {
        const headers = getAuthHeaders();
        return axios.put(`${STUDENT_URL}/${id}`, data, { headers, ...config });
    },
    
    deleteStudent: (id, config) => {
        const headers = getAuthHeaders();
        return axios.delete(`${STUDENT_URL}/${id}`, { headers, ...config });
    },
    
    getStudentsByClassName: (className, config) => {
        const headers = getAuthHeaders();
        return axios.get(`${STUDENT_URL}/class/${encodeURIComponent(className)}`, { headers, ...config });
    },
    
    searchStudentsByName: (name, config) => {
        const headers = getAuthHeaders();
        return axios.get(`${STUDENT_URL}/search?name=${encodeURIComponent(name)}`, { headers, ...config });
    },
    
    getDistinctClassNames: (config) => {
        const headers = getAuthHeaders();
        return axios.get(`${STUDENT_URL}/classes`, { headers, ...config });
    }
};

export default studentService;
