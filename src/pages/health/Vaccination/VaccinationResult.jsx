import React, { useCallback, useState, useEffect } from 'react';
import VaccinationService from '../../../services/VaccinationService';
import dayjs from 'dayjs';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Alert,
  Chip,
  Grid,
  Paper,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const resultOptions = [
  { value: 'SUCCESS', label: 'Thành công', color: 'success' },
  { value: 'FAILED', label: 'Thất bại', color: 'error' },
  { value: 'DELAYED', label: 'Hoãn', color: 'warning' },
];

const resultLabel = {
  SUCCESS: <Chip label="Thành công" color="success" size="small" />,
  FAILED: <Chip label="Thất bại" color="error" size="small" />,
  DELAYED: <Chip label="Hoãn" color="warning" size="small" />,
};

const VaccinationResult = () => {
  const [approvedCampaigns, setApprovedCampaigns] = useState([]);
  const [filterValues, setFilterValues] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [confirmedResults, setConfirmedResults] = useState([]);
  const [confirmedLoading, setConfirmedLoading] = useState(false);
  const [filterForm, setFilterForm] = useState({});
  const [studentInfoMap, setStudentInfoMap] = useState({});
  const [openDetail, setOpenDetail] = useState(false);
  const [updateForm, setUpdateForm] = useState({});

  // Lấy danh sách chiến dịch đã duyệt từ API
  const fetchApprovedCampaigns = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await VaccinationService.getVaccinationCampaignApproved(config);
      setApprovedCampaigns(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setApprovedCampaigns([]);
    }
  }, []);

  useEffect(() => {
    fetchApprovedCampaigns();
    // Lấy danh sách học sinh từ localStorage
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const map = {};
    students.forEach(s => {
      map[s.studentId] = {
        name: s.fullName || s.name || '',
        className: s.className || '',
      };
    });
    setStudentInfoMap(map);
  }, [fetchApprovedCampaigns]);

  // Hàm lấy kết quả PH đã xác nhận hoặc filter theo điều kiện
  const fetchConfirmedResults = async (filterValues = {}) => {
    setConfirmedLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` }, params: filterValues };
      let res = await VaccinationService.filterResult(config);
      setConfirmedResults(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setConfirmedResults([]);
    }
    setConfirmedLoading(false);
  };

  useEffect(() => {
    fetchConfirmedResults();
  }, []);

  const getCampaignInfo = (campaignId) => {
    const c = approvedCampaigns.find(ca => String(ca.campaignId) === String(campaignId));
    return c || {};
  };

  const getStudentName = (studentId, record) => {
    return studentInfoMap[studentId]?.name || record.studentName || record.fullName || record.name || studentId;
  };

  const getStudentClass = (studentId) => {
    return studentInfoMap[studentId]?.className || '';
  };

  // Xử lý filter
  const handleFilter = (e) => {
    e.preventDefault();
    fetchConfirmedResults(filterForm);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    setFilterForm(prev => ({ ...prev, [name]: value ? value.format('YYYY-MM-DD') : '' }));
  };

  // Xem chi tiết
  const handleOpenDetail = (record) => {
    setSelectedResult(record);
    setUpdateForm({
      date: record.date ? dayjs(record.date) : dayjs(),
      doseNumber: record.doseNumber,
      parentConfirmation: record.parentConfirmation,
      previousDose: record.isPreviousDose,
      vaccineName: record.vaccineName,
      adverseReaction: record.adverseReaction,
      notes: record.notes,
      result: record.result,
    });
    setSubmitStatus(null);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedResult(null);
    setSubmitStatus(null);
  };

  // Cập nhật kết quả
  const handleUpdateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUpdateForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleUpdateDate = (value) => {
    setUpdateForm(prev => ({ ...prev, date: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setSubmitStatus(null);
    try {
      let dateArr = [];
      if (updateForm.date && dayjs.isDayjs(updateForm.date)) {
        dateArr = [updateForm.date.year(), updateForm.date.month() + 1, updateForm.date.date()];
      } else if (Array.isArray(selectedResult.date)) {
        dateArr = selectedResult.date;
      } else if (selectedResult.date && typeof selectedResult.date === 'string') {
        const parts = selectedResult.date.split('-');
        if (parts.length === 3) {
          dateArr = [parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])];
        }
      }
      const payload = {
        vaccinationId: selectedResult.vaccinationId,
        date: dateArr,
        doseNumber: updateForm.doseNumber,
        adverseReaction: updateForm.adverseReaction,
        notes: updateForm.notes,
        parentConfirmation: updateForm.parentConfirmation,
        result: updateForm.result,
        vaccineName: selectedResult.vaccineName || getCampaignInfo(selectedResult.campaignId).type || '',
        studentId: selectedResult.studentId,
        campaignId: selectedResult.campaignId,
        previousDose: updateForm.previousDose,
      };
      const token = localStorage.getItem('token');
      await VaccinationService.updateVaccinationResult(selectedResult.vaccinationId, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubmitStatus('success');
      fetchConfirmedResults(filterForm);
      setOpenDetail(false);
    } catch (err) {
      setSubmitStatus('error');
    }
    setLoadingSubmit(false);
  };

  // Các cột cơ bản
  const columns = [
    { title: 'Học sinh', key: 'studentId', render: (row) => getStudentName(row.studentId, row) },
    { title: 'Lớp', key: 'className', render: (row) => getStudentClass(row.studentId) },
    { title: 'Chiến dịch', key: 'campaignId', render: (row) => getCampaignInfo(row.campaignId).campaignName || row.campaignId },
    { title: 'Ngày tiêm', key: 'date', render: (row) => row.date || (Array.isArray(getCampaignInfo(row.campaignId).scheduledDate) ? getCampaignInfo(row.campaignId).scheduledDate.join('-') : '') },
    { title: 'Kết quả', key: 'result', render: (row) => resultLabel[row.result] || row.result },
    { title: 'Xác nhận PH', key: 'parentConfirmation', render: (row) => row.parentConfirmation ? <Chip label="Đã xác nhận" color="success" size="small" /> : <Chip label="Chưa" size="small" /> },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (row) => (
        <Button variant="outlined" size="small" onClick={() => handleOpenDetail(row)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, mb: 4 }}>
      {/* Filter form */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Lọc kết quả tiêm chủng đã xác nhận PH</Typography>
        <Box component="form" onSubmit={handleFilter} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField label="Lớp" name="className" size="small" onChange={handleFilterChange} sx={{ minWidth: 120 }} />
          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel>Chiến dịch</InputLabel>
            <Select
              label="Chiến dịch"
              name="campaignName"
              onChange={handleFilterChange}
              defaultValue=""
            >
              <MenuItem value=""><em>Chọn chiến dịch</em></MenuItem>
              {approvedCampaigns.map(campaign => (
                <MenuItem key={campaign.campaignId} value={campaign.campaignName}>{campaign.campaignName}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 150 }} size="small">
            <InputLabel>Xác nhận PH</InputLabel>
            <Select
              label="Xác nhận PH"
              name="parentConfirmation"
              onChange={handleFilterChange}
              defaultValue=""
            >
              <MenuItem value=""><em>Chọn trạng thái</em></MenuItem>
              <MenuItem value={true}>Đã xác nhận</MenuItem>
              <MenuItem value={false}>Chưa xác nhận</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Tên học sinh" name="studentName" size="small" onChange={handleFilterChange} sx={{ minWidth: 120 }} />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Từ ngày"
              onChange={value => handleDateChange('startDate', value)}
              slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
            />
            <DatePicker
              label="Đến ngày"
              onChange={value => handleDateChange('endDate', value)}
              slotProps={{ textField: { size: 'small', sx: { minWidth: 120 } } }}
            />
          </LocalizationProvider>
          <Button type="submit" variant="contained" color="primary">Tìm kiếm</Button>
          <Button variant="outlined" onClick={() => { setFilterForm({}); fetchConfirmedResults(); }}>Xóa</Button>
        </Box>
      </Paper>

      {/* Bảng kết quả */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Kết quả tiêm chủng đã xác nhận PH</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map(col => (
                  <TableCell key={col.key}>{col.title}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {confirmedLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress size={28} />
                  </TableCell>
                </TableRow>
              ) : confirmedResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              ) : (
                confirmedResults.map(row => (
                  <TableRow key={`${row.studentId}-${row.campaignId}-${row.date}`}>
                    {columns.map(col => (
                      <TableCell key={col.key}>{col.render(row)}</TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog chi tiết */}
      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedResult ? `Cập nhật kết quả cho: ${getStudentName(selectedResult.studentId, selectedResult)}` : ''}
        </DialogTitle>
        <DialogContent dividers>
          {submitStatus === 'success' && (
            <Alert severity="success" sx={{ mb: 2 }}>Cập nhật kết quả tiêm chủng thành công!</Alert>
          )}
          {submitStatus === 'error' && (
            <Alert severity="error" sx={{ mb: 2 }}>Cập nhật thất bại! Vui lòng kiểm tra lại thông tin.</Alert>
          )}
          {selectedResult && (
            <Box component="form" onSubmit={handleUpdateSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Tên học sinh" value={getStudentName(selectedResult.studentId, selectedResult)} fullWidth disabled margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Tên chiến dịch" value={getCampaignInfo(selectedResult.campaignId).campaignName || selectedResult.campaignId} fullWidth disabled margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Ngày tiêm"
                      value={updateForm.date}
                      onChange={handleUpdateDate}
                      format="YYYY-MM-DD"
                      slotProps={{ textField: { fullWidth: true, margin: 'dense', disabled: true } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Tên vắc-xin" value={selectedResult.vaccineName || getCampaignInfo(selectedResult.campaignId).type || ''} fullWidth disabled margin="dense" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Số mũi tiêm"
                    name="doseNumber"
                    type="number"
                    value={updateForm.doseNumber || ''}
                    onChange={handleUpdateChange}
                    fullWidth
                    required
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phản ứng sau tiêm"
                    name="adverseReaction"
                    value={updateForm.adverseReaction || ''}
                    onChange={handleUpdateChange}
                    fullWidth
                    required
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Ghi chú"
                    name="notes"
                    value={updateForm.notes || ''}
                    onChange={handleUpdateChange}
                    fullWidth
                    multiline
                    rows={2}
                    margin="dense"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControlLabel
                    control={<Checkbox checked={!!updateForm.parentConfirmation} name="parentConfirmation" onChange={handleUpdateChange} />}
                    label="Xác nhận của phụ huynh"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="dense">
                    <InputLabel>Kết quả</InputLabel>
                    <Select
                      name="result"
                      value={updateForm.result || ''}
                      label="Kết quả"
                      onChange={handleUpdateChange}
                      required
                    >
                      {resultOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox checked={!!updateForm.previousDose} name="previousDose" onChange={handleUpdateChange} />}
                    label="Đã tiêm mũi trước"
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button type="submit" variant="contained" color="primary" disabled={loadingSubmit}>
                  {loadingSubmit ? <CircularProgress size={20} /> : 'Cập nhật kết quả'}
                </Button>
                <Button variant="outlined" onClick={handleCloseDetail}>Hủy</Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default VaccinationResult;