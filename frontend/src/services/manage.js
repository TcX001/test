import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/users`);
  return response.data;
};

export const getRoles = async () => {
  const response = await axios.get(`${API_URL}/roles`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/create/`, userData);
  return response.data;
};


