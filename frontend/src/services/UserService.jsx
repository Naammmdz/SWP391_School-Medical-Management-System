import axios from "axios";
const API_URL = 'http://localhost:8080/api/auth';
const USER_URL ='http://localhost:8080/api';
const userService = {
     getAllUsers: (config) => {
        return axios.get(USER_URL+ '/user', config);
    },
    getUserById: (id) => {
        return axios.get(API_URL + `/users/${id}`);
    },
    createUser: (user) => {
        return axios.post(API_URL + '/users', user);
    },
    updateUser: (id, user, config) => {
        return axios.put(USER_URL + `/user/${id}`, user, config);
    },
    deleteUser: (id) => {
        return axios.delete(API_URL + `/users/${id}`);
    },
    login: (user) => {
        return axios.post(API_URL + '/login', user);
    },
    
    
    
}
export default userService;