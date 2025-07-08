import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Row, Col, Space, Avatar, Badge, Alert, Modal, Spin, message, Grid, Statistic, Divider } from 'antd';
import { 
  UserOutlined, 
  HeartOutlined, 
  MedicineBoxOutlined, 
  CalendarOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  PhoneOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  HomeOutlined,
  NotificationOutlined,
  BookOutlined,
  ArrowRightOutlined,
  MenuOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import studentService from '../../services/StudentService';
import './ParentMainPage.css';

const { Title, Paragraph, Text } = Typography;

const ParentMainPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showQuickGuide, setShowQuickGuide] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    if (user.userRole === 'ROLE_PARENT') {
      try {
        const response = await studentService.getStudentByParentID(user.userId, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const students = Array.isArray(response.data) ? response.data : [];
        setStudentList(students);
        
        if (students.length > 0) {
          const savedStudentId = localStorage.getItem('selectedStudentId');
          const savedStudent = students.find(s => s.studentId.toString() === savedStudentId) || students[0];
          setSelectedStudent(savedStudent);
          localStorage.setItem('selectedStudentId', savedStudent.studentId.toString());
          localStorage.setItem('students', JSON.stringify(students));
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    }
    setLoading(false);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    localStorage.setItem('selectedStudentId', student.studentId.toString());
    message.success(`Đã chọn học sinh ${student.fullName}`);
  };

  // Modern gradient menu items with parent-specific routes
  const modernMenuItems = [
    {
      id: 'health',
      title: 'Sức khỏe con em',
      subtitle: 'Theo dõi tình trạng sức khỏe',
      icon: '💖',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      shadowColor: 'rgba(102, 126, 234, 0.3)',
      path: '/parent/hososuckhoe',
      priority: 'high'
    },
    {
      id: 'medicine',
      title: 'Quản lý thuốc',
      subtitle: 'Khai báo và theo dõi thuốc',
      icon: '💊',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      shadowColor: 'rgba(240, 147, 251, 0.3)',
      path: '/parent/khaibaothuoc',
      priority: 'high'
    },
    {
      id: 'notifications',
      title: 'Thông báo',
      subtitle: 'Tin tức và thông báo mới',
      icon: '🔔',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      shadowColor: 'rgba(79, 172, 254, 0.3)',
      path: '/parent/thongbaotiemchung',
      hasNotification: true,
      notificationCount: 3,
      priority: 'urgent'
    },
    {
      id: 'results',
      title: 'Kết quả khám',
      subtitle: 'Xem kết quả kiểm tra sức khỏe',
      icon: '📈',
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      shadowColor: 'rgba(67, 233, 123, 0.3)',
      path: '/parent/ketquakiemtradinhkyhocsinh',
      priority: 'medium'
    },
    {
      id: 'vaccination',
      title: 'Tiêm chủng',
      subtitle: 'Lịch sử và kết quả tiêm phòng',
      icon: '💉',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      shadowColor: 'rgba(250, 112, 154, 0.3)',
      path: '/parent/ketquatiemchunghocsinh',
      priority: 'medium'
    },
    {
      id: 'schedule',
      title: 'Lịch hẹn',
      subtitle: 'Lịch khám bệnh sắp tới',
      icon: '📅',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      shadowColor: 'rgba(168, 237, 234, 0.3)',
      path: '/parent/kiemtradinhkyhocsinh',
      priority: 'medium'
    }
  ];

  // System-themed menu (keeping for reference)
  const systemMenuItems = [
    {
      id: 'health',
      title: 'Sức khỏe con em',
      subtitle: 'Theo dõi tình trạng sức khỏe',
      icon: '💖',
      bgColor: '#4caf50',
      lightColor: '#e8f5e9',
      path: '/hososuckhoe',
      priority: 'high'
    },
    {
      id: 'medicine',
      title: 'Quản lý thuốc',
      subtitle: 'Khai báo và theo dõi thuốc',
      icon: '💊',
      bgColor: '#2196f3',
      lightColor: '#e3f2fd',
      path: '/khaibaothuoc',
      priority: 'high'
    },
    {
      id: 'notifications',
      title: 'Thông báo',
      subtitle: 'Tin tức và thông báo mới',
      icon: '🔔',
      bgColor: '#ff9800',
      lightColor: '#fff3e0',
      path: '/thongbaotiemchung',
      hasNotification: true,
      notificationCount: 3,
      priority: 'urgent'
    },
    {
      id: 'results',
      title: 'Kết quả khám',
      subtitle: 'Xem kết quả kiểm tra sức khỏe',
      icon: '📈',
      bgColor: '#9c27b0',
      lightColor: '#f3e5f5',
      path: '/ketquakiemtradinhkyhocsinh',
      priority: 'medium'
    },
    {
      id: 'vaccination',
      title: 'Tiêm chủng',
      subtitle: 'Lịch sử và kết quả tiêm phòng',
      icon: '💉',
      bgColor: '#00bcd4',
      lightColor: '#e0f2f1',
      path: '/ketquatiemchunghocsinh',
      priority: 'medium'
    },
    {
      id: 'schedule',
      title: 'Lịch hẹn',
      subtitle: 'Lịch khám bệnh sắp tới',
      icon: '📅',
      bgColor: '#f44336',
      lightColor: '#ffebee',
      path: '/kiemtradinhkyhocsinh',
      priority: 'medium'
    }
  ];

  const helpItems = [
    {
      title: '📞 Gọi điện cho nhà trường',
      description: 'Liên hệ trực tiếp khi cần hỗ trợ',
      icon: '📞',
      action: () => window.open('tel:0123456789')
    },
    {
      title: '❓ Hướng dẫn sử dụng',
      description: 'Xem hướng dẫn chi tiết',
      icon: '❓',
      action: () => setShowQuickGuide(true)
    }
  ];

  const quickActions = [
    {
      title: 'Thêm con mới',
      icon: <UserOutlined />,
      color: '#52c41a',
      onClick: () => navigate('/parent/students')
    },
    {
      title: 'Liên hệ nhà trường',
      icon: <QuestionCircleOutlined />,
      color: '#1890ff',
      onClick: () => navigate('/parent/contact')
    }
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 16 }}>Đang tải thông tin...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-parent-page" style={{ backgroundColor: 'white', minHeight: '100vh', padding: '20px' }}>
      {/* Simple header with greeting */}
      <div className="page-header">
        <Title level={2} style={{ color: '#333', marginBottom: '8px' }}>
          👋 Xin chào {user.fullName ? user.fullName.split(' ').slice(-1)[0] : 'bạn'}!
        </Title>
        <Text style={{ color: '#666', fontSize: '16px' }}>
          Quản lý sức khỏe con em
        </Text>
        
        {/* Simple notification alert */}
        {modernMenuItems.find(item => item.hasNotification) && (
          <Alert
            message="3 thông báo mới!"
            description="Bạn có thông báo chưa đọc."
            type="info"
            showIcon
            closable
            style={{ marginTop: '16px' }}
            onClick={() => navigate('/parent/thongbaotiemchung')}
            className="clickable-alert"
          />
        )}
      </div>

      {/* Modern Student Selection */}
      {studentList.length > 0 && (
        <div className="student-section" style={{ backgroundColor: 'white' }}>
          <div className="section-header">
            <Title level={2} className="section-title" style={{ color: '#333' }}>👨‍👩‍👧‍👦 Con em của bạn</Title>
            <Text className="section-subtitle" style={{ color: '#666' }}>Chọn học sinh để xem thông tin</Text>
          </div>
          <Row gutter={[20, 20]} justify="center">
            {studentList.map((student) => (
              <Col xs={24} sm={12} md={8} lg={6} key={student.studentId}>
                <div 
                  className={`student-card-modern ${selectedStudent?.studentId === student.studentId ? 'selected' : ''}`}
                  onClick={() => handleStudentSelect(student)}
                >
                  <div className="student-avatar">
                    <div className="avatar-circle">
                      {student.gender === 'Male' ? '👦' : '👧'}
                    </div>
                    {selectedStudent?.studentId === student.studentId && (
                      <div className="selected-badge">✓</div>
                    )}
                  </div>
                  <div className="student-info">
                    <h4 className="student-name">{student.fullName}</h4>
                    <p className="student-class">Lớp {student.className}</p>
                    <div className="student-status">
                      {selectedStudent?.studentId === student.studentId ? '✨ Đã chọn' : 'Nhấn để chọn'}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* Modern Menu Grid */}
      <div className="menu-section" style={{ backgroundColor: 'white' }}>
        <div className="section-header">
          <Title level={2} className="section-title" style={{ color: '#333' }}>🌈 Chức năng chính</Title>
          <Text className="section-subtitle" style={{ color: '#666' }}>Chọn tính năng bạn cần sử dụng</Text>
        </div>
        <Row gutter={[24, 24]}>
          {modernMenuItems.map((item, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <div 
                className={`menu-card-modern priority-${item.priority}`}
                onClick={() => navigate(item.path)}
                style={{
                  background: item.gradient,
                  boxShadow: `0 10px 30px ${item.shadowColor}`
                }}
              >
                {item.hasNotification && (
                  <div className="notification-pulse">
                    <span className="badge-count">{item.notificationCount}</span>
                  </div>
                )}
                
                <div className="card-icon">
                  <span className="icon-emoji">{item.icon}</span>
                </div>
                
                <div className="card-content">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-subtitle">{item.subtitle}</p>
                </div>
                
                <div className="card-arrow">
                  <ArrowRightOutlined />
                </div>
                
                <div className="card-glow"></div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Modern Help Section */}
      <div className="help-section" style={{ backgroundColor: 'white' }}>
        <div className="section-header">
          <Title level={2} className="section-title" style={{ color: '#333' }}>🆘 Cần hỗ trợ?</Title>
          <Text className="section-subtitle" style={{ color: '#666' }}>Chúng tôi luôn sẵn sàng giúp đỡ bạn</Text>
        </div>
        <Row gutter={[20, 20]}>
          <Col xs={24} sm={12}>
            <div 
              className="help-card emergency"
              onClick={() => window.open('tel:0123456789')}
            >
              <div className="help-icon">📞</div>
              <div className="help-content">
                <h3>Gọi điện ngay</h3>
                <p>Liên hệ hotline: 0123-456-789</p>
              </div>
              <div className="help-status emergency-status">⚡ Khẩn cấp</div>
            </div>
          </Col>
          <Col xs={24} sm={12}>
            <div 
              className="help-card guide"
              onClick={() => setShowQuickGuide(true)}
            >
              <div className="help-icon">📚</div>
              <div className="help-content">
                <h3>Hướng dẫn</h3>
                <p>Xem cách sử dụng ứng dụng</p>
              </div>
              <div className="help-status guide-status">🎓 Học hỏi</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Modern Guide Modal */}
      <Modal
        title={null}
        open={showQuickGuide}
        onCancel={() => setShowQuickGuide(false)}
        footer={null}
        width={650}
        centered
        className="modern-guide-modal"
      >
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-emoji">🎆</div>
            <Title level={2} className="modal-title">Sử dụng siêu dễ!</Title>
            <Text className="modal-subtitle">Chỉ 3 bước đơn giản</Text>
          </div>
          
          <div className="guide-steps">
            <div className="step-card step-1">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>👨‍👩‍👧‍👦 Chọn con em</h4>
                <p>Nhấn vào thẻ của con để chọn học sinh</p>
              </div>
            </div>
            
            <div className="step-card step-2">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>🌈 Chọn chức năng</h4>
                <p>Nhấn vào các thẻ màu sắc để sử dụng</p>
              </div>
            </div>
            
            <div className="step-card step-3">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>🆘 Cần giúp?</h4>
                <p>Gọi điện hotline khi cần hỗ trợ</p>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <div className="tip-box">
              <span className="tip-icon">💡</span>
              <Text>Mẹo: Các thẻ màu tươi sáng là chức năng quan trọng!</Text>
            </div>
            <Button 
              type="primary" 
              size="large"
              className="got-it-button"
              onClick={() => setShowQuickGuide(false)}
            >
              🚀 Đã hiểu rồi!
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ParentMainPage;
