const API_URL = '';
const userService = {
    getAllUsers: () => {
        return axios.get(API_URL + '/users');
    },
    getUserById: (id) => {
        return axios.get(API_URL + `/users/${id}`);
    },
    createUser: (user) => {
        return axios.post(API_URL + '/users', user);
    },
    updateUser: (id, user) => {
        return axios.put(API_URL + `/users/${id}`, user);
    },
    deleteUser: (id) => {
        return axios.delete(API_URL + `/users/${id}`);
    },
    login: (user) => {
        return axios.post(API_URL + '/login', user);
    },
    
    
    
}
