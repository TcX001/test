import React, { useState } from 'react';
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Box,
  InputAdornment,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

// Mock data for case list
const mockCases = [
  {
    id: 'CASE-001',
    title: 'ถนนเป็นหลุม บริเวณหน้าโรงเรียน',
    type: 'ร้องเรียน',
    status: 'กำลังดำเนินการ',
    createdAt: '12/05/2025',
    progress: 70,
    location: 'ซอยประชาสงเคราะห์ 5',
    priority: 'สูง'
  },
  {
    id: 'CASE-002',
    title: 'ขอติดตั้งไฟส่องสว่างในซอย',
    type: 'ขอความช่วยเหลือ',
    status: 'รอดำเนินการ',
    createdAt: '10/05/2025',
    progress: 10,
    location: 'ซอยสุขุมวิท 23',
    priority: 'ปานกลาง'
  },
  {
    id: 'CASE-003',
    title: 'ขยะไม่มีการจัดเก็บตามกำหนด',
    type: 'แจ้งเหตุฉุกเฉิน',
    status: 'เสร็จสิ้น',
    createdAt: '05/05/2025',
    progress: 100,
    location: 'ถนนสาทร',
    priority: 'ต่ำ'
  }
];

const CaseTracking = () => {
  // Filter state
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter cases based on status and search query
  const filteredCases = mockCases.filter(caseItem => {
    const matchesStatus = filterStatus === 'all' || caseItem.status === filterStatus;
    const matchesSearch = caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        caseItem.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });
  
  // Get appropriate icon based on status
  const getStatusIcon = (status) => {
    switch(status) {
      case 'เสร็จสิ้น':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'รอดำเนินการ':
        return <ScheduleIcon sx={{ color: 'warning.main' }} />;
      case 'กำลังดำเนินการ':
        return <HistoryIcon sx={{ color: 'info.main' }} />;
      default:
        return <InfoIcon sx={{ color: 'text.secondary' }} />;
    }
  };

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper
        elevation={3}
        sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2 }}
      >
        <TextField
          placeholder="ค้นหาเคส..."
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 'auto' } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
        
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="status-filter-label">สถานะ</InputLabel>
          <Select
            labelId="status-filter-label"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="สถานะ"
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon fontSize="small" />
              </InputAdornment>
            }
          >
            <MenuItem value="all">ทั้งหมด</MenuItem>
            <MenuItem value="รอดำเนินการ">รอดำเนินการ</MenuItem>
            <MenuItem value="กำลังดำเนินการ">กำลังดำเนินการ</MenuItem>
            <MenuItem value="เสร็จสิ้น">เสร็จสิ้น</MenuItem>
          </Select>
        </FormControl>
      </Paper>
      
      <Typography variant="h6" gutterBottom sx={{ px: 1 }}>
        เคสทั้งหมดของคุณ: {filteredCases.length} เคส
      </Typography>
      
      <Grid container spacing={3}>
        {filteredCases.map((caseItem) => (
          <Grid item xs={12} md={6} lg={4} key={caseItem.id}>
            <MotionPaper
              elevation={2}
              component={Card}
              whileHover={{ 
                y: -5,
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              sx={{ borderRadius: 2, overflow: 'visible' }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip
                    size="small"
                    label={caseItem.type}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    label={caseItem.priority}
                    color={
                      caseItem.priority === 'สูง' ? 'error' :
                      caseItem.priority === 'ปานกลาง' ? 'warning' : 'success'
                    }
                    variant="outlined"
                  />
                </Box>
                
                <Typography variant="h6" component="div" fontWeight="bold" noWrap>
                  {caseItem.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                  <LocationOnIcon fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                    {caseItem.location}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    หมายเลขเคส: {caseItem.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {caseItem.createdAt}
                  </Typography>
                </Box>
                
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      ความคืบหน้า
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {caseItem.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={caseItem.progress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 1,
                      bgcolor: 'rgba(0,0,0,0.05)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 
                          caseItem.progress === 100 ? 'success.main' :
                          caseItem.progress > 50 ? 'primary.main' : 'warning.main'
                      }
                    }}
                  />
                </Box>
              </CardContent>
              
              <Divider />
              
              <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getStatusIcon(caseItem.status)}
                  <Typography variant="body2" fontWeight="medium" sx={{ ml: 1 }}>
                    {caseItem.status}
                  </Typography>
                </Box>
                
              </CardActions>
            </MotionPaper>
          </Grid>
        ))}
        
        {filteredCases.length === 0 && (
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 5, textAlign: 'center', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
              <Typography color="text.secondary">
                ไม่พบเคสที่ค้นหา
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </MotionBox>
  );
};

export default CaseTracking;