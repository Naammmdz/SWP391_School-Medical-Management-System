import React, { useEffect, useState } from 'react';
import { Table, Spin, Alert, Card, Avatar, Button } from 'antd';
import { UserOutlined, ArrowLeftOutlined, CheckCircleTwoTone, CloseCircleTwoTone, InfoCircleOutlined } from '@ant-design/icons';
import { FaRegCalendarCheck, FaNotesMedical } from 'react-icons/fa';
import HealthCheckService from '../../../services/HealthCheckService';

const HealthCheckResultStudent = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentInfo, setStudentInfo] = useState({ fullName: '', className: '' });
  const [campaignName, setcampaignName] = useState({});

  const studentId = localStorage.getItem('selectedStudentId');
  const token = localStorage.getItem('token');

  // Lấy thông tin học sinh từ localStorage
  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const found = students.find(s => String(s.studentId) === String(studentId));
    if (found) {
      setStudentInfo({ fullName: found.fullName, className: found.className });
    } else {
      setStudentInfo({ fullName: '', className: '' });
    }
  }, [studentId]);

  // Lấy map {campaignId: campaignName} từ localStorage
  useEffect(() => {
    const campaigns = JSON.parse(localStorage.getItem('healthCheckCampaigns') || '[]');
    const map = {};
    campaigns.forEach(c => {
      map[c.campaignId] = c.campaignName;
    });
    setcampaignName(map);
  }, []);

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
    { 
      title: 'Tên chiến dịch', 
      dataIndex: 'campaignId', 
      key: 'campaignName',
      render: campaignId => campaignName[campaignId] || 'Không xác định'
    },
    { title: <><FaRegCalendarCheck style={{ color: '#1890ff', marginRight: 4 }} />Ngày khám</>, dataIndex: 'date', key: 'date' },
    { title: 'Chiều cao (cm)', dataIndex: 'height', key: 'height' },
    { title: 'Cân nặng (kg)', dataIndex: 'weight', key: 'weight' },
    { title: 'Thị lực trái', dataIndex: 'eyesightLeft', key: 'eyesightLeft' },
    { title: 'Thị lực phải', dataIndex: 'eyesightRight', key: 'eyesightRight' },
    { title: 'Huyết áp', dataIndex: 'bloodPressure', key: 'bloodPressure' },
    { title: 'Thính lực trái', dataIndex: 'hearingLeft', key: 'hearingLeft' },
    { title: 'Thính lực phải', dataIndex: 'hearingRight', key: 'hearingRight' },
    { title: 'Nhiệt độ', dataIndex: 'temperature', key: 'temperature' },
    { title: <><InfoCircleOutlined style={{ color: '#52c41a', marginRight: 4 }} />Đặt lịch tư vấn</>, dataIndex: 'consultationAppointment', key: 'consultationAppointment',
      render: v => v ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#ff4d4f" />
    },
    { title: <><FaNotesMedical style={{ color: '#faad14', marginRight: 4 }} />Ghi chú</>, dataIndex: 'notes', key: 'notes' },
    { title: 'Phụ huynh xác nhận', dataIndex: 'parentConfirmation', key: 'parentConfirmation',
      render: v => v ? <CheckCircleTwoTone twoToneColor="#52c41a" /> : <CloseCircleTwoTone twoToneColor="#ff4d4f" />
    },
  ];

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div style={{ maxWidth: 1100, margin: '32px auto', padding: 16, background: '#f4f8fb', minHeight: '100vh' }}>
      <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px #e6f7ff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar size={64} icon={<UserOutlined />} style={{ background: '#1890ff' }} />
          <div>
            <h2 style={{ margin: 0, color: '#1890ff', fontWeight: 700 }}>Kết quả kiểm tra sức khỏe của học sinh</h2>
            {studentInfo.fullName && (
              <div style={{ marginTop: 8, fontSize: 16 }}>
                <b>Họ tên:</b> {studentInfo.fullName} &nbsp; | &nbsp;
                <b>Lớp:</b> {studentInfo.className}
              </div>
            )}
          </div>
          <div style={{ flex: 1 }} />
          <Button icon={<ArrowLeftOutlined />} onClick={handleBack} type="primary" ghost size="large">
            Quay lại
          </Button>
        </div>
      </Card>
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}
      <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px #e6f7ff' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Spin tip="Đang tải kết quả..." size="large" />
          </div>
        ) : (
          <Table
            dataSource={results}
            columns={columns}
            rowKey={record => `${record.studentId}-${record.campaignId}-${record.date}`}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <div style={{ textAlign: 'center', color: '#bfbfbf', padding: '32px 0' }}>
                  <InfoCircleOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                  <div>Không có kết quả kiểm tra sức khỏe.</div>
                </div>
              )
            }}
            bordered
            style={{ background: '#fff', borderRadius: 8 }}
          />
        )}
      </Card>
    </div>
  );
};

export default HealthCheckResultStudent;