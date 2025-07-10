import React, { useEffect, useState } from 'react';
import MedicalEventService from '../../../services/MedicalEventService';
import { useNavigate } from 'react-router-dom';

const tableHeader = {
  title: 'Tiêu đề',
  eventType: 'Loại sự kiện',
  eventDate: 'Ngày',
  status: 'Trạng thái',
  stuId: 'Học sinh liên quan',
  action: 'Hành động',
};

const statusVN = {
  PROCESSING: 'Đang xử lý',
  RESOLVED: 'Đã xử lý',
};
const severityVN = {
  MINOR: 'Nhẹ',
  MODERATE: 'Trung bình',
  SERIOUS: 'Nặng',
  CRITICAL: 'Rất nặng',
};

const fieldLabels = {
  title: 'Tiêu đề',
  eventType: 'Loại sự kiện',
  eventDate: 'Ngày',
  status: 'Trạng thái',
  stuId: 'Học sinh liên quan',
  relatedMedicinesUsed: 'Vật tư/Thuốc đã dùng',
  description: 'Mô tả',
  notes: 'Ghi chú',
  handlingMeasures: 'Biện pháp xử lý',
  severityLevel: 'Mức độ',
  location: 'Địa điểm',
  createdAt: 'Ngày tạo',
  createdBy: 'Người tạo',
};

const MedicalEventList = () => {
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [detail, setDetail] = useState(null);
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

  const renderDetail = (ev) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', fontSize: 15 }}>
      <tbody>
        <tr>
          <td style={{ fontWeight: 600, padding: 8 }}>{fieldLabels.title}</td>
          <td style={{ padding: 8 }}>{ev.title}</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: 8 }}>{fieldLabels.eventType}</td>
          <td style={{ padding: 8 }}>{ev.eventType}</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: 8 }}>{fieldLabels.eventDate}</td>
          <td style={{ padding: 8 }}>{new Date(ev.eventDate).toLocaleString('vi-VN')}</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: 8 }}>{fieldLabels.status}</td>
          <td style={{ padding: 8 }}>{statusVN[ev.status] || ev.status}</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: 8 }}>{fieldLabels.severityLevel}</td>
          <td style={{ padding: 8 }}>{severityVN[ev.severityLevel] || ev.severityLevel}</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: 8 }}>{fieldLabels.stuId}</td>
          <td style={{ padding: 8 }}>{getStudentNames(ev.stuId)}</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: 8 }}>{fieldLabels.relatedMedicinesUsed}</td>
          <td style={{ padding: 8 }}>
            {(ev.relatedMedicinesUsed || []).length === 0 ? 'Không' : (
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {ev.relatedMedicinesUsed.map((med, idx) => (
                  <li key={med.id || med.medicineId || idx}>
                    {med.medicineName} ({med.quantityUsed} {med.unit}) {med.usageNote ? `- ${med.usageNote}` : ''}
                  </li>
                ))}
              </ul>
            )}
          </td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: 8 }}>{fieldLabels.location}</td>
          <td style={{ padding: 8 }}>{ev.location}</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: 8 }}>{fieldLabels.description}</td>
          <td style={{ padding: 8 }}>{ev.description}</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: 8 }}>{fieldLabels.notes}</td>
          <td style={{ padding: 8 }}>{ev.notes}</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: 8 }}>{fieldLabels.handlingMeasures}</td>
          <td style={{ padding: 8 }}>{ev.handlingMeasures}</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: 8 }}>{fieldLabels.createdAt}</td>
          <td style={{ padding: 8 }}>{ev.createdAt ? new Date(ev.createdAt).toLocaleString('vi-VN') : ''}</td>
        </tr>
        <tr>
          <td style={{ fontWeight: 600, padding: 8 }}>{fieldLabels.createdBy}</td>
          <td style={{ padding: 8 }}>{ev.createdBy}</td>
        </tr>
        {/* Hiển thị các trường khác nếu có */}
        {Object.keys(ev).map(key => (
          !Object.keys(fieldLabels).includes(key) && (
            <tr key={key}>
              <td style={{ fontWeight: 600, padding: 8 }}>{key}</td>
              <td style={{ padding: 8 }}>{typeof ev[key] === 'object' ? JSON.stringify(ev[key]) : String(ev[key])}</td>
            </tr>
          )
        ))}
      </tbody>
    </table>
  );

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', background: '#f6f8fa', padding: 32, borderRadius: 12 }}>
      <button
        type="button"
        style={{ marginBottom: 24, padding: '8px 20px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 600 }}
        onClick={() => navigate(-1)}
      >
        Quay lại tạo sự kiện
      </button>
      <h2 style={{ textAlign: 'center', marginBottom: 32 }}>Danh sách sự kiện y tế</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', fontSize: 16 }}>
          <thead>
            <tr style={{ background: '#e3eafc' }}>
              <th style={{ padding: 10, border: '1px solid #ddd' }}>{tableHeader.title}</th>
              <th style={{ padding: 10, border: '1px solid #ddd' }}>{tableHeader.eventType}</th>
              <th style={{ padding: 10, border: '1px solid #ddd' }}>{tableHeader.eventDate}</th>
              <th style={{ padding: 10, border: '1px solid #ddd' }}>{tableHeader.status}</th>
              <th style={{ padding: 10, border: '1px solid #ddd' }}>{tableHeader.stuId}</th>
              <th style={{ padding: 10, border: '1px solid #ddd' }}>{tableHeader.action}</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: 16 }}>Không có sự kiện y tế nào</td></tr>
            )}
            {events.map(ev => (
              <tr key={ev.id} style={{ background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{ev.title}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{ev.eventType}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{new Date(ev.eventDate).toLocaleDateString('vi-VN')}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{statusVN[ev.status] || ev.status}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>{getStudentNames(ev.stuId)}</td>
                <td style={{ padding: 10, border: '1px solid #eee' }}>
                  <button
                    style={{ padding: '6px 16px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 500, cursor: 'pointer' }}
                    onClick={() => setDetail(ev)}
                  >
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {detail && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 10, minWidth: 400, maxWidth: 600, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
            <h3 style={{ marginBottom: 16 }}>Chi tiết sự kiện</h3>
            {renderDetail(detail)}
            <button
              onClick={() => setDetail(null)}
              style={{ marginTop: 16, padding: '8px 24px', background: '#43a047', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalEventList;