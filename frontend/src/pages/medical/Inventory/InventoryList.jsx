import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  CircularProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import InventoryService from '../../../services/InventoryService';
import dayjs from 'dayjs';

const typeOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'medical supplies', label: 'Vật tư y tế' },
  { value: 'medicine', label: 'Thuốc' },
];

const InventoryList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ name: '', type: '' });
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  // Status helper functions
  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Hoạt động';
      case 'INACTIVE': return 'Không hoạt động';
      case 'EXPIRED': return 'Hết hạn';
      case 'DAMAGED': return 'Hư hỏng';
      default: return status || 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'INACTIVE': return 'default';
      case 'EXPIRED': return 'error';
      case 'DAMAGED': return 'warning';
      default: return 'default';
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await InventoryService.getInventoryList(config);
      setData(Array.isArray(res) ? res : []);
    } catch (err) {
      setData([]);
    }
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  // Lọc dữ liệu theo filter
  const filteredData = data.filter(item => {
    const matchName = item.name.toLowerCase().includes(filter.name.toLowerCase());
    const matchType = filter.type ? (item.type === filter.type) : true;
    return matchName && matchType;
  });

  const formatDate = (arr) => {
    if (!arr || !Array.isArray(arr) || arr.length !== 3) return '';
    const [y, m, d] = arr;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  };

  const formatDateTime = (str) => {
    if (!str) return '';
    const d = new Date(str);
    return d.toLocaleDateString('vi-VN');
  };

  // ====== Edit Dialog Logic ======
  const handleEditOpen = (item) => {
    setEditItem(item);
    setEditForm({
      name: item.name,
      type: item.type,
      unit: item.unit,
      quantity: item.quantity,
      minStockLevel: item.minStockLevel || '',
      expiryDate: item.expiryDate ? dayjs(`${item.expiryDate[0]}-${item.expiryDate[1]}-${item.expiryDate[2]}`) : null,
      batchNumber: item.batchNumber || '',
      manufacturer: item.manufacturer || '',
      importDate: item.importDate ? dayjs(`${item.importDate[0]}-${item.importDate[1]}-${item.importDate[2]}`) : null,
      importPrice: item.importPrice || '',
      storageLocation: item.storageLocation || '',
      status: item.status || 'ACTIVE',
      source: item.source || '',
    });
    setEditError('');
    setEditSuccess('');
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditItem(null);
    setEditError('');
    setEditSuccess('');
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditDateChange = (value) => {
    setEditForm(prev => ({ ...prev, expiryDate: value }));
  };

  const handleEditImportDateChange = (value) => {
    setEditForm(prev => ({ ...prev, importDate: value }));
  };

  const validateEdit = () => {
    if (!editForm.name || !editForm.type || !editForm.unit || !editForm.quantity || !editForm.expiryDate || !editForm.batchNumber || !editForm.manufacturer || !editForm.importPrice || !editForm.storageLocation || !editForm.source) {
      setEditError('Vui lòng nhập đầy đủ thông tin.');
      return false;
    }
    if (isNaN(editForm.quantity) || Number(editForm.quantity) <= 0) {
      setEditError('Số lượng phải lớn hơn 0.');
      return false;
    }
    if (editForm.minStockLevel !== '' && (isNaN(editForm.minStockLevel) || Number(editForm.minStockLevel) < 0)) {
      setEditError('Tồn kho tối thiểu không hợp lệ.');
      return false;
    }
    if (isNaN(editForm.importPrice) || Number(editForm.importPrice) <= 0) {
      setEditError('Giá nhập phải lớn hơn 0.');
      return false;
    }
    if (!dayjs(editForm.expiryDate).isValid() || dayjs(editForm.expiryDate).isBefore(dayjs(), 'day')) {
      setEditError('Hạn sử dụng phải là ngày trong tương lai.');
      return false;
    }
    if (!dayjs(editForm.importDate).isValid()) {
      setEditError('Ngày nhập không hợp lệ.');
      return false;
    }
    // Validate expiry date vs status combination
    if (editForm.expiryDate && editForm.status === 'EXPIRED') {
      const today = dayjs();
      const expiryDate = dayjs(editForm.expiryDate);
      if (expiryDate.isAfter(today, 'day')) {
        setEditError('Không thể đặt trạng thái là "Hết hạn" khi hạn sử dụng còn trong tương lai.');
        return false;
      }
    }
    setEditError('');
    return true;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditSuccess('');
    if (!validateEdit()) return;
    setEditLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = {
        name: editForm.name,
        type: editForm.type,
        unit: editForm.unit,
        quantity: Number(editForm.quantity),
        minStockLevel: editForm.minStockLevel === '' ? undefined : Number(editForm.minStockLevel),
        expiryDate: dayjs(editForm.expiryDate).format('YYYY-MM-DD'),
        batchNumber: editForm.batchNumber,
        manufacturer: editForm.manufacturer,
        importDate: dayjs(editForm.importDate).format('YYYY-MM-DD'),
        importPrice: Number(editForm.importPrice),
        storageLocation: editForm.storageLocation,
        status: editForm.status,
        source: editForm.source,
      };
      await InventoryService.updateInventory(editItem.itemId, payload, config);
      setEditSuccess('Cập nhật thành công!');
      await fetchData();
      setTimeout(() => {
        handleEditClose();
      }, 1000);
    } catch (err) {
      setEditError('Cập nhật thất bại. Vui lòng thử lại.');
    }
    setEditLoading(false);
  };

  return (
      <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, mb: 4 }}>
        <Card elevation={3} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Danh sách vật tư/thuốc trong kho
            </Typography>
            <Grid container spacing={2} sx={{ mb: 1 }}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                    label="Tìm theo tên"
                    name="name"
                    value={filter.name}
                    onChange={handleFilterChange}
                    fullWidth
                    size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Loại</InputLabel>
                  <Select
                      label="Loại"
                      name="type"
                      value={filter.type}
                      onChange={handleFilterChange}
                  >
                    {typeOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
        <Paper elevation={2}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tên</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Số lô</TableCell>
                  <TableCell>Nhà sản xuất</TableCell>
                  <TableCell>Đơn vị</TableCell>
                  <TableCell>Số lượng</TableCell>
                  <TableCell>Hạn sử dụng</TableCell>
                  <TableCell>Ngày nhập</TableCell>
                  <TableCell>Giá nhập</TableCell>
                  <TableCell>Vị trí</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                    <TableRow>
                      <TableCell colSpan={12} align="center">
                        <CircularProgress size={28} />
                      </TableCell>
                    </TableRow>
                ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} align="center">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                ) : (
                    filteredData.map(item => (
                        <TableRow key={item.itemId}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>
                            {item.type === 'medical supplies' ? <Chip label="Vật tư y tế" color="primary" size="small" /> : <Chip label="Thuốc" color="success" size="small" />}
                          </TableCell>
                          <TableCell>{item.batchNumber || 'N/A'}</TableCell>
                          <TableCell>{item.manufacturer || 'N/A'}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatDate(item.expiryDate)}</TableCell>
                          <TableCell>{formatDate(item.importDate) || formatDateTime(item.createdAt)}</TableCell>
                          <TableCell>{item.importPrice ? `${item.importPrice.toLocaleString()} VND` : 'N/A'}</TableCell>
                          <TableCell>{item.storageLocation || 'N/A'}</TableCell>
                          <TableCell>
                            <Chip
                                label={getStatusLabel(item.status)}
                                color={getStatusColor(item.status)}
                                size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Button variant="outlined" size="small" onClick={() => handleEditOpen(item)}>
                              Cập nhật
                            </Button>
                          </TableCell>
                        </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Dialog cập nhật */}
        <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
          <DialogTitle>Cập nhật vật tư/thuốc</DialogTitle>
          <DialogContent dividers>
            {editError && <Alert severity="error" sx={{ mb: 2 }}>{editError}</Alert>}
            {editSuccess && <Alert severity="success" sx={{ mb: 2 }}>{editSuccess}</Alert>}
            <Box component="form" onSubmit={handleEditSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                      label="Tên vật tư/thuốc"
                      name="name"
                      value={editForm.name || ''}
                      onChange={handleEditChange}
                      fullWidth
                      required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Loại</InputLabel>
                    <Select
                        name="type"
                        value={editForm.type || ''}
                        label="Loại"
                        onChange={handleEditChange}
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
                      value={editForm.unit || ''}
                      onChange={handleEditChange}
                      fullWidth
                      required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      label="Số lượng"
                      name="quantity"
                      type="number"
                      value={editForm.quantity || ''}
                      onChange={handleEditChange}
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
                      value={editForm.minStockLevel || ''}
                      onChange={handleEditChange}
                      fullWidth
                      inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Hạn sử dụng"
                        value={editForm.expiryDate || null}
                        onChange={handleEditDateChange}
                        format="YYYY-MM-DD"
                        slotProps={{ textField: { fullWidth: true, required: true } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      label="Số lô"
                      name="batchNumber"
                      value={editForm.batchNumber || ''}
                      onChange={handleEditChange}
                      fullWidth
                      required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      label="Nhà sản xuất"
                      name="manufacturer"
                      value={editForm.manufacturer || ''}
                      onChange={handleEditChange}
                      fullWidth
                      required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Ngày nhập kho"
                        value={editForm.importDate || null}
                        onChange={handleEditImportDateChange}
                        format="YYYY-MM-DD"
                        slotProps={{ textField: { fullWidth: true, required: true } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      label="Giá nhập (VND)"
                      name="importPrice"
                      type="number"
                      value={editForm.importPrice || ''}
                      onChange={handleEditChange}
                      fullWidth
                      required
                      inputProps={{ min: 0, step: 0.01 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                      label="Vị trí lưu trữ"
                      name="storageLocation"
                      value={editForm.storageLocation || ''}
                      onChange={handleEditChange}
                      fullWidth
                      required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                        name="status"
                        value={editForm.status || ''}
                        label="Trạng thái"
                        onChange={handleEditChange}
                    >
                      <MenuItem value="ACTIVE">Hoạt động</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      label="Nguồn cung cấp"
                      name="source"
                      value={editForm.source || ''}
                      onChange={handleEditChange}
                      fullWidth
                      required
                      placeholder="Ví dụ: Nhà cung cấp A, Bệnh viện B, v.v."
                  />
                </Grid>
              </Grid>
              <DialogActions sx={{ mt: 2 }}>
                <Button onClick={handleEditClose} variant="outlined">Hủy</Button>
                <Button type="submit" variant="contained" color="primary" disabled={editLoading}>
                  {editLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                </Button>
              </DialogActions>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
  );
};

export default InventoryList;
