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
  IconButton,
  Paper,
  Avatar,
  Snackbar,
  Alert
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Send as SendIcon,
  LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {createCase} from '../../services/caseService'; // import service

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const caseTypes = [
  'ร้องเรียน',
  'ขอความช่วยเหลือ',
  'แจ้งเหตุฉุกเฉิน',
  'เสนอแนะ',
  'อื่นๆ'
];

const NewCaseForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    caseType: '',
    caseTitle: '',
    description: '',
    location: '',
    images: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...files],
      }));
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const validateForm = () => {
    // Check required fields
    if (!formData.name || !formData.caseType || !formData.caseTitle || !formData.description || !formData.location) {
      setSnackbar({
        open: true,
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        severity: 'error'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('caseType', formData.caseType);
      data.append('caseTitle', formData.caseTitle);
      data.append('description', formData.description);
      data.append('location', formData.location);
      
      formData.images.forEach((file) => {
        data.append('images', file);
      });
      
      // Check if createCase is a function or an object with createCase method
      const submitFunc = typeof createCase === 'function' 
        ? createCase 
        : createCase.createCase;
        
      const response = await submitFunc(data);
      console.log('Success response:', response);
      
      setSnackbar({
        open: true,
        message: 'เคสของคุณถูกส่งเรียบร้อยแล้ว',
        severity: 'success'
      });
      
      // Reset form
      setFormData({
        name: '',
        caseType: '',
        caseTitle: '',
        description: '',
        location: '',
        images: [],
      });
    } catch (error) {
      console.error('Submission error:', error);
      setSnackbar({
        open: true,
        message: 'เกิดข้อผิดพลาดในการส่งข้อมูล: ' + (error.message || 'Unknown error'),
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" color="primary">
        แจ้งเคสใหม่
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="ชื่อผู้แจ้ง"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              fullWidth
              required
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel id="case-type-label">ประเภทเคส</InputLabel>
              <Select
                labelId="case-type-label"
                name="caseType"
                value={formData.caseType}
                onChange={handleFormChange}
                label="ประเภทเคส"
              >
                {caseTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="ชื่อเคส"
              name="caseTitle"
              value={formData.caseTitle}
              onChange={handleFormChange}
              fullWidth
              required
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="รายละเอียด"
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              fullWidth
              required
              multiline
              rows={4}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="สถานที่"
              name="location"
              value={formData.location}
              onChange={handleFormChange}
              fullWidth
              required
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <LocationOnIcon color="primary" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUploadIcon />}
            >
              อัปโหลดรูปภาพ
              <VisuallyHiddenInput
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>

            {formData.images.length > 0 && (
              <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                {formData.images.map((img, index) => (
                  <Avatar
                    key={index}
                    variant="rounded"
                    src={URL.createObjectURL(img)}
                    sx={{ width: 64, height: 64 }}
                    alt={`uploaded-${index}`}
                  />
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              type="submit"
              color="primary"
              size="large"
              endIcon={<SendIcon />}
              disabled={isSubmitting}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 5,
                  transform: 'translateY(-2px)',
                },
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
            >
              {isSubmitting ? 'กำลังส่ง...' : 'ส่งเคส'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default NewCaseForm;