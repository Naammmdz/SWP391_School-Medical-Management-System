import React, { useState } from 'react';
import { Button, Card, Table, message, Input, Space, Typography, Tag } from 'antd';
import { TeamOutlined, SearchOutlined } from '@ant-design/icons';
import VaccinationService from '../../services/VaccinationService';

const { Title, Text } = Typography;

const CampaignStudentsExample = () => {
  const [campaignId, setCampaignId] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllStudents = async () => {
    if (!campaignId) {
      message.error('Vui lòng nhập ID chiến dịch');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Method 1: Get only basic student info
      const basicResponse = await VaccinationService.getAllStudentsInCampaign(campaignId, config);
      console.log('Basic students:', basicResponse.data);

      // Method 2: Get students with vaccination status
      const statusResponse = await VaccinationService.getStudentsWithVaccinationStatus(campaignId, config);
      console.log('Students with status:', statusResponse.data);
      
      setStudents(Array.isArray(statusResponse.data) ? statusResponse.data : []);
      message.success(`Tìm thấy ${statusResponse.data?.length || 0} học sinh trong chiến dịch`);
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Không thể tải danh sách học sinh');
      setStudents([]);
    }
    setLoading(false);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'studentId',
      key: 'studentId',
      width: 80,
    },
    {
      title: 'Tên học sinh',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Lớp',
      dataIndex: 'className',
      key: 'className',
      render: (className) => <Tag color="blue">{className}</Tag>,
    },
    {
      title: 'Xác nhận PH',
      dataIndex: 'parentConfirmation',
      key: 'parentConfirmation',
      render: (confirmed) => {
        if (confirmed === true) {
          return <Tag color="green">Đã xác nhận</Tag>;
        } else if (confirmed === false) {
          return <Tag color="red">Đã từ chối</Tag>;
        } else {
          return <Tag color="orange">Chưa phản hồi</Tag>;
        }
      },
    },
    {
      title: 'Kết quả tiêm',
      dataIndex: 'result',
      key: 'result',
      render: (result) => {
        if (!result || result === 'PENDING') {
          return <Tag color="orange">Chưa tiêm</Tag>;
        }
        const config = {
          'SUCCESS': { color: 'green', text: 'Thành công' },
          'FAILED': { color: 'red', text: 'Thất bại' },
          'DELAYED': { color: 'orange', text: 'Hoãn' }
        };
        const { color, text } = config[result] || { color: 'default', text: result };
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <Card 
      title={
        <Space>
          <TeamOutlined style={{ color: '#52c41a' }} />
          <span>Demo: Lấy tất cả học sinh trong chiến dịch</span>
        </Space>
      }
      style={{ margin: '24px 0' }}
    >
      <Space.Compact style={{ width: '100%', marginBottom: 16 }}>
        <Input
          placeholder="Nhập ID chiến dịch tiêm chủng..."
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
          onPressEnter={fetchAllStudents}
          style={{ flex: 1 }}
        />
        <Button 
          type="primary" 
          icon={<SearchOutlined />}
          onClick={fetchAllStudents}
          loading={loading}
        >
          Tìm kiếm
        </Button>
      </Space.Compact>

      <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
        API này sẽ trả về tất cả học sinh đủ điều kiện tham gia chiến dịch (theo target group) 
        cùng với trạng thái xác nhận của phụ huynh và kết quả tiêm (nếu có).
      </Text>

      {students.length > 0 && (
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
          title={() => (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={5} style={{ margin: 0 }}>
                Danh sách học sinh trong chiến dịch #{campaignId}
              </Title>
              <Space>
                <Tag color="green">
                  Đã xác nhận: {students.filter(s => s.parentConfirmation === true).length}
                </Tag>
                <Tag color="red">
                  Đã từ chối: {students.filter(s => s.parentConfirmation === false).length}
                </Tag>
                <Tag color="orange">
                  Chưa phản hồi: {students.filter(s => s.parentConfirmation !== true && s.parentConfirmation !== false).length}
                </Tag>
              </Space>
            </div>
          )}
        />
      )}
    </Card>
  );
};

export default CampaignStudentsExample;
