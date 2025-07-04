import React, { useEffect, useState } from 'react';
import MedicalEventService from '../../../services/MedicalEventService';
import { useNavigate } from 'react-router-dom';

const MedicalEventList = () => {
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await MedicalEventService.getAllMedicalEvents(config);
        setEvents(Array.isArray(res.data) ? res.data : res);
      } catch {
        setEvents([]);
      }
    };
    fetchEvents();
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      try {
        setStudents(JSON.parse(storedStudents));
      } catch {
        setStudents([]);
      }
    }
  }, []);

  const getStudentNames = (stuIdArr) => {
    if (!Array.isArray(stuIdArr) || students.length === 0) return '';
    return stuIdArr.map(id => {
      const stu = students.find(s => s.studentId === id);
      return stu ? stu.fullName : id;
    }).join(', ');
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', background: '#f6f8fa', padding: 32, borderRadius: 12 }}>
      <button
        type="button"
        style={{ marginBottom: 24, padding: '8px 20px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600 }}
        onClick={() => navigate(-1)}
      >
        Quay lại tạo sự kiện
      </button>
      <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Danh sách sự kiện y tế</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#e3eafc' }}>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Tiêu đề</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Loại sự kiện</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Ngày</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Địa điểm</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Trạng thái</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Học sinh liên quan</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Vật tư/Thuốc đã dùng</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Mô tả</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Ghi chú</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Mức độ</th>
              <th style={{ padding: 8, border: '1px solid #ddd' }}>Biện pháp xử lý</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr><td colSpan={11} style={{ textAlign: 'center', color: '#888', padding: 16 }}>Không có sự kiện y tế nào</td></tr>
            )}
            {events.map(ev => (
              <tr key={ev.id}>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{ev.title}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{ev.eventType}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{new Date(ev.eventDate).toLocaleDateString('vi-VN')}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{ev.location}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{ev.status}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{getStudentNames(ev.stuId)}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>
                  {(ev.relatedMedicinesUsed || []).length === 0 ? 'Không' : (
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {ev.relatedMedicinesUsed.map(med => (
                        <li key={med.id || med.medicineId}>
                          {med.medicineName} ({med.quantityUsed} {med.unit}) {med.usageNote ? `- ${med.usageNote}` : ''}
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{ev.description}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{ev.notes}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{ev.severityLevel}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{ev.handlingMeasures}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicalEventList;