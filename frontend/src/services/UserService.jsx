import axios from "axios";
const API_URL = 'http://localhost:8080/api/auth';
const USER_URL ='http://localhost:8080/api';
const userService = {
     getAllUsers: (config) => {
        return axios.get(USER_URL+ '/user', config);
    },
    getUserById: (config) => {
        return axios.get(USER_URL + `/user/me`, config);
    },
    createUser: (data, config) => {
        return axios.post(API_URL + '/register', data,config);
    },
    updateUser: (id, user, config) => {
        return axios.put(USER_URL + `/user/${id}`, user, config);
    },
    deleteUser: (id, config) => {
    return axios.put(USER_URL+`/user/${id}/status`, null, config);
    },
    login: (user) => {
        return axios.post(API_URL + '/login', user);
    },
    updateUserByUser: (user, config) => {
    return axios.put(USER_URL + `/user/me`, user, config);
    },
    createStudent: (student, config) => {
    return axios.post(USER_URL+`/admin/students/create-students`, student, config);
        
    },
    changePassword: (user,config) => {
        return axios.put(USER_URL+`/user/me/change-password`, user, config);
    }
  
    
    
}
export default userService;