import React from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion.div;

const AppHeader = ({ handleDrawerToggle, title = "ระบบแจ้งเคสและติดตามสถานะ" }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const collapsedWidth = 70;

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${isMobile ? 0 : collapsedWidth}px)` },
        ml: { md: `${isMobile ? 0 : collapsedWidth}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 2,
        transition: 'width 0.3s, margin-left 0.3s',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <MotionBox
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ flexGrow: 1 }}
        >
          <Typography variant="h6" noWrap component="div" fontWeight="bold">
            {title}
          </Typography>
        </MotionBox>
        
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;