import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Alert,
  InputLabel,
  FormControl,
  Grid
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InventoryService from '../../../services/InventoryService';
import dayjs from 'dayjs';

const ImportInventory = () => {
  const [form, setForm] = useState({
    name: '',
    type: '',
    unit: '',
    quantity: '',
    minStockLevel: '',
    expiryDate: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (value) => {
    setForm(prev => ({ ...prev, expiryDate: value }));
  };

  const validate = () => {
    if (!form.name || !form.type || !form.unit || !form.quantity || !form.minStockLevel || !form.expiryDate) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return false;
    }
    if (isNaN(form.quantity) || Number(form.quantity) <= 0) {
      setError('Số lượng phải lớn hơn 0.');
      return false;
    }
    if (isNaN(form.minStockLevel) || Number(form.minStockLevel) < 0) {
      setError('Tồn kho tối thiểu không hợp lệ.');
      return false;
    }
    if (!dayjs(form.expiryDate).isValid() || dayjs(form.expiryDate).isBefore(dayjs(), 'day')) {
      setError('Hạn sử dụng phải là ngày trong tương lai.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        name: form.name,
        type: form.type,
        unit: form.unit,
        quantity: Number(form.quantity),
        minStockLevel: Number(form.minStockLevel),
        expiryDate: dayjs(form.expiryDate).format('YYYY-MM-DD'),
      };
      await InventoryService.createInventory(payload, config);
      setSuccess('Nhập kho thành công!');
      setForm({ name: '', type: '', unit: '', quantity: '', minStockLevel: '', expiryDate: null });
    } catch (err) {
      setError('Nhập kho thất bại. Vui lòng thử lại.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6 }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Nhập vật tư/thuốc vào kho
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Tên vật tư/thuốc"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Loại</InputLabel>
                  <Select
                    name="type"
                    value={form.type}
                    label="Loại"
                    onChange={handleChange}
                    sx={{ minWidth: 200 }}
                  >
                    <MenuItem value="medical supplies">Vật tư y tế</MenuItem>
                    <MenuItem value="medicine">Thuốc</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Đơn vị"
                  name="unit"
                  value={form.unit}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Số lượng"
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Tồn kho tối thiểu"
                  name="minStockLevel"
                  type="number"
                  value={form.minStockLevel}
                  onChange={handleChange}
                  fullWidth
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Hạn sử dụng"
                    value={form.expiryDate}
                    onChange={handleDateChange}
                    format="YYYY-MM-DD"
                    slotProps={{ textField: { fullWidth: true, required: true } }}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{ mt: 1 }}
                >
                  {loading ? 'Đang nhập...' : 'Nhập kho'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ImportInventory;
