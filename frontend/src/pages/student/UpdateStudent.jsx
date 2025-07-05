import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Spin, Avatar, Typography, Row, Col, message, Tag, DatePicker } from 'antd';
import { SaveOutlined, UserOutlined, CalendarOutlined, TeamOutlined, BookOutlined, EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import studentService from '../../services/StudentService';
import userService from '../../services/UserService';
import dayjs from 'dayjs';
import './UpdateStudent.css';

const { Title, Text } = Typography;
const { Option } = Select;

const UpdateStudent = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [parentName, setParentName] = useState('');
  const [form] = Form.useForm();

  // Fetch student data
  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const response = await studentService.getAllStudents(config);
      const studentData = response.data.find(s => s.studentId === parseInt(studentId));
      
      if (studentData) {
        // Convert date for DatePicker - backend sends yob field
        const formattedStudent = {
          ...studentData,
          dob: studentData.yob ? dayjs(studentData.yob) : (studentData.dob ? dayjs(studentData.dob) : null),
        };
        setStudent(formattedStudent);
        form.setFieldsValue(formattedStudent);

        // Fetch parent name
        const usersResponse = await userService.getAllUsers(config);
        const parent = usersResponse.data.find(u => u.id === studentData.parentId);
        setParentName(parent ? parent.fullName : 'Không xác định');
      } else {
        message.error('Không tìm thấy thông tin học sinh');
      }
    } catch (error) {
      message.error('Không thể tải thông tin học sinh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
    // eslint-disable-next-line
  }, [studentId]);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      // Chuẩn hóa dữ liệu gửi lên backend
      const updateData = {
        fullName: values.fullName,
        yob: values.dob ? values.dob.format('YYYY-MM-DD') : null,
        gender: values.gender,
        className: values.className,
        parentId: student.parentId
      };

      await studentService.updateStudent(studentId, updateData, config);
      message.success('Cập nhật thông tin học sinh thành công!');
      setTimeout(() => {
        navigate('/danhsachhocsinh');
      }, 1500);
    } catch (error) {
      message.error('Không thể cập nhật thông tin học sinh');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !student) {
    return (
      <div className="update-student-loading">
        <Spin size="large" tip="Đang tải thông tin học sinh..." />
      </div>
    );
  }

  return (
    <div className="update-student-page">
      <Card className="update-student-header-card">
        <div className="header-content">
          <Avatar size={48} icon={<EditOutlined />} className="header-avatar" />
          <div className="header-text">
            <Title level={2} className="header-title">
              Cập nhật thông tin học sinh
            </Title>
            <Text className="header-description">
              Chỉnh sửa thông tin chi tiết của học sinh
            </Text>
          </div>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/danhsachhocsinh')}
            size="large"
            className="back-btn"
          >
            Quay lại
          </Button>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="form-card" title="Thông tin học sinh" extra={<EditOutlined />}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              requiredMark={false}
              className="student-form"
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span><UserOutlined /> Họ và tên</span>}
                    name="fullName"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                  >
                    <Input
                      placeholder="Nhập họ và tên học sinh"
                      size="large"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span><CalendarOutlined /> Ngày sinh</span>}
                    name="dob"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                  >
                    <DatePicker
                      placeholder="Chọn ngày sinh"
                      size="large"
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      disabledDate={(current) => {
                        // Disable future dates and dates before 1900
                        return current && (current > dayjs().endOf('day') || current < dayjs('1900-01-01'));
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span><TeamOutlined /> Giới tính</span>}
                    name="gender"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                  >
                    <Select placeholder="Chọn giới tính" size="large">
                      <Option value="Nam">Nam</Option>
                      <Option value="Nữ">Nữ</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span><BookOutlined /> Lớp</span>}
                    name="className"
                    rules={[{ required: true, message: 'Vui lòng nhập tên lớp!' }]}
                  >
                    <Input
                      placeholder="Nhập tên lớp"
                      size="large"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item className="form-actions">
                <Row gutter={12}>
                  <Col>
                    <Button
                      size="large"
                      onClick={() => navigate('/danhsachhocsinh')}
                      className="cancel-btn"
                    >
                      Hủy
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      icon={<SaveOutlined />}
                      className="submit-btn"
                    >
                      Cập nhật
                    </Button>
                  </Col>
                </Row>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="student-info-card" title="Thông tin hiện tại">
            {student ? (
              <div className="student-current-info">
                <Avatar size={64} icon={<UserOutlined />} className="student-avatar" />
                <div className="student-details">
                  <Title level={4} className="student-name">{student.fullName}</Title>
                  <div className="student-meta">
                    <Tag color="blue" className="info-tag">
                      <CalendarOutlined /> Năm sinh: {student.yob}
                    </Tag>
                    <Tag color="green" className="info-tag">
                      <TeamOutlined /> {student.gender}
                    </Tag>
                    <Tag color="purple" className="info-tag">
                      <BookOutlined /> {student.className}
                    </Tag>
                  </div>
                  <div className="parent-info-section">
                    <Text strong>Phụ huynh:</Text>
                    <Text className="parent-name">{parentName}</Text>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-student">
                <Text type="secondary">Đang tải thông tin...</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UpdateStudent;