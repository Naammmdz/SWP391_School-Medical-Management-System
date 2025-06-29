import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Popconfirm, message, Space, Typography } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, UserOutlined, TeamOutlined, InfoCircleOutlined } from '@ant-design/icons';
import MedicineDeclarationService from '../../services/MedicineDeclarationService';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const statusColors = {
  PENDING: 'orange',
  APPROVED: 'green',
  REJECTED: 'red'
};

const MedicineDeclarationsList = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentClassMap, setStudentClassMap] = useState({});
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isParent = user.userRole === 'ROLE_PARENT';

  // Lấy thông tin lớp học từ localStorage
  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const map = {};
    students.forEach(s => {
      map[s.studentId] = s.className;
    });
    setStudentClassMap(map);
  }, []);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const data = await MedicineDeclarationService.getMedicineSubmissions(config);
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      message.error('Không thể tải danh sách đơn thuốc!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cập nhật trạng thái đơn thuốc
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!status) {
        message.error("Trạng thái không hợp lệ!");
        return;
      }
      const payload = {
        submissionStatus: status.toUpperCase(),
        approvedBy: user.id || 0,
        approvedAt: new Date().toISOString().split('T')[0],
      };
      await MedicineDeclarationService.updateMedicineSubmissionStatus(
        id,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      message.success('Cập nhật trạng thái thành công!');
      fetchData();
    } catch (err) {
      message.error('Cập nhật trạng thái thất bại!');
    }
  };

  // Xóa đơn thuốc
  const deleteSubmission = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await MedicineDeclarationService.deleteMedicineSubmission(id, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Xóa đơn thuốc thành công!');
      fetchData();
    } catch (err) {
      message.error('Xóa đơn thuốc thất bại!');
    }
  };

  const columns = [
    {
      title: 'Học sinh',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text) => (
        <Space>
          <UserOutlined />
          <b>{text}</b>
        </Space>
      ),
      width: 160
    },
    {
      title: 'Lớp',
      dataIndex: 'studentId',
      key: 'className',
      render: (studentId) => (
        <Tag color="blue">{studentClassMap[studentId] || '---'}</Tag>
      ),
      width: 80
    },
    {
      title: 'Phụ huynh',
      dataIndex: 'parentName',
      key: 'parentName',
      render: (text) => (
        <Space>
          <TeamOutlined />
          {text}
        </Space>
      ),
      width: 160
    },
    {
      title: 'Hướng dẫn sử dụng',
      dataIndex: 'instruction',
      key: 'instruction',
      render: (text) => <Text>{text}</Text>,
      width: 180
    },
    {
      title: 'Thời gian dùng',
      key: 'duration',
      render: (_, record) => (
        <span>
          {record.startDate} → {record.endDate} <br />
          <Tag color="purple">{record.duration} ngày</Tag>
        </span>
      ),
      width: 140
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      render: (text) => <Text type="secondary">{text}</Text>,
      width: 160
    },
    {
      title: 'Chi tiết thuốc',
      key: 'medicineDetails',
      render: (_, record) => (
        <Button
          icon={<InfoCircleOutlined />}
          size="small"
          onClick={() => navigate('/chouongthuoc', { state: { submission: record } })}
        >
          Xem chi tiết
        </Button>
      ),
      width: 120
    },
    {
      title: 'Trạng thái',
      dataIndex: 'submissionStatus',
      key: 'submissionStatus',
      render: (status) => (
        <Tag color={status === 'APPROVED' ? 'green' : status === 'PENDING' ? 'orange' : 'red'}>
          {status === 'APPROVED' ? 'Đã Nhận' : status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối'}
        </Tag>
      ),
      width: 110
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => {
        if (isParent) {
          return (
            <Popconfirm
              title="Bạn chắc chắn muốn xóa đơn thuốc này?"
              onConfirm={() => deleteSubmission(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              disabled={record.submissionStatus !== 'PENDING'}
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                size="small"
                disabled={record.submissionStatus !== 'PENDING'}
              >
                Xóa
              </Button>
            </Popconfirm>
          );
        }
        // NURSE/ADMIN
        return (
          <Space>
            <Button
              icon={<CheckCircleOutlined />}
              type="primary"
              size="small"
              onClick={() => updateStatus(record.id, 'APPROVED')}
              disabled={record.submissionStatus === 'APPROVED'}
            >
              Xác nhận
            </Button>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => updateStatus(record.id, 'REJECTED')}
              disabled={record.submissionStatus === 'REJECTED'}
            >
              Từ chối
            </Button>
            <Popconfirm
              title="Bạn chắc chắn muốn xóa đơn thuốc này?"
              onConfirm={() => deleteSubmission(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                size="small"
              >
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        );
      },
      width: 220
    }
  ];

  return (
    <div className="medicine-declarations-list-page" style={{ maxWidth: 1200, margin: '32px auto' }}>
      <Card
        bordered={false}
        style={{
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: 24,
          background: '#f9fafb'
        }}
      >
        <Title level={2} style={{ textAlign: 'center', marginBottom: 32, color: '#2563eb' }}>
          Danh sách đơn thuốc từ phụ huynh
        </Title>
        <Table
          columns={columns}
          dataSource={submissions.map(s => ({ ...s, key: s.id }))}
          loading={loading}
          pagination={{ pageSize: 8 }}
          bordered
          scroll={{ x: 1200 }}
          locale={{
            emptyText: 'Không có đơn thuốc nào.'
          }}
        />
      </Card>
    </div>
  );
};

export default MedicineDeclarationsList;