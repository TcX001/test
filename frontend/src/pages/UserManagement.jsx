import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
} from '@mui/material';

import { getRoles, getUsers, createUser } from '../services/manage';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  // Form state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newRole, setNewRole] = useState(''); // This will now store the role ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roleData, userData] = await Promise.all([getRoles(), getUsers()]);
        console.log(userData)
        setRoles(roleData);
        setUsers(userData);
        // Set initial role to the ID of the first role, or empty if no roles
        setNewRole(roleData.length > 0 ? roleData[0].id : ''); 
      } catch (err) {
        showAlert('error', 'เกิดข้อผิดพลาดในการดึงข้อมูล');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const showAlert = (type, text) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage({ type: '', text: '' }), 3000);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUsername || !newPassword || !newFirstName || !newLastName || !newRole) {
      return showAlert('error', 'กรุณากรอกข้อมูลให้ครบถ้วน');
    }
    try {
      const created = await createUser({
        username: newUsername,
        password: newPassword,
        fname: newFirstName,
        lname: newLastName,
        role_id: newRole // Send the role ID
      });
      setUsers(prev => [...prev, created]);
      showAlert('success', `เพิ่มผู้ใช้ "${newUsername}" สำเร็จ`);
      // Clear form fields
      setNewUsername('');
      setNewPassword('');
      setNewFirstName('');
      setNewLastName('');
      setNewRole(roles.length > 0 ? roles[0].id : ''); // Reset to the ID of the first role
    } catch (err) {
      showAlert('error', 'สร้างผู้ใช้ไม่สำเร็จ');
      console.error('Error creating user:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
        <Typography variant="h5" className="text-gray-700">กำลังโหลด...</Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-4 sm:p-6 lg:p-8 font-['Inter']">
      <Container maxWidth="lg" className="space-y-6">

      <div className="flex justify-between mb-4">
        <Button variant="contained" onClick={() => navigate('/Home')}>Home</Button> {/* Home button added */}
      </div>

        {alertMessage.text && (
          <Alert severity={alertMessage.type} className="mb-4 rounded-lg shadow-md">
            {alertMessage.text}
          </Alert>
        )}
        {/* Add New User Form */}
        <Paper elevation={3} className="p-6 rounded-lg shadow-lg">
          <Typography variant="h5" component="h2" gutterBottom className="text-center mb-6 text-indigo-700 font-semibold">
            เพิ่มผู้ใช้ใหม่
          </Typography>
          <Box component="form" onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              label="ชื่อผู้ใช้"
              variant="outlined"
              fullWidth
              value={newUsername}
              onChange={e => setNewUsername(e.target.value)}
              margin="normal"
              className="rounded-md"
            />
            <TextField
              label="รหัสผ่าน"
              type="password"
              variant="outlined"
              fullWidth
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              margin="normal"
              className="rounded-md"
            />
            <TextField
              label="ชื่อจริง"
              variant="outlined"
              fullWidth
              value={newFirstName}
              onChange={e => setNewFirstName(e.target.value)}
              margin="normal"
              className="rounded-md"
            />
            <TextField
              label="นามสกุล"
              variant="outlined"
              fullWidth
              value={newLastName}
              onChange={e => setNewLastName(e.target.value)}
              margin="normal"
              className="rounded-md"
            />
            <FormControl fullWidth margin="normal" className="rounded-md">
              <InputLabel id="new-user-role-label">บทบาท</InputLabel>
              <Select
                labelId="new-user-role-label"
                value={newRole}
                label="บทบาท"
                onChange={e => setNewRole(e.target.value)}
                className="rounded-md"
              >
                {roles.map(r => (
                  <MenuItem key={r.id} value={r.id}> {/* Use r.id for value */}
                    {r.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box className="md:col-span-2 flex justify-center mt-4">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              >
                เพิ่มผู้ใช้
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Users Table */}
        <Paper elevation={3} className="p-6 rounded-lg shadow-lg mt-6">
          <Typography variant="h5" component="h2" gutterBottom className="text-center mb-6 text-indigo-700 font-semibold">
            รายชื่อผู้ใช้
          </Typography>
          <TableContainer>
            <Table aria-label="user table">
              <TableHead className="bg-indigo-50">
                <TableRow>
                  <TableCell className="font-semibold text-indigo-800 rounded-tl-lg">ID</TableCell>
                  <TableCell className="font-semibold text-indigo-800">ชื่อผู้ใช้</TableCell>
                  <TableCell className="font-semibold text-indigo-800">ชื่อจริง</TableCell>
                  <TableCell className="font-semibold text-indigo-800">นามสกุล</TableCell>
                  <TableCell className="font-semibold text-indigo-800">บทบาท</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.username}</TableCell>
                    <TableCell>{u.fname}</TableCell>
                    <TableCell>{u.lname}</TableCell>
                    <TableCell>{u.role_name}</TableCell> {/* Display role name if `u.role` contains it, or you may need to map it */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </div>
  );
};

export default UserManagement;