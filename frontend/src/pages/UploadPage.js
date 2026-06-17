import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  TextField,
  Alert,
  LinearProgress,
  Grid
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { uploadScan, setUploadProgress } from '../store/uploadSlice';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_API_URL || 'https://drjimmy-backend.onrender.com/api';

// Then use:
const response = await fetch(`${API_URL}/upload/`, {
  method: 'POST',
  body: formData
});

function UploadPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { loading, uploadProgress } = useSelector((state) => state.upload);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    scan_type: 'xray',
    body_part: 'spine_lumbar',
    description: '',
    taken_date: '',
    referring_doctor: '',
    hospital_name: ''
  });

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.dicom'],
      'application/dicom': ['.dcm']
    },
    maxFiles: 1,
    onDragEnter: () => {},
    onDragLeave: () => {}
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('image_file', file);
    Object.keys(formData).forEach(key => {
      uploadFormData.append(key, formData[key]);
    });

    try {
      const result = await dispatch(uploadScan(uploadFormData)).unwrap();
      toast.success('Scan uploaded successfully! Dr. Jimmy will review it soon.');
      setFile(null);
      setFormData({
        scan_type: 'xray',
        body_part: 'spine_lumbar',
        description: '',
        taken_date: '',
        referring_doctor: '',
        hospital_name: ''
      });
    } catch (error) {
      toast.error('Upload failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        {t('upload.title')}
      </Typography>
      <Typography variant="h6" align="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
        {t('upload.subtitle')}
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Dropzone */}
            <Grid item xs={12}>
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed #1976d2',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: isDragActive ? '#e3f2fd' : '#fafafa',
                  transition: 'all 0.3s'
                }}
              >
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                {file ? (
                  <Typography variant="body1">
                    Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                ) : (
                  <>
                    <Typography variant="body1" gutterBottom>
                      {t('upload.drag')}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {t('upload.or')} <Button component="span">{t('upload.browse')}</Button>
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                      Supported formats: JPEG, PNG, DICOM (MRI, CT, X-Ray)
                    </Typography>
                  </>
                )}
              </Box>
            </Grid>

            {/* Scan Type */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('upload.type')}</InputLabel>
                <Select
                  name="scan_type"
                  value={formData.scan_type}
                  onChange={handleChange}
                  label={t('upload.type')}
                >
                  <MenuItem value="xray">X-Ray</MenuItem>
                  <MenuItem value="mri">MRI</MenuItem>
                  <MenuItem value="ct">CT-Scan</MenuItem>
                  <MenuItem value="ultrasound">Ultrasound</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Body Part */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('upload.bodypart')}</InputLabel>
                <Select
                  name="body_part"
                  value={formData.body_part}
                  onChange={handleChange}
                  label={t('upload.bodypart')}
                >
                  <MenuItem value="spine_cervical">Cervical Spine (Neck)</MenuItem>
                  <MenuItem value="spine_thoracic">Thoracic Spine (Upper Back)</MenuItem>
                  <MenuItem value="spine_lumbar">Lumbar Spine (Lower Back)</MenuItem>
                  <MenuItem value="knee">Knee</MenuItem>
                  <MenuItem value="hip">Hip</MenuItem>
                  <MenuItem value="shoulder">Shoulder</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Description of Symptoms"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your pain, when it started, and any relevant medical history..."
              />
            </Grid>

            {/* Taken Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                name="taken_date"
                label="Date Scan Was Taken"
                InputLabelProps={{ shrink: true }}
                value={formData.taken_date}
                onChange={handleChange}
              />
            </Grid>

            {/* Referring Doctor */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="referring_doctor"
                label="Referring Doctor (if any)"
                value={formData.referring_doctor}
                onChange={handleChange}
              />
            </Grid>

            {/* Hospital Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="hospital_name"
                label="Hospital/Facility Name"
                value={formData.hospital_name}
                onChange={handleChange}
              />
            </Grid>

            {/* Progress Bar */}
            {loading && (
              <Grid item xs={12}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
                  Uploading: {uploadProgress}%
                </Typography>
              </Grid>
            )}

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || !file}
                sx={{ bgcolor: '#1976d2', py: 1.5 }}
              >
                {loading ? t('common.loading') : t('upload.submit')}
              </Button>
            </Grid>

            {/* Security Note */}
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mt: 2 }}>
                <strong>Security Note:</strong> All medical images are encrypted and only accessible by Dr. Jimmy and authorized medical staff. Your privacy is protected.
              </Alert>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default UploadPage;
