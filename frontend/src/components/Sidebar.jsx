import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  Divider,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  PeopleAlt,
  CalendarToday,
  Settings,
  AccountCircle,
  Logout,
  Menu,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Custom animated component using framer-motion
const MotionBox = motion(Box);
const MotionDrawer = motion(Drawer);
const MotionListItem = motion(ListItem);

const Sidebar = ({ currentPage, mobileOpen, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const storedUsername = localStorage.getItem('username');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(true);

  // Reset collapse state when screen size changes
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  const drawerWidth = 240;
  const collapsedWidth = 70;

  const currentWidth = collapsed ? (isMobile ? 0 : collapsedWidth) : drawerWidth;

  const menuItems = [
    { id: 'dashboard', icon: <Dashboard />, label: 'แดชบอร์ด', path: '/Dashboard' },
    { id: 'user_management', icon: <PeopleAlt />, label: 'จัดการผู้ใช้', path: '/manage/user' },
    { id: 'calendar', icon: <CalendarToday />, label: 'ปฏิทิน', path: '/Calendar/Export' },
  ];

  const listItemVariants = {
    hidden: {
      opacity: 0,
      x: -20
    },
    visible: i => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const fabVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const fabStyle = {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: theme.zIndex.drawer + 2,
  };

  const drawerContent = (
    <MotionBox
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <MotionBox
            component={Settings}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
            sx={{
              mr: collapsed && !isMobile ? 0 : 2,
              color: 'primary.main',
              flexShrink: 0
            }}
          />

          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <MotionBox
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Typography variant="h6" noWrap fontWeight="bold">
                  IT
                </Typography>
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>

        {!isMobile && (
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              },
              transition: 'transform 0.3s ease-in-out',
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
            size="small"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        )}
      </Toolbar>

      <Divider />

      <List sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {menuItems.map((item, index) => (
          <MotionListItem
            key={item.id}
            disablePadding
            custom={index}
            variants={listItemVariants}
            initial="hidden"
            animate="visible"
          >
            <ListItemButton
              selected={currentPage === item.id}
              onClick={() => {
                navigate(item.path);
                if (isMobile) handleDrawerToggle();
              }}
              sx={{
                justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                position: 'relative',
                overflow: 'hidden',
                '&.Mui-selected': {
                  backgroundColor: 'transparent',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    backgroundColor: 'primary.main',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  },
                },
                '&:hover': {
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: collapsed && !isMobile ? 0 : 16,
                    right: collapsed && !isMobile ? 0 : 16,
                    bottom: 0,
                    height: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  }
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed && !isMobile ? 'auto' : 40,
                  color: currentPage === item.id ? 'primary.main' : 'inherit',
                }}
              >
                <MotionBox
                  component="div"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {item.icon}
                </MotionBox>
              </ListItemIcon>

              <AnimatePresence>
                {(!collapsed || isMobile) && (
                  <MotionBox
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    sx={{ overflow: 'hidden' }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: currentPage === item.id ? 'bold' : 'normal',
                        color: currentPage === item.id ? 'primary.main' : 'inherit',
                      }}
                    />
                  </MotionBox>
                )}
              </AnimatePresence>
            </ListItemButton>
          </MotionListItem>
        ))}
      </List>

      <Divider />

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{
          display: 'flex',
          flexDirection: collapsed && !isMobile ? 'column' : 'row',
          alignItems: 'center',
          mb: 2,
          overflow: 'hidden'
        }}>
          <MotionBox
            component={AccountCircle}
            whileHover={{ scale: 1.2 }}
            sx={{
              mr: collapsed && !isMobile ? 0 : 1,
              color: 'primary.main',
              fontSize: 28
            }}
          />

          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <MotionBox
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Typography variant="body2" fontWeight="medium">{storedUsername}</Typography>
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>

        <AnimatePresence>
          {(!collapsed || isMobile) ? (
            <MotionBox
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
<Button
  variant="contained"
  color="error"
  fullWidth
  startIcon={<Logout />}
  onClick={() => {
    localStorage.clear();
    navigate('/');
  }}
  sx={{
    borderRadius: 2,
    textTransform: 'none',
    boxShadow: 2,
    '&:hover': {
      boxShadow: 4,
      transform: 'translateY(-2px)'
    },
    transition: 'transform 0.2s, box-shadow 0.2s'
  }}
>
  ออกจากระบบ
</Button>

            </MotionBox>
          ) : (
            <MotionBox
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <IconButton
                color="error"
                onClick={() => alert('Logged out!')}
                sx={{
                  boxShadow: 1,
                  '&:hover': {
                    transform: 'rotate(10deg)'
                  },
                  transition: 'transform 0.2s'
                }}
              >
                <Logout />
              </IconButton>
            </MotionBox>
          )}
        </AnimatePresence>
      </Box>
    </MotionBox>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            bgcolor: 'background.paper',
            boxShadow: 8,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      {!isMobile && (
        <MotionDrawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: currentWidth,
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              bgcolor: 'background.paper',
              boxShadow: collapsed ? 1 : 3,
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawerContent}
        </MotionDrawer>
      )}
    </>
  );
};

export default Sidebar;