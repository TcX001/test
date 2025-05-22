import axios from 'axios';

const API_URL = 'http://localhost:8000';

const getCSRFToken = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'csrftoken') {
        console.log(value)

      return value;
    }
  }
  return null;
};

export const createCase = async (formData) => {
  try {
    const csrfToken = getCSRFToken();
    
    const response = await axios.post(`${API_URL}/create/cases/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'X-CSRFToken': csrfToken, // Add CSRF token to headers
      },
      withCredentials: true,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error creating case:', error);
    throw error;  
  }
};


export const fetchColumns = async () => {
  const response = await axios.get(`${API_URL}/case/columns/`);
  return response.data;
};

export const fetchCases = async (start, end) => {
  const params = {};
  if (start) params.start = start;
  if (end) params.end = end;
  const response = await axios.get(`${API_URL}/case/list/`, { params });
  return response.data;
};

export const exportSelectedColumns = async (columns, start, end) => {
  const payload = { columns };
  if (start) payload.start = start;
  if (end) payload.end = end;

  const response = await axios.post(`${API_URL}/case/export/`, payload);
  return response.data;
};