import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert } from 'antd';
import HealthCheckService from '../../../services/HealthCheckService';

const HealthCheckResultStudent = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Lấy studentId đã chọn từ localStorage (đã chọn ở ParentPages)
  const studentId = localStorage.getItem('selectedStudentId');
  const token = localStorage.getItem('token');

  useEffect(() => {
  const fetchResults = async () => {
    if (!studentId) {
      setError('Vui lòng chọn học sinh ở trang trước.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const data = await HealthCheckService.getResultByStudentId(studentId, config);
      // Nếu trả về object, đưa vào mảng; nếu trả về null hoặc lỗi, để mảng rỗng
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        setResults([data]);
      } else if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError('Không thể lấy kết quả kiểm tra sức khỏe.');
    }
    setLoading(false);
  };
  fetchResults();
}, [studentId, token]);

  const columns = [
    { title: 'Ngày khám', dataIndex: 'date', key: 'date' },
    { title: 'Chiều cao (cm)', dataIndex: 'height', key: 'height' },
    { title: 'Cân nặng (kg)', dataIndex: 'weight', key: 'weight' },
    { title: 'Thị lực trái', dataIndex: 'eyesightLeft', key: 'eyesightLeft' },
    { title: 'Thị lực phải', dataIndex: 'eyesightRight', key: 'eyesightRight' },
    { title: 'Huyết áp', dataIndex: 'bloodPressure', key: 'bloodPressure' },
    { title: 'Thính lực trái', dataIndex: 'hearingLeft', key: 'hearingLeft' },
    { title: 'Thính lực phải', dataIndex: 'hearingRight', key: 'hearingRight' },
    { title: 'Nhiệt độ', dataIndex: 'temperature', key: 'temperature' },
    { title: 'Đặt lịch tư vấn', dataIndex: 'consultationAppointment', key: 'consultationAppointment',
      render: v => v ? 'Có' : 'Không'
    },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
    { title: 'Phụ huynh xác nhận', dataIndex: 'parentConfirmation', key: 'parentConfirmation',
      render: v => v ? 'Đã xác nhận' : 'Chưa xác nhận'
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto' }}>
      <h2>Kết quả kiểm tra sức khỏe của học sinh</h2>
      {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
      {loading ? (
        <Spin tip="Đang tải kết quả..." />
      ) : (
        <Table
          dataSource={results}
          columns={columns}
          rowKey={record => `${record.studentId}-${record.campaignId}-${record.date}`}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'Không có kết quả kiểm tra sức khỏe.' }}
        />
      )}
    </div>
  );
};

export default HealthCheckResultStudent;