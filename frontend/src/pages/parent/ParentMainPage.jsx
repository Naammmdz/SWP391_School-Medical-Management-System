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
  TrophyOutlined,
  AlertOutlined
} from '@ant-design/icons';
import { Box } from '@mui/material';
import studentService from '../../services/StudentService';
import NotificationPopup from '../../components/NotificationPopup';
import './ParentMainPage.css';

const { Title, Paragraph, Text } = Typography;

const ParentMainPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showQuickGuide, setShowQuickGuide] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

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
        // Handle if student is deleted
        if (students.length === 0) {
          localStorage.removeItem('selectedStudentId');
          localStorage.removeItem('selectedStudentInfo');
        }
        if (students.length > 0) {

          const savedStudentId = localStorage.getItem('selectedStudentId');
          const savedStudent = students.find(s => s.studentId.toString() === savedStudentId) || students[0];
          setSelectedStudent(savedStudent);
          localStorage.setItem('selectedStudentId', savedStudent.studentId.toString());
          localStorage.setItem('selectedStudentInfo', JSON.stringify(savedStudent));
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
    localStorage.setItem('selectedStudentInfo', JSON.stringify(student));
    message.success(`Đã chọn học sinh ${student.fullName}`);
  };

  // Modern gradient menu items with parent-specific routes
  const modernMenuItems = [
    {
      id: 'health',
      title: 'Thông tin hồ sơ khỏe bé yêu',
      subtitle: 'Xem hồ sơ sức khỏe của bé',
      icon: '💖',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      shadowColor: 'rgba(16, 185, 129, 0.3)',
      path: '/parent/hososuckhoe',
      priority: 'high'
    },
    {
      id: 'medicine',
      title: 'Lịch uống thuốc của bé',
      subtitle: 'Gửi thuốc khi bé cần uống',
      icon: '💊',
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
      shadowColor: 'rgba(20, 184, 166, 0.3)',
      path: '/parent/donthuocdagui',
      priority: 'high'
    },
    {
      id: 'notifications',
      title: 'Thông báo tiêm chủng của bé',
      subtitle: 'Tin tức và thông báo quan trọng',
      icon: '🔔',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      shadowColor: 'rgba(6, 182, 212, 0.3)',
      path: '/parent/thongbaotiemchung',
      priority: 'urgent'
    },
    {
      id: 'results',
      title: 'Kết quả kiểm tra sức khỏe bé',
      subtitle: 'Xem kết quả khám sức khỏe',
      icon: '📈',
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      shadowColor: 'rgba(34, 197, 94, 0.3)',
      path: '/parent/ketquakiemtradinhkyhocsinh',
      priority: 'medium'
    },
    {
      id: 'vaccination',
      title: 'Kết quả tiêm phòng cho bé',
      subtitle: 'Lịch tiêm và kết quả tiêm phòng',
      icon: '💉',
      gradient: 'linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%)',
      shadowColor: 'rgba(45, 212, 191, 0.3)',
      path: '/parent/ketquatiemchunghocsinh',
      priority: 'medium'
    },
    {
      id: 'schedule',
      title: 'Lịch kiểm tra sức khỏe bé',
      subtitle: 'Lịch khám sức khỏe cho bé',
      icon: '📅',
      gradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
      shadowColor: 'rgba(34, 197, 94, 0.3)',
      path: '/parent/kiemtradinhkyhocsinh',
      priority: 'medium'
    },
    {
      id: 'schedule',
      title: 'Sự cố y tế sức khỏe',
      subtitle: 'Các hoạt động chăm sóc sức khỏe',
      icon: <AlertOutlined style={{ fontSize: 28, color: '#d4380d' }} />,
      gradient: 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)',
      shadowColor: 'rgba(15, 118, 110, 0.3)',
      path: '/parent/sukienytehocsinh',
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
      <div className="modern-parent-page" style={{ backgroundColor: '#f0fdf4', minHeight: '100vh', padding: '30px' }}>
        {/* Simple header with greeting */}
        <div className="page-header">
          <Title level={2} style={{ color: '#059669', marginBottom: '8px', fontSize: '32px' }}>
            👋 Xin chào {user.fullName || 'bạn'}!
          </Title>
          <Text style={{ color: '#065f46', fontSize: '30px', fontWeight: '500' }}>
            Quản lý sức khỏe bé con của bạn
          </Text>

          {/*/!* Notification icon with unread count *!/*/}
          {/*<Box style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }} onClick={() => setShowNotificationPopup(true)}>*/}
          {/*  <BellOutlined style={{ fontSize: '28px', color: '#14b8a6' }} />*/}
          {/*  {modernMenuItems.find(item => item.id === 'notifications').notificationCount > 0 && (*/}
          {/*    <span style={{*/}
          {/*      position: 'absolute',*/}
          {/*      top: '-5px',*/}
          {/*      right: '-10px',*/}
          {/*      background: '#ff4d4f',*/}
          {/*      color: 'white',*/}
          {/*      borderRadius: '50%',*/}
          {/*      padding: '2px 6px',*/}
          {/*      fontSize: '12px',*/}
          {/*      fontWeight: 'bold'*/}
          {/*    }}>*/}
          {/*      {modernMenuItems.find(item => item.id === 'notifications').notificationCount}*/}
          {/*    </span>*/}
          {/*  )}*/}
          {/*</Box>*/}
          <NotificationPopup open={showNotificationPopup} onClose={() => setShowNotificationPopup(false)} />
        </div>

        {/* Modern Student Selection */}
        {studentList.length > 0 && (
            <div className="student-section" style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '30px',
              margin: '30px 0',
              boxShadow: '0 8px 32px rgba(5, 150, 105, 0.1)',
              border: '2px solid #dcfce7'
            }}>
              <div className="section-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{
                  display: 'inline-block',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: '50%',
                  padding: '15px',
                  marginBottom: '15px'
                }}>
                  <UserOutlined style={{ fontSize: '32px', color: 'white' }} />
                </div>
                <Title level={2} style={{
                  color: '#059669',
                  fontSize: '32px',
                  fontWeight: '700',
                  margin: '10px 0 8px 0'
                }}>Con em của bạn</Title>
                <Text style={{
                  color: '#065f46',
                  fontSize: '18px',
                  display: 'block',
                  fontWeight: '500'
                }}>Chọn bé để theo dõi sức khỏe</Text>
              </div>
              <Row gutter={[24, 24]} justify="center">
                {studentList.map((student) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={student.studentId}>
                      <div
                          style={{
                            background: selectedStudent?.studentId === student.studentId
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                            borderRadius: '20px',
                            padding: '25px 20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            border: selectedStudent?.studentId === student.studentId
                                ? '3px solid #065f46'
                                : '2px solid #a7f3d0',
                            boxShadow: selectedStudent?.studentId === student.studentId
                                ? '0 12px 40px rgba(5, 150, 105, 0.3)'
                                : '0 8px 25px rgba(5, 150, 105, 0.1)',
                            transform: selectedStudent?.studentId === student.studentId
                                ? 'translateY(-5px)'
                                : 'translateY(0)',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                          onClick={() => handleStudentSelect(student)}
                      >
                        {/* Background decoration */}
                        <div style={{
                          position: 'absolute',
                          top: '-20px',
                          right: '-20px',
                          width: '60px',
                          height: '60px',
                          background: selectedStudent?.studentId === student.studentId
                              ? 'rgba(255, 255, 255, 0.1)'
                              : 'rgba(5, 150, 105, 0.1)',
                          borderRadius: '50%',
                          zIndex: 1
                        }} />

                        {/* Avatar section */}
                        <div style={{ marginBottom: '15px', position: 'relative', zIndex: 2 }}>
                          <div style={{
                            width: '80px',
                            height: '80px',
                            background: selectedStudent?.studentId === student.studentId
                                ? 'rgba(255, 255, 255, 0.2)'
                                : 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            border: '4px solid',
                            borderColor: selectedStudent?.studentId === student.studentId
                                ? 'rgba(255, 255, 255, 0.3)'
                                : '#10b981',
                            position: 'relative'
                          }}>
                            {student.gender === 'Nam' ? (
                                <div style={{ fontSize: '36px' }}>👦🏻</div>
                            ) : (
                                <div style={{ fontSize: '36px' }}>👧🏻</div>
                            )}

                            {/* Selected indicator */}
                            {selectedStudent?.studentId === student.studentId && (
                                <div style={{
                                  position: 'absolute',
                                  top: '-5px',
                                  right: '-5px',
                                  width: '25px',
                                  height: '25px',
                                  background: '#22c55e',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '2px solid white'
                                }}>
                                  <CheckCircleOutlined style={{ fontSize: '14px', color: 'white' }} />
                                </div>
                            )}
                          </div>
                        </div>

                        {/* Student info */}
                        <div style={{ position: 'relative', zIndex: 2 }}>
                          <h4 style={{
                            color: selectedStudent?.studentId === student.studentId ? 'white' : '#059669',
                            fontSize: '18px',
                            fontWeight: '700',
                            margin: '10px 0 5px 0',
                            textShadow: selectedStudent?.studentId === student.studentId ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                          }}>{student.fullName}</h4>

                          <div style={{
                            background: selectedStudent?.studentId === student.studentId
                                ? 'rgba(255, 255, 255, 0.2)'
                                : '#10b981',
                            color: selectedStudent?.studentId === student.studentId ? 'white' : 'white',
                            padding: '6px 12px',
                            borderRadius: '15px',
                            fontSize: '14px',
                            fontWeight: '600',
                            margin: '8px 0',
                            display: 'inline-block'
                          }}>
                            📚 Lớp {student.className}
                          </div>

                          <div style={{
                            color: selectedStudent?.studentId === student.studentId ? 'rgba(255, 255, 255, 0.9)' : '#065f46',
                            fontSize: '14px',
                            fontWeight: '600',
                            marginTop: '10px'
                          }}>
                            {selectedStudent?.studentId === student.studentId ? (
                                <span>✨ Đã chọn</span>
                            ) : (
                                <span>👆 Nhấn để chọn</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                ))}
              </Row>
            </div>
        )}

        {/* Modern Menu Grid */}
        <div className="menu-section" style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          padding: '30px',
          margin: '30px 0',
          boxShadow: '0 8px 32px rgba(5, 150, 105, 0.1)',
          border: '2px solid #dcfce7'
        }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '50%',
              padding: '15px',
              marginBottom: '15px'
            }}>
              <HeartOutlined style={{ fontSize: '32px', color: 'white' }} />
            </div>
            <Title level={2} style={{
              color: '#059669',
              fontSize: '32px',
              fontWeight: '700',
              margin: '10px 0 8px 0'
            }}>Quản lý sức khỏe bé yêu</Title>
            <Text style={{
              color: '#065f46',
              fontSize: '18px',
              display: 'block',
              fontWeight: '500'
            }}>Chọn tính năng phù hợp với bé</Text>
          </div>
          <Row gutter={[24, 24]}>
            {modernMenuItems.map((item, index) => (
                <Col xs={24} sm={12} lg={8} key={index}>
                  <div
                      onClick={() => navigate(item.path)}
                      style={{
                        background: item.gradient,
                        borderRadius: '20px',
                        padding: '25px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: `0 12px 35px ${item.shadowColor}`,
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        position: 'relative',
                        overflow: 'hidden',
                        minHeight: '180px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = `0 20px 50px ${item.shadowColor}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = `0 12px 35px ${item.shadowColor}`;
                      }}
                  >
                    {/* Background decoration */}
                    <div style={{
                      position: 'absolute',
                      top: '-30px',
                      right: '-30px',
                      width: '80px',
                      height: '80px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      zIndex: 1
                    }} />

                    <div style={{
                      position: 'absolute',
                      bottom: '-20px',
                      left: '-20px',
                      width: '60px',
                      height: '60px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '50%',
                      zIndex: 1
                    }} />

                    {/* Notification badge */}
                    {item.hasNotification && (
                        <div style={{
                          position: 'absolute',
                          top: '15px',
                          right: '15px',
                          background: '#ff4757',
                          color: 'white',
                          borderRadius: '50%',
                          width: '25px',
                          height: '25px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          zIndex: 3,
                          animation: 'pulse 2s infinite'
                        }}>
                          {item.notificationCount}
                        </div>
                    )}

                    {/* Icon section */}
                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      marginBottom: '15px'
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '28px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        {typeof item.icon === 'string' ? (
                            <span style={{ fontSize: '28px' }}>{item.icon}</span>
                        ) : (
                            item.icon
                        )}
                      </div>
                    </div>

                    {/* Content section */}
                    <div style={{
                      position: 'relative',
                      zIndex: 2,
                      color: 'white',
                      flex: 1
                    }}>
                      <h3 style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        margin: '0 0 8px 0',
                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        lineHeight: '1.3'
                      }}>{item.title}</h3>
                      <p style={{
                        fontSize: '14px',
                        margin: '0',
                        opacity: '0.9',
                        lineHeight: '1.4',
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}>{item.subtitle}</p>
                    </div>

                    {/* Arrow indicator */}
                    <div style={{
                      position: 'absolute',
                      bottom: '20px',
                      right: '20px',
                      zIndex: 2
                    }}>
                      <div style={{
                        width: '35px',
                        height: '35px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <ArrowRightOutlined style={{
                          fontSize: '16px',
                          color: 'white',
                          fontWeight: 'bold'
                        }} />
                      </div>
                    </div>

                    {/* Priority indicator */}
                    {item.priority === 'urgent' && (
                        <div style={{
                          position: 'absolute',
                          top: '15px',
                          left: '15px',
                          background: 'rgba(255, 255, 255, 0.2)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: '10px',
                          fontSize: '10px',
                          fontWeight: 'bold',
                          zIndex: 3,
                          textTransform: 'uppercase',
                          border: '1px solid rgba(255, 255, 255, 0.3)'
                        }}>

                        </div>
                    )}
                  </div>
                </Col>
            ))}
          </Row>
        </div>

        {/* Modern Help Section */}
        <div className="help-section" style={{ backgroundColor: 'white' }}>
          <div className="section-header">
            <Title level={2} className="section-title" style={{ color: '#1565c0', fontSize: '28px' }}>🆘 Cần giúp đỡ?</Title>
            <Text className="section-subtitle" style={{ color: '#666', fontSize: '16px' }}>Chúng tôi luôn sẵn sàng hỗ trợ phụ huynh</Text>
          </div>
          <Row gutter={[20, 20]}>
            <Col xs={24} sm={12}>
              <div
                  className="help-card emergency"
                  onClick={() => window.open('tel:0123456789')}
              >
                <div className="help-icon">📞</div>
                <div className="help-content">
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Liên hệ nhà trường</h3>
                  <p style={{ fontSize: '16px' }}>Hotline: 0123-456-789 (24/7)</p>
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
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Hướng dẫn sử dụng</h3>
                  <p style={{ fontSize: '16px' }}>Cách sử dụng ứng dụng đơn giản</p>
                </div>
                <div className="help-status guide-status">🎓 Học hỏi</div>
              </div>
            </Col>
          </Row>
        </div>

        {/* Simple Guide Modal */}
        <Modal
            title="🎆 Hướng dẫn sử dụng"
            open={showQuickGuide}
            onCancel={() => setShowQuickGuide(false)}
            footer={[
              <Button
                  key="ok"
                  type="primary"
                  onClick={() => setShowQuickGuide(false)}
                  style={{
                    background: '#52c41a',
                    borderColor: '#52c41a',
                    fontSize: '16px',
                    height: '40px',
                    borderRadius: '8px'
                  }}
              >
                🚀 Đã hiểu rồi!
              </Button>
            ]}
            width={600}
            centered
            className="simple-guide-modal"
        >
          <div style={{ padding: '20px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <Text style={{ fontSize: '18px', color: '#666' }}>
                ✨ Chỉ 3 bước đơn giản để sử dụng ứng dụng ✨
              </Text>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '20px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                background: 'white'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#52c41a',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>1</div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>👨‍👩‍👧‍👦 Chọn con em</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Nhấn vào thẻ của con để chọn học sinh</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '20px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                background: 'white'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#1890ff',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>2</div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>🌈 Chọn chức năng</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Nhấn vào các thẻ màu sắc để sử dụng</p>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '20px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                background: 'white'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#ff4d4f',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>3</div>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>🆘 Cần giúp?</h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Gọi điện hotline: 0123-456-789</p>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: '25px',
              padding: '15px',
              background: '#fff8e1',
              border: '1px solid #ffcc02',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <Text style={{ fontSize: '14px', color: '#333' }}>
                💡 <strong>Mẹo:</strong> Các thẻ màu tươi sáng là chức năng quan trọng!
              </Text>
            </div>
          </div>
        </Modal>
      </div>
  );
};

export default ParentMainPage;
