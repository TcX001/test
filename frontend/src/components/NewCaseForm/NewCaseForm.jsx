import React, { useState, useEffect } from 'react';
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
import { createCase, getCaseTypes } from '../../services/caseService';

const VisuallyHiddenInput = styled('input')({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: '#f9f9f9',
}));

const NewCaseForm = () => {
  const [formData, setFormData] = useState({ caseType: '', caseTitle: '', description: '', location: '', images: [] });
  const [caseTypes, setCaseTypes] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    (async () => {
      try {
        const types = await getCaseTypes();
        setCaseTypes(types);
      } catch {
        setSnackbar({ open: true, message: 'โหลดประเภทเคสไม่สำเร็จ', severity: 'error' });
      }
    })();
  }, []);

  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...Array.from(e.target.files)] }));
    }
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  const validateForm = () => {
    if (!formData.caseType || !formData.caseTitle || !formData.description || !formData.location) {
      setSnackbar({ open: true, message: 'กรุณากรอกข้อมูลให้ครบถ้วน', severity: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

try {
  const data = new FormData();

  // ดึง id จาก localStorage สมมติชื่อ key เป็น 'userId'
  const userId = localStorage.getItem('id');
  if (userId) {
    data.append('userId', userId);
  }

  Object.entries(formData).forEach(([key, val]) => {
    if (key === 'images') {
      val.forEach(file => data.append('images', file));
    } else {
      data.append(key, val);
    }
  });

  await createCase(data);
  setSnackbar({ open: true, message: 'เคสของคุณถูกส่งเรียบร้อยแล้ว', severity: 'success' });
  setFormData({ caseType: '', caseTitle: '', description: '', location: '', images: [] });
} catch (error) {
  setSnackbar({ open: true, message: `เกิดข้อผิดพลาด: ${error.message}`, severity: 'error' });
} finally {
  setIsSubmitting(false);
}
  };

  return (
    <StyledPaper elevation={0}>
      <Typography variant="h4" gutterBottom color="primary">
        แจ้งเคสใหม่
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center" wrap="wrap">
          <Grid item xs="auto">
            <FormControl sx={{ minWidth: 160 }} required>
              <InputLabel id="case-type-label">ประเภทเคส</InputLabel>
              <Select labelId="case-type-label" name="caseType" value={formData.caseType} onChange={handleFormChange} label="ประเภทเคส">
                {caseTypes.map(type => (
                  <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={3}>
            <TextField fullWidth required label="ชื่อเคส" name="caseTitle" value={formData.caseTitle} onChange={handleFormChange} />
          </Grid>

          <Grid item xs={4}>
            <TextField fullWidth required multiline rows={3} label="รายละเอียด" name="description" value={formData.description} onChange={handleFormChange} />
          </Grid>

          <Grid item xs={3}>
            <TextField
              fullWidth
              required
              label="สถานที่"
              name="location"
              value={formData.location}
              onChange={handleFormChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <LocationOnIcon color="primary" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs="auto">
            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} sx={{ textTransform: 'none' }}>
              อัปโหลดรูปภาพ
              <VisuallyHiddenInput type="file" multiple accept="image/*" onChange={handleFileChange} />
            </Button>
          </Grid>

          <Grid item xs={12}>
            {formData.images.length > 0 && (
              <Box display="flex" gap={1} flexWrap="wrap">
                {formData.images.map((img, i) => (
                  <Avatar key={i} variant="rounded" src={URL.createObjectURL(img)} sx={{ width: 72, height: 72 }} />
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} textAlign="right">
            <Button
              type="submit"
              variant="contained"
              endIcon={<SendIcon />}
              size="large"
              sx={{ px: 4, py: 1.5, borderRadius: 3, boxShadow: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'กำลังส่ง...' : 'ส่งเคส'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </StyledPaper>
  );
};

export default NewCaseForm;