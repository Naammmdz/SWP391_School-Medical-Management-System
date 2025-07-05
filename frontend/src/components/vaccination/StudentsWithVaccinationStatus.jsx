import React, { useState, useEffect } from 'react';
import { Table, Card, Typography, message, Spin, Empty, Tag, Button, Space, Tooltip, Row, Col } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ExclamationCircleOutlined,
  ReloadOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';
import VaccinationService from '../../services/VaccinationService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const StudentsWithVaccinationStatus = ({ campaignId, campaignInfo }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Helper function to determine parent confirmation status
  const getParentConfirmationStatus = (parentConfirmation, record) => {
    // Handle backend logic where false is set for both "no record" and "declined"
    if (parentConfirmation === true) {
      return 'confirmed';
    } else if (parentConfirmation === false) {
      // Check if this is a "no record" case vs "actually declined"
      // If vaccinationId is 0 or result is "PENDING", it's likely a "no record" case
      if (record && (record.vaccinationId === 0 || record.result === 'PENDING')) {
        return 'pending';
      } else {
        return 'declined';
      }
    } else {
      // null, undefined, or any other value means pending
      return 'pending';
    }
  };

  useEffect(() => {
    if (campaignId) {
      fetchStudentsWithStatus();
    }
  }, [campaignId]);

  const fetchStudentsWithStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await VaccinationService.getStudentsWithVaccinationStatus(campaignId, config);
      const studentsData = Array.isArray(response.data) ? response.data : [];
      
      // Debug: Log the data to see parentConfirmation values
      console.log('Students with vaccination status data:', studentsData);
      studentsData.forEach((student, index) => {
        console.log(`Student ${index + 1}:`, {
          studentName: student.studentName,
          parentConfirmation: student.parentConfirmation,
          parentConfirmationType: typeof student.parentConfirmation
        });
      });
      
      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students with vaccination status:', error);
      message.error('Không thể tải danh sách học sinh với trạng thái tiêm chủng');
      setStudents([]);
    }
    setLoading(false);
  };

  // Calculate statistics using helper function
  const stats = {
    total: students.length,
    confirmed: students.filter(s => getParentConfirmationStatus(s.parentConfirmation, s) === 'confirmed').length,
    declined: students.filter(s => getParentConfirmationStatus(s.parentConfirmation, s) === 'declined').length,
    pending: students.filter(s => getParentConfirmationStatus(s.parentConfirmation, s) === 'pending').length,
    vaccinated: students.filter(s => s.result && s.result !== 'PENDING').length
  };
  
  // Debug: Log statistics calculation
  console.log('Statistics calculation:', {
    total: stats.total,
    confirmed: stats.confirmed,
    declined: stats.declined,
    pending: stats.pending,
    studentBreakdown: students.map(s => ({
      name: s.studentName,
      parentConfirmation: s.parentConfirmation,
      type: typeof s.parentConfirmation,
      vaccinationId: s.vaccinationId,
      result: s.result,
      determinedStatus: getParentConfirmationStatus(s.parentConfirmation, s)
    }))
  });

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
      dataIndex: 'studentName',
      key: 'studentName',
      render: (studentName) => (
        <div>
          <UserOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          <Text strong>{studentName}</Text>
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
      title: 'Xác nhận PH',
      dataIndex: 'parentConfirmation',
      key: 'parentConfirmation',
      width: 130,
      render: (parentConfirmation, record) => {
        // Debug log for each render
        console.log('Rendering parentConfirmation:', {
          studentName: record.studentName,
          parentConfirmation,
          type: typeof parentConfirmation,
          isNull: parentConfirmation === null,
          isUndefined: parentConfirmation === undefined,
          status: getParentConfirmationStatus(parentConfirmation, record),
          vaccinationId: record.vaccinationId,
          result: record.result
        });
        
        // Use helper function to determine status
        const status = getParentConfirmationStatus(parentConfirmation, record);
        
        switch (status) {
          case 'confirmed':
            return (
              <Tag color="green" icon={<CheckCircleOutlined />}>
                Đã xác nhận
              </Tag>
            );
          case 'declined':
            return (
              <Tag color="red" icon={<CloseCircleOutlined />}>
                Đã từ chối
              </Tag>
            );
          case 'pending':
          default:
            return (
              <Tag color="orange" icon={<ExclamationCircleOutlined />}>
                Chưa phản hồi
              </Tag>
            );
        }
      },
    },
    {
      title: 'Kết quả tiêm',
      dataIndex: 'result',
      key: 'result',
      width: 120,
      render: (result) => {
        if (!result || result === 'PENDING') {
          return <Tag color="orange">Chưa tiêm</Tag>;
        }
        const config = {
          'SUCCESS': { color: 'green', text: 'Thành công' },
          'COMPLETED': { color: 'green', text: 'Hoàn thành' },
          'FAILED': { color: 'red', text: 'Thất bại' },
          'DELAYED': { color: 'orange', text: 'Hoãn' },
          'CANCELLED': { color: 'red', text: 'Hủy' }
        };
        const { color, text } = config[result] || { color: 'default', text: result };
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Ngày tiêm',
      dataIndex: 'vaccinationDate',
      key: 'vaccinationDate',
      width: 120,
      render: (date) => {
        if (!date) return <Text type="secondary">—</Text>;
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: {
        showTitle: false,
      },
      render: (notes) => (
        <Tooltip placement="topLeft" title={notes}>
          {notes || <Text type="secondary">—</Text>}
        </Tooltip>
      ),
    },
  ];

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <MedicineBoxOutlined style={{ marginRight: 8, color: '#52c41a' }} />
            <span>Học sinh với trạng thái tiêm chủng</span>
            {students.length > 0 && (
              <Tag color="blue" style={{ marginLeft: 12 }}>
                {students.length} học sinh
              </Tag>
            )}
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchStudentsWithStatus}
            loading={loading}
            size="small"
          >
            Làm mới
          </Button>
        </div>
      }
      extra={
        campaignInfo && (
          <Text type="secondary">
            Chiến dịch: {campaignInfo.campaignName}
          </Text>
        )
      }
      style={{ marginTop: 16 }}
    >
      {/* Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f0f5ff', borderRadius: '4px', border: '1px solid #adc6ff' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
              {stats.total}
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>Tổng số</Text>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f6ffed', borderRadius: '4px', border: '1px solid #b7eb8f' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
              {stats.confirmed}
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>Đã xác nhận</Text>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#fff1f0', borderRadius: '4px', border: '1px solid #ffccc7' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4d4f' }}>
              {stats.declined}
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>Từ chối</Text>
          </div>
        </Col>
        <Col span={6}>
          <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#fff2e8', borderRadius: '4px', border: '1px solid #ffbb96' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fa8c16' }}>
              {stats.pending}
            </div>
            <Text type="secondary" style={{ fontSize: '12px' }}>Chưa phản hồi</Text>
          </div>
        </Col>
      </Row>

      <Spin spinning={loading}>
        {students.length === 0 && !loading ? (
          <Empty
            description="Không có dữ liệu học sinh cho chiến dịch này"
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
            scroll={{ x: 1000 }}
          />
        )}
      </Spin>
    </Card>
  );
};

export default StudentsWithVaccinationStatus;
