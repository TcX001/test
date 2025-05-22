import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from '@mui/material';

// Component: ListSection
const ListSection = ({ title, items }) => {
  console.log(title, items)
  return (
    <Paper elevation={3} className="p-6 rounded-2xl shadow-lg">
      <Box className="flex items-center mb-4">
        <Typography variant="h5" className="font-semibold">
          {title}
        </Typography>
      </Box>

      <List>
        {items.map((item) => (
          <ListItem key={item.key} disablePadding className="mb-2">
            {item.icon && (
              <ListItemIcon>
                <item.icon className={`text-xl ${item.textColor}`} />
              </ListItemIcon>
            )}
            <ListItemText
              primary={
                <Box className="flex justify-between items-center w-full">
                  <Typography className={`font-medium ${item.textColor}`}>
                    {item.key}
                  </Typography>
                  <Typography className={`font-bold text-lg ${item.textColor}`}>
                    {item.value}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

// Default props
ListSection.defaultProps = {
  items: [],
};

export default ListSection;
