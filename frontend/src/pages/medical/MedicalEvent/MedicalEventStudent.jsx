import React, { useEffect, useState } from 'react';
import MedicalEventService from '../../../services/MedicalEventService';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const MedicalEventStudent = () => {
  const [events, setEvents] = useState([]);
  const [student, setStudent] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedStudentId = localStorage.getItem('selectedStudentId');
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const matchedStudent = students.find(s => String(s.studentId) === String(selectedStudentId));
    setStudent(matchedStudent);

    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!selectedStudentId || !token) return;

       const res = await MedicalEventService.getMedicalEventByStudentId(selectedStudentId, {
  headers: { Authorization: `Bearer ${token}` }
});

if (Array.isArray(res)) {
  setEvents(res);
} else {
  console.warn('Response is not an array:', res);
  setEvents([]);
}

      } catch (error) {
        console.error('Failed to fetch medical events:', error);
        setEvents([]);
      }
    };

    if (selectedStudentId) {
      fetchEvents();
    }
  }, []);

  const handleOpenDetail = (event) => {
    setSelectedEvent(event);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedEvent(null);
  };

  // Updated severity levels to Vietnamese
  const severityLevels = {
    MINOR: "Nhẹ",
    MODERATE: "Trung bình",
    SERIOUS: "Nặng",
    CRITICAL: "Cấp cứu"
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', bgcolor: '#e3f2fd', p: 4, borderRadius: 3 }}>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 3, fontWeight: 600, borderRadius: 2 }}
        onClick={() => navigate(-1)}
      >
        Quay lại
      </Button>

      <Typography variant="h4" align="center" sx={{ mb: 2, color: '#1565c0', fontWeight: 700 }}>
        Sự kiện y tế của học sinh
      </Typography>

      {student && (
        <Typography align="center" sx={{ mb: 3, fontWeight: 600, fontSize: 20, color: '#1976d2' }}>
          {student.fullName} - {student.className}
        </Typography>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#1976d2' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Tiêu đề</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Loại sự kiện</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Ngày</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Địa điểm</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Trạng thái</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Chi tiết</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ color: '#888', py: 3 }}>
                  Không có sự kiện y tế nào
                </TableCell>
              </TableRow>
            ) : (
              events.map(ev => (
                <TableRow key={ev.id} hover>
                  <TableCell>{ev.title}</TableCell>
                  <TableCell>{ev.eventType}</TableCell>
                  <TableCell>{new Date(ev.eventDate).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{ev.location}</TableCell>
                  <TableCell>
                    <Box sx={{
                      display: 'inline-block',
                      px: 2, py: 0.5,
                      borderRadius: 2,
                      bgcolor: ev.status === 'RESOLVED' ? '#43a047' : '#fbc02d',
                      color: '#fff', fontWeight: 600
                    }}>
                      {ev.status === 'RESOLVED' ? 'Đã xử lý' : 'Đang xử lý'}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenDetail(ev)}>
                      <InfoIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 600 }}>
          Chi tiết sự kiện y tế
        </DialogTitle>
        <DialogContent dividers>
          {selectedEvent && (
            <Box sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>
                {selectedEvent.title}
              </Typography>
              <Typography><b>Loại sự kiện:</b> {selectedEvent.eventType}</Typography>
              <Typography><b>Ngày:</b> {new Date(selectedEvent.eventDate).toLocaleDateString('vi-VN')}</Typography>
              <Typography><b>Địa điểm:</b> {selectedEvent.location}</Typography>
              <Typography><b>Trạng thái:</b> {selectedEvent.status === 'RESOLVED' ? 'Đã xử lý' : 'Đang xử lý'}</Typography>
              <Typography><b>Mô tả:</b> {selectedEvent.description}</Typography>
              <Typography><b>Ghi chú:</b> {selectedEvent.notes}</Typography>
              <Typography><b>Mức độ:</b> {severityLevels[selectedEvent.severityLevel]}</Typography>
              <Typography><b>Biện pháp xử lý:</b> {selectedEvent.handlingMeasures}</Typography>
              <Typography sx={{ mt: 2 }}><b>Vật tư/Thuốc đã dùng:</b></Typography>
              {(selectedEvent.relatedMedicinesUsed || []).length === 0 ? (
                <Typography sx={{ color: '#888', ml: 2 }}>Không</Typography>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 24 }}>
                  {selectedEvent.relatedMedicinesUsed.map(med => (
                    <li key={med.id || med.medicineId}>
                      <span style={{ color: '#1976d2', fontWeight: 500 }}>{med.medicineName}</span> ({med.quantityUsed} {med.unit}) {med.usageNote ? `- ${med.usageNote}` : ''}
                    </li>
                  ))}
                </ul>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetail} color="primary" variant="contained">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MedicalEventStudent;
