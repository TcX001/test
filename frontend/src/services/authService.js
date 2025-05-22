import axios from 'axios';

const API_URL = 'http://localhost:8000'

export const login = async (username, password, rememberMe) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, {
      username,
      password,
      rememberMe,
    });
    console.log(response.data)
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'เกิดข้อผิดพลาดขณะเข้าสู่ระบบ' };
  }
};

export const forgotPassword = async (username) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password/`, {
      username,
    });
    // response.data ควรมีข้อความยืนยัน เช่น { success: true }
    return response.data;
  } catch (error) {
    // กรณีไม่พบ username หรือ error อื่นๆ
    throw error.response?.data || { message: 'ไม่สามารถส่งคำขอกู้คืนรหัสผ่านได้' };
  }
};


export const resetPassword = async (username, new_password) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password/`, {
      username,
      new_password
    });
    // response.data ควรมีข้อความยืนยัน เช่น { success: true }
    return response.data;
  } catch (error) {
    // กรณีไม่พบ username หรือ error อื่นๆ
    throw error.response?.data || { message: 'ไม่สามารถส่งคำขอกู้คืนรหัสผ่านได้' };
  }
};