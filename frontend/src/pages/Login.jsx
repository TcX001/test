import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { LoginOutlined } from '@mui/icons-material';
import Swal from 'sweetalert2';
import { login, forgotPassword, resetPassword } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1000,
  timerProgressBar: true,
  didOpen: (toast) => {
    // สั่งปรับ z-index ของ container บน element ที่เปิดขึ้น
    const container = document.querySelector('.swal2-container');
    if (container) {
      container.style.zIndex = '9999';
    }
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(username, password, rememberMe);

      Toast.fire({
        icon: 'success',
        title: `ยินดีต้อนรับ ${result.username || username}`
      });

      console.log(result)
      localStorage.setItem('fname', result.user.fname);
      localStorage.setItem('lname', result.user.lname);
      localStorage.setItem('id', result.user.id);
      localStorage.setItem('username', result.user.username);

      navigate('/home');
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: error.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      });
    }
  };

  const handleForgotPassword = async () => {
    // Step 1: Ask for username
    const { value: usernameForReset } = await Swal.fire({
      title: 'กู้คืนรหัสผ่าน',
      input: 'text',
      inputLabel: 'กรุณาใส่ชื่อผู้ใช้ของคุณ',
      inputPlaceholder: 'Username',
      showCancelButton: true,
      confirmButtonText: 'ถัดไป',
      cancelButtonText: 'ยกเลิก',
      inputValidator: (value) => {
        if (!value) {
          return 'กรุณาใส่ชื่อผู้ใช้เพื่อดำเนินการต่อ';
        }
        return null;
      }
    });
    if (!usernameForReset) return;

    try {
      // Step 2: Verify user exists
      await forgotPassword(usernameForReset);

      // Step 3: Prompt for new password + confirmation
      const { value: newPassword } = await Swal.fire({
        title: 'ตั้งรหัสผ่านใหม่',
        html:
          '<input id="swal-pass1" type="password" class="swal2-input" placeholder="รหัสผ่านใหม่">' +
          '<input id="swal-pass2" type="password" class="swal2-input" placeholder="ยืนยันรหัสผ่านใหม่">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'รีเซ็ต',
        cancelButtonText: 'ยกเลิก',
        preConfirm: () => {
          const pass1 = document.getElementById('swal-pass1').value;
          const pass2 = document.getElementById('swal-pass2').value;
          if (!pass1 || !pass2) {
            Swal.showValidationMessage('กรุณากรอกทั้งสองช่อง');
            return;
          }
          if (pass1 !== pass2) {
            Swal.showValidationMessage('รหัสผ่านทั้งสองไม่ตรงกัน');
            return;
          }
          return pass1;
        }
      });
      if (!newPassword) return;

      // Step 4: Call your reset-password API
      await resetPassword(usernameForReset, newPassword);

      Swal.fire({
        icon: 'success',
        title: 'รีเซ็ตรหัสผ่านสำเร็จ',
        text: 'คุณสามารถใช้รหัสผ่านใหม่เข้าสู่ระบบได้แล้ว'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.message || 'ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-4">
      <Container maxWidth="sm" className="flex items-center justify-center w-full">
        <Paper className="w-full max-w-md p-8 rounded-xl shadow-2xl border border-gray-200">
          <Box className="text-center mb-8">
            <LoginOutlined className="text-blue-600 text-6xl mb-4" />
            <Typography variant="h4" className="font-extrabold text-blue-700 mb-2">
              เข้าสู่ระบบ
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <TextField
              label="ชื่อผู้ใช้"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <TextField
              label="รหัสผ่าน"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Box className="flex justify-between items-center mb-6 mt-2">
              <FormControlLabel
                control={<Checkbox onChange={(e) => setRememberMe(e.target.checked)} />}
                label="จดจำฉัน"
              />
              <Button onClick={handleForgotPassword}>ลืมรหัสผ่าน?</Button>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              startIcon={<LoginOutlined />}
            >
              เข้าสู่ระบบ
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
