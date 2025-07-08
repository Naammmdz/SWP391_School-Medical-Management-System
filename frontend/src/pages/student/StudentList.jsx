import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Alert, Spin, Typography, Space, Row, Col, Table, Tag, Select, Modal, Tooltip } from 'antd';
import { 
  UserOutlined,
  SearchOutlined,
  ClearOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  UserAddOutlined,
  CalendarOutlined,
  HomeOutlined,
  ManOutlined,
  WomanOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import studentService from '../../services/StudentService';
import userService from '../../services/UserService';
import './StudentList.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const genderOptions = [
  { value: '', label: 'Giới tính' },
  { value: 'Male', label: 'Nam' },
  { value: 'Female', label: 'Nữ' }
];

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Filter states
  const [filter, setFilter] = useState({
    fullName: '',
    className: '',
    gender: '',
    parentName: ''
  });

  // Fetch both students and users data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        params : { size: 1000 }, 
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      // Fetch students
      const studentsResponse = await studentService.getAllStudents(config);
      setStudents(studentsResponse.data);
      console.log('Fetched students:', studentsResponse.data);
      localStorage.setItem('students', JSON.stringify(studentsResponse.data)); 
       
      // Fetch users to get parent information
      const usersResponse = await userService.getAllUsers(config);
      setUsers(usersResponse.data);
      
    } catch (error) {
      setError('Không thể tải dữ liệu học sinh');
    } finally {
      setLoading(false);
    }
  };

  // Get parent name from users list
  const getParentName = (parentId) => {
    const parent = users.find(user => user.id === parentId);
    return parent ? parent.fullName : 'Không xác định';
  };

  // Format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Filter students based on current filter state
  const filteredStudents = students.filter(student => {
    const matchesName = !filter.fullName || student.fullName.toLowerCase().includes(filter.fullName.toLowerCase());
    const matchesClass = !filter.className || student.className.toLowerCase().includes(filter.className.toLowerCase());
    const matchesGender = !filter.gender || student.gender === filter.gender;
    const parentName = getParentName(student.parentId);
    const matchesParent = !filter.parentName || parentName.toLowerCase().includes(filter.parentName.toLowerCase());
    
    return matchesName && matchesClass && matchesGender && matchesParent;
  });

  // Navigate to update student
  const navigateToUpdateStudent = (studentId) => {
    navigate(`/capnhathocsinh/${studentId}`);
  };

  // Navigate to create student
  const navigateToCreateStudent = () => {
    navigate('/taomoihocsinh');
  };

  // Delete student
  const deleteStudent = async (studentId, studentName) => {
    confirm({
      title: 'Xác nhận xóa học sinh',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa học sinh "${studentName}"?`,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      okType: 'danger',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          await studentService.deleteStudent(studentId, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setSuccessMessage('Xóa học sinh thành công!');
          setTimeout(() => setSuccessMessage(null), 3000);
          fetchData(); // Refresh the list
        } catch (error) {
          setError('Không thể xóa học sinh');
          setTimeout(() => setError(null), 3000);
        }
      }
    });
  };

  // Handle filter change
  const handleFilterChange = (field, value) => {
    setFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle clear filter
  const handleClearFilter = () => {
    setFilter({
      fullName: '',
      className: '',
      gender: '',
      parentName: ''
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 32, marginTop: 50 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#15803d' }}>
            <TeamOutlined style={{ marginRight: 12 }} />
            Danh sách học sinh
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="large"
            onClick={navigateToCreateStudent}
            style={{ borderRadius: 8 }}
          >
            Thêm học sinh
          </Button>
        </Col>
      </Row>

      {/* Filter Form */}
      <Card
        style={{ 
          marginBottom: 24, 
          borderRadius: 16, 
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)'
        }}
        bodyStyle={{ padding: 24 }}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Title level={4} style={{ margin: 0, color: '#15803d' }}>
            <SearchOutlined style={{ marginRight: 8 }} />
            Tìm kiếm và lọc học sinh
          </Title>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Họ và tên học sinh"
                value={filter.fullName}
                onChange={(e) => handleFilterChange('fullName', e.target.value)}
                prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                style={{ borderRadius: 8 }}
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Lớp"
                value={filter.className}
                onChange={(e) => handleFilterChange('className', e.target.value)}
                prefix={<HomeOutlined style={{ color: '#8c8c8c' }} />}
                style={{ borderRadius: 8 }}
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="Chọn giới tính"
                value={filter.gender || undefined}
                onChange={(value) => handleFilterChange('gender', value || '')}
                style={{ width: '100%', borderRadius: 8 }}
                size="large"
                allowClear
              >
                {genderOptions.slice(1).map(option => (
                  <Option key={option.value} value={option.value}>{option.label}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Input
                placeholder="Tên phụ huynh"
                value={filter.parentName}
                onChange={(e) => handleFilterChange('parentName', e.target.value)}
                prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                style={{ borderRadius: 8 }}
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space>
                <Button
                  icon={<ClearOutlined />}
                  onClick={handleClearFilter}
                  style={{ borderRadius: 8 }}
                  size="large"
                >
                  Xóa lọc
                </Button>
              </Space>
            </Col>
          </Row>
        </Space>
      </Card>

      {successMessage && (
        <Alert
          message={successMessage}
          type="success"
          showIcon
          style={{ marginBottom: 24, borderRadius: 12 }}
        />
      )}

      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24, borderRadius: 12 }}
        />
      )}

      {/* Students table */}
      <Card style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
        <Table 
          dataSource={filteredStudents}
          loading={loading}
          rowKey={(record) => record.studentId}
          locale={{
            emptyText: 'Không có học sinh nào trong hệ thống.'
          }}
          columns={[
            {
              title: 'Họ và tên',
              dataIndex: 'fullName',
              key: 'fullName',
              render: (text) => <strong style={{ color: '#2563eb' }}>{text}</strong>
            },
            {
              title: 'Ngày sinh',
              dataIndex: 'dob',
              key: 'dob',
              render: (date) => (
                <span>
                  <CalendarOutlined style={{ marginRight: 4, color: '#8c8c8c' }} />
                  {formatDate(date)}
                </span>
              )
            },
            {
              title: 'Giới tính',
              dataIndex: 'gender',
              key: 'gender',
              render: (gender) => (
                <Tag 
                  color={gender === 'Male' ? 'blue' : 'pink'}
                  icon={gender === 'Male' ? <ManOutlined /> : <WomanOutlined />}
                >
                  {gender === 'Male' ? 'Nam' : 'Nữ'}
                </Tag>
              )
            },
            {
              title: 'Lớp',
              dataIndex: 'className',
              key: 'className',
              render: (className) => (
                <Tag color="green">
                  <HomeOutlined style={{ marginRight: 4 }} />
                  {className}
                </Tag>
              )
            },
            {
              title: 'Phụ huynh',
              dataIndex: 'parentId',
              key: 'parentId',
              render: (parentId) => (
                <span>
                  <UserOutlined style={{ marginRight: 4, color: '#8c8c8c' }} />
                  {getParentName(parentId)}
                </span>
              )
            },
            {
              title: 'Hành động',
              key: 'action',
              render: (text, record) => (
                <Space size="middle">
                  <Tooltip title="Chỉnh sửa">
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<EditOutlined />}
                      onClick={() => navigateToUpdateStudent(record.studentId)}
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Button
                      type="danger"
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={() => deleteStudent(record.studentId, record.fullName)}
                    />
                  </Tooltip>
                </Space>
              ),
            },
          ]}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} học sinh`
          }}
        />
      </Card>
    </div>
  );
};

export default StudentList;
