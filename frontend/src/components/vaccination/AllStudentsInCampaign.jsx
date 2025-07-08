import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, message, Spin, Empty, Tag } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import VaccinationService from '../../services/VaccinationService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AllStudentsInCampaign = ({ campaignId, campaignInfo }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (campaignId) {
      fetchAllStudents();
    }
  }, [campaignId]);

  const fetchAllStudents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await VaccinationService.getAllStudentsInCampaign(campaignId, config);
      setStudents(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Không thể tải danh sách học sinh');
      setStudents([]);
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã học sinh',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 120,
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (fullName) => (
        <div>
          <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          <Text strong>{fullName}</Text>
        </div>
      ),
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className',
      width: 100,
      render: (className) => (
        <Tag color="blue">{className}</Tag>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender) => (
        <Tag color={gender === 'Nam' ? 'cyan' : 'pink'}>{gender}</Tag>
      ),
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dob',
      key: 'dob',
      width: 120,
      render: (dob) => dob ? dayjs(dob).format('DD/MM/YYYY') : '',
    },
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TeamOutlined style={{ marginRight: 8, color: '#52c41a' }} />
          <span>Danh sách học sinh đủ điều kiện tham gia</span>
          {students.length > 0 && (
            <Tag color="green" style={{ marginLeft: 12 }}>
              {students.length} học sinh
            </Tag>
          )}
        </div>
      }
      extra={
        campaignInfo && (
          <Text type="secondary">
            Nhóm đối tượng: {campaignInfo.targetGroup}
          </Text>
        )
      }
      style={{ marginTop: 16 }}
    >
      <Spin spinning={loading}>
        {students.length === 0 && !loading ? (
          <Empty
            description="Không có học sinh nào đủ điều kiện tham gia chiến dịch này"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={students}
            rowKey="studentId"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} học sinh`,
            }}
            size="small"
            bordered
          />
        )}
      </Spin>
    </Card>
  );
};

export default AllStudentsInCampaign;
