import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

// Component: StatCard
const StatCard = ({ title, value, Icon, bgColor, textColor, subtitle }) => {
  return (
    <Paper
      elevation={3}
      className={`p-6 rounded-2xl shadow-lg ${bgColor} flex items-center justify-between`}
      aria-label={`${title} statistic card`}
    >
      <Box>
        <Box className="flex items-center">
          {Icon && <Icon className={`mr-2 ${textColor}`} />}
          <Typography variant="h6" className={`font-semibold ${textColor}`}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" className={`font-bold ${textColor} mt-2`}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" className={`${textColor} mt-1`}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

// Default props
StatCard.defaultProps = {
  bgColor: 'bg-white',
  textColor: 'text-black',
  subtitle: '',
};

export default StatCard;
