import axios from 'axios';

const API_URL = 'http://localhost:8000'; 

export const fetchUsersData = async () => {
    try {
        const usersByRoleResponse = await axios.get(`${API_URL}/users/by-role/`);
        return usersByRoleResponse.data
    } catch (error) {
        console.error('Error fetching users data:', error);
        throw error; 
    }
};


export const fetchCasesData = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const todayCasesByStatusResponse = await axios.get(`${API_URL}/cases/today-by-status?date=${today}/`);
        return todayCasesByStatusResponse.data
    } catch (error) {
        console.error('Error fetching cases data:', error);
        throw error; 
    }
};

export const fetchCasesTypeData = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const todayCasesByStatusResponse = await axios.get(`${API_URL}/cases/today-by-type?date=${today}/`);
        return todayCasesByStatusResponse.data
    } catch (error) {
        console.error('Error fetching cases data:', error);
        throw error; 
    }
};
