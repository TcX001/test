import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Add as AddIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

import Sidebar from '../components/Sidebar';
import AppHeader from '../components/AppHeader/AppHeader';
import NewCaseForm from '../components/NewCaseForm/NewCaseForm';
import CaseTracking from '../components/CaseTracking/CaseTracking';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedTab, setSelectedTab] = useState(0);
  
  const collapsedWidth = 70;
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <AppHeader handleDrawerToggle={handleDrawerToggle} />
      
      <Sidebar 
        onSelectPage={setCurrentPage} 
        currentPage={currentPage}
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${collapsedWidth}px)` },
          ml: { md: `${collapsedWidth}px` },
          transition: 'width 0.3s, margin-left 0.3s',
          mt: 8,
          bgcolor: '#f5f5f5',
          minHeight: '100vh'
        }}
      >
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ 
            mb: 3, 
            bgcolor: 'white', 
            borderRadius: 1,
            boxShadow: 1,
            '& .MuiTab-root': {
              fontWeight: 'bold',
              py: 1.5
            }
          }}
        >
          <Tab label="แจ้งเคสใหม่" icon={<AddIcon />} iconPosition="start" />
        </Tabs>
        
        {selectedTab === 0 ? <NewCaseForm /> : <CaseTracking />}
      </Box>
    </Box>
  );
};

export default Home;