import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Button,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  PeopleAlt,
  Assignment,
  AdminPanelSettings,
  PersonOutline,
  Build,
  CheckCircleOutline,
  HourglassEmpty,
  OpenInNew,
  CancelOutlined,
} from '@mui/icons-material';
import StatCard from '../components/StatCard/StatCard';
import ListSection from '../components/ListSection/ListSection';

import { useNavigate } from 'react-router-dom'; // import for navigation
import { fetchUsersData, fetchCasesData, fetchCasesTypeData } from '../services/info'; // Adjust path if needed

const Dashboard = () => {
  const navigate = useNavigate(); // hook for navigation

  const [usersByRole, setUsersByRole] = useState([]); 
  const [todayCasesByStatus, setTodayCasesByStatus] = useState([]);
  const [todayCasesByType, setTodayCasesByType] = useState([]);

  // Optional: Add loading and error states for better UX
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch user data by role
        const userData = await fetchUsersData();
        setUsersByRole(userData.usersByRole);

        // Fetch today's cases data by status
        const casesData = await fetchCasesData();
        console.log(casesData.todayCasesByStatus)
        setTodayCasesByStatus(casesData.todayCasesByStatus);

        const casesTypeData = await fetchCasesTypeData();
        console.log(casesTypeData.todayCasesByType)
        setTodayCasesByType(casesTypeData.todayCasesByType);


      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error("Dashboard data loading error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Calculate total users from usersByRole
const totalUsers = usersByRole
  .map(item => item.count)
  .reduce((sum, count) => sum + count, 0);

const totalTodayCases = todayCasesByStatus
  .map(item => item.count)
  .reduce((sum, count) => sum + count, 0);
    console.log(todayCasesByStatus)
    console.log(totalTodayCases, totalUsers)

  // Prepare data for sections based on fetched data
const usersItems = usersByRole.map(role => {
  console.log(role.role)
  return {
    key: role.role,
    value: role ? role.count : 0,
  };
});

  const casesItems = todayCasesByStatus.map(items => {
    console.log(items)
  return {
    key: items.status,
    value: items ? items.count : 0,
  };
});


  const casestypeItems = todayCasesByType.map(items => {
    console.log(items)
  return {
    key: items.type,
    value: items ? items.count : 0,
  };
});


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Typography variant="h5" color="textSecondary">Loading dashboard data...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Typography variant="h5" color="error">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center p-4">
      <Container maxWidth="lg" className="w-full">
              <div className="flex justify-between mb-4">
                <Button variant="contained" onClick={() => navigate('/Home')}>Home</Button> {/* Home button added */}
              </div>
        <Paper elevation={6} className="p-8 rounded-xl shadow-2xl border border-gray-200">
          <Box className="text-center mb-8">
            <DashboardIcon className="text-purple-600 text-6xl mb-4" />
            <Typography variant="h4" component="h1" className="font-extrabold text-purple-700 mb-2" sx={{ fontFamily: 'Inter, sans-serif' }}>
              แดชบอร์ดภาพรวม
            </Typography>
            <Typography variant="body2" color="textSecondary" className="text-gray-600">
              ภาพรวมข้อมูลผู้ใช้และเคสทั้งหมดในระบบ
            </Typography>
          </Box>

          <Grid container spacing={4} className="mb-8">
            <Grid item xs={12} md={6}>
              <StatCard
                title="ผู้ใช้งานทั้งหมด"
                value={totalUsers}
                icon={PeopleAlt}
                bgColor="bg-blue-50"
                textColor="text-blue-800"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <StatCard
                title="เคสทั้งหมดในระบบ" // Clarified title
                value={totalTodayCases} 
                icon={Assignment}
                bgColor="bg-green-50"
                textColor="text-green-800"
              />
            </Grid>
          </Grid>

          <Divider className="my-8" />

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <ListSection title="ผู้ใช้งานแยกตามบทบาท" items={usersItems} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ListSection title={`เคสของวันนี้ (${totalTodayCases} รายการ)`} items={casesItems} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ListSection title={`เคสแยกตามประเภทของวันนี้`} items={casestypeItems} />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </div>
  );
};

export default Dashboard;