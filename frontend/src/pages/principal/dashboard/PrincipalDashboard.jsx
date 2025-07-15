import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Space, Statistic, Progress, Badge } from 'antd';
import { 
  UserOutlined, 
  MedicineBoxOutlined, 
  HeartOutlined, 
  TrophyOutlined,
  TeamOutlined,
  BarChartOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import './PrincipalDashboard.css';

const { Title, Text } = Typography;

const PrincipalDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 1250,
    healthyStudents: 1100,
    vaccinatedStudents: 1200,
    pendingHealthChecks: 50,
    medicalEvents: 15,
    activeNurses: 8
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'vaccination', message: 'Chiến dịch tiêm chủng HPV hoàn thành', time: '2 giờ trước' },
    { id: 2, type: 'health-check', message: 'Kiểm tra sức khỏe định kỳ khối 10', time: '1 ngày trước' },
    { id: 3, type: 'medical-event', message: 'Sự kiện y tế: Học sinh bị ngất tại lớp 11A', time: '2 ngày trước' },
    { id: 4, type: 'report', message: 'Báo cáo sức khỏe tháng 11 đã được tạo', time: '3 ngày trước' }
  ]);

  const healthPercentage = Math.round((stats.healthyStudents / stats.totalStudents) * 100);
  const vaccinationPercentage = Math.round((stats.vaccinatedStudents / stats.totalStudents) * 100);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'vaccination':
        return <MedicineBoxOutlined style={{ color: '#52c41a' }} />;
      case 'health-check':
        return <HeartOutlined style={{ color: '#1890ff' }} />;
      case 'medical-event':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'report':
        return <BarChartOutlined style={{ color: '#722ed1' }} />;
      default:
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }
  };

  return (
    <div className="principal-dashboard">
      <div className="dashboard-header">
        <Title level={2} style={{ margin: 0, color: '#15803d' }}>
          <TrophyOutlined style={{ marginRight: 12 }} />
          Bảng điều khiển Hiệu trưởng
        </Title>
        <Text type="secondary">Tổng quan về tình hình y tế trường học</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng số học sinh"
              value={stats.totalStudents}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Học sinh khỏe mạnh"
              value={stats.healthyStudents}
              prefix={<HeartOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
              suffix={`(${healthPercentage}%)`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã tiêm chủng"
              value={stats.vaccinatedStudents}
              prefix={<MedicineBoxOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1' }}
              suffix={`(${vaccinationPercentage}%)`}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Sự kiện y tế"
              value={stats.medicalEvents}
              prefix={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Health Overview */}
      <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
        <Col xs={24} md={12}>
          <Card 
            title={
              <Space>
                <HeartOutlined style={{ color: '#52c41a' }} />
                <span>Tình hình sức khỏe</span>
              </Space>
            }
          >
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Học sinh khỏe mạnh</span>
                <span>{healthPercentage}%</span>
              </div>
              <Progress percent={healthPercentage} status="active" strokeColor="#52c41a" />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span>Tỷ lệ tiêm chủng</span>
                <span>{vaccinationPercentage}%</span>
              </div>
              <Progress percent={vaccinationPercentage} status="active" strokeColor="#722ed1" />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card 
            title={
              <Space>
                <BarChartOutlined style={{ color: '#1890ff' }} />
                <span>Hoạt động gần đây</span>
              </Space>
            }
          >
            <div className="recent-activities">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-message">{activity.message}</div>
                    <div className="activity-time">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card 
            hoverable
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => window.location.href = '/quanlytiemchung'}
          >
            <MedicineBoxOutlined style={{ fontSize: 48, color: '#722ed1', marginBottom: 16 }} />
            <Title level={4}>Quản lý Tiêm chủng</Title>
            <Text type="secondary">Theo dõi và quản lý các chiến dịch tiêm chủng</Text>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card 
            hoverable
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => window.location.href = '/danhsachkiemtradinhky'}
          >
            <HeartOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
            <Title level={4}>Kiểm tra Sức khỏe</Title>
            <Text type="secondary">Quản lý các đợt kiểm tra sức khỏe định kỳ</Text>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card 
            hoverable
            style={{ textAlign: 'center', cursor: 'pointer' }}
            onClick={() => window.location.href = '/sukienyte'}
          >
            <ExclamationCircleOutlined style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }} />
            <Title level={4}>Sự kiện Y tế</Title>
            <Text type="secondary">Theo dõi và xử lý các sự kiện y tế</Text>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PrincipalDashboard;
