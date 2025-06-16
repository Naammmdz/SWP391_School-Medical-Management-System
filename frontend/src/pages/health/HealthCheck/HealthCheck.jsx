import React, { useEffect, useState } from 'react';
import HealthCheckService from '../../../services/HealthCheckService';
import { Card, Table, Spin, Alert, Typography, Space, Tag } from 'antd';
import { CalendarOutlined, UserOutlined, EnvironmentOutlined, TeamOutlined, FileTextOutlined } from '@ant-design/icons';
import './HealthCheck.css';

const { Title, Text } = Typography;

const columns = [
  {
    title: 'Mã chiến dịch',
    dataIndex: 'campaignId',
    key: 'campaignId',
    align: 'center',
    width: 100,
    render: (id) => <Tag color="blue">{id}</Tag>
  },
  {
    title: 'Tên chiến dịch',
    dataIndex: 'campaignName',
    key: 'campaignName',
    render: (name) => <b>{name}</b>,
    width: 180,
  },
  {
    title: 'Đối tượng',
    dataIndex: 'targetGroup',
    key: 'targetGroup',
    width: 120,
    render: (text) => (
      <Space>
        <TeamOutlined />
        {text}
      </Space>
    ),
  },
  {
    title: 'Loại',
    dataIndex: 'type',
    key: 'type',
    width: 120,
    render: (text) => (
      <Space>
        <FileTextOutlined />
        {text}
      </Space>
    ),
  },
  {
    title: 'Địa điểm',
    dataIndex: 'address',
    key: 'address',
    width: 140,
    render: (text) => (
      <Space>
        <EnvironmentOutlined />
        {text}
      </Space>
    ),
  },
  {
    title: 'Người thực hiện',
    dataIndex: 'organizer',
    key: 'organizer',
    width: 140,
    render: (text) => (
      <Space>
        <UserOutlined />
        {text}
      </Space>
    ),
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    key: 'description',
    width: 200,
    ellipsis: true,
  },
  {
    title: 'Ngày khám',
    dataIndex: 'scheduledDate',
    key: 'scheduledDate',
    width: 120,
    render: (date) => (
      <Space>
        <CalendarOutlined />
        {date}
      </Space>
    ),
  },
  {
    title: 'Người duyệt',
    key: 'approvedBy',
    width: 170,
    render: () => (
      <Space>
        <UserOutlined />
        Hiệu Trưởng: Nguyễn Thanh Lâm
      </Space>
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    width: 120,
    render: (status) => (
      <Tag color={status === 'APPROVED' ? 'green' : 'default'}>
        {status === 'APPROVED' ? 'Đã duyệt' : status}
      </Tag>
    ),
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'createdAt',
    key: 'createdAt',
    width: 140,
    render: (date) =>
      date ? new Date(date).toLocaleString('vi-VN') : '',
  },
];

const HealthCheck = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApprovedCampaigns = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const data = await HealthCheckService.getHealthCheckApproved(config);
        setCampaigns(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Không thể tải danh sách chiến dịch đã duyệt!');
      }
      setLoading(false);
    };
    fetchApprovedCampaigns();
  }, []);

  return (
    <div className="approved-health-check-campaigns" style={{ maxWidth: 1200, margin: '32px auto' }}>
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
          Danh sách chiến dịch kiểm tra sức khỏe 
        </Title>
        {loading && (
          <div style={{ textAlign: 'center', margin: '40px 0' }}>
            <Spin size="large" />
          </div>
        )}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}
        {!loading && !error && (
          <Table
            columns={columns}
            dataSource={campaigns.map(c => ({ ...c, key: c.campaignId }))}
            pagination={{ pageSize: 8 }}
            bordered
            scroll={{ x: 1200 }}
            className="health-check-table"
            locale={{
              emptyText: 'Không có chiến dịch nào đã được duyệt.'
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default HealthCheck;