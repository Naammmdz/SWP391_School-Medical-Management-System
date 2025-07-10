import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Alert, Spin, Typography, Space, Row, Col, Table, Tag, Select, Modal, Tooltip, message, Avatar } from 'antd';
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
  WomanOutlined,
  PhoneOutlined
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
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' }
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
  
  // State for delete modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

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

  //Get parent phone number from users list
const getParentPhone = (parentId) => {
  if (!parentId) {
    console.log('No parentId provided');
    return 'Không có thông tin';
  }
  
  const parent = users.find(user => user.id === parentId);
  console.log('Found parent:', parent); // Debug log
  
  if (!parent) {
    console.log(`Parent with ID ${parentId} not found in users:`, users);
    return 'Không tìm thấy';
  }
  
  // Try different possible field names for phone number
  const phoneNumber = parent.phoneNumber || parent.phone || parent.phoneNo || parent.tel;
  console.log('Phone number:', phoneNumber); // Debug log
  
  return phoneNumber || 'Không có số điện thoại';
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
    
    // Normalize gender for filtering
    const normalizeGender = (gender) => {
      if (gender === 'Male' || gender === 'Nam') return 'Nam';
      if (gender === 'Female' || gender === 'Nữ') return 'Nữ';
      return gender;
    };
    
    const matchesGender = !filter.gender || normalizeGender(student.gender) === filter.gender;
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

  // Show delete confirmation
  const showDeleteConfirm = (studentId, studentName) => {
    console.log('showDeleteConfirm called:', studentId, studentName);
    
    // Try using state-based modal first
    setStudentToDelete({ id: studentId, name: studentName });
    // Need delete local storage student
    localStorage.removeItem('selectedStudentId');
    localStorage.removeItem('selectedStudentInfo');
    setDeleteModalVisible(true);
  };
  
  // Handle actual deletion
  const handleDelete = async () => {
    if (!studentToDelete) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      message.error('Không tìm thấy token xác thực.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await studentService.deleteStudent(studentToDelete.id, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Delete response:', response);
      message.success('Xóa học sinh thành công!');
      setDeleteModalVisible(false);
      setStudentToDelete(null);
      
      // Refresh the list
      await fetchData();
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      message.error('Không thể xóa học sinh. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete student with fallback
  const deleteStudent = (studentId, studentName) => {
    console.log('Delete button clicked - ID:', studentId, 'Name:', studentName);
    
    if (!studentId) {
      message.error('Không tìm thấy học sinh để xóa.');
      return;
    }
    
    // Try modal first
    try {
      showDeleteConfirm(studentId, studentName);
    } catch (error) {
      console.error('Modal error:', error);
      // Fallback to window.confirm
      const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa học sinh "${studentName}"?\n\nHành động này không thể hoàn tác!`);
      if (confirmed) {
        setStudentToDelete({ id: studentId, name: studentName });
        handleDelete();
      }
    }
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
    <div style={{ 
      maxWidth: 1200, 
      margin: '0 auto', 
      padding: '24px',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ 
        marginBottom: 32, 
        marginTop: 50,
        padding: '20px 24px',
        background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
        borderRadius: 16,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
        <Col>
          <Space direction="vertical" size={4}>
            <Title level={2} style={{ 
              margin: 0, 
              color: '#15803d',
              fontSize: 28,
              fontWeight: 600
            }}>
              <TeamOutlined style={{ marginRight: 12 }} />
              Danh sách học sinh
            </Title>
            <Text style={{ color: '#8c8c8c', fontSize: 14 }}>
              Quản lý thông tin {filteredStudents.length} học sinh trong hệ thống
            </Text>
          </Space>
        </Col>
        {/* <Col>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="large"
            onClick={navigateToCreateStudent}
            style={{ 
              borderRadius: 8,
              background: '#15803d',
              borderColor: '#15803d',
              boxShadow: '0 2px 4px rgba(21,128,61,0.2)',
              height: 44
            }}
          >
            Thêm học sinh mới
          </Button>
        </Col> */}
      </Row>

      {/* Filter Form */}
      <Card
        style={{ 
          marginBottom: 24, 
          borderRadius: 16, 
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: 'none'
        }}
        bodyStyle={{ padding: '28px 32px' }}
      >
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Title level={4} style={{ 
              margin: 0, 
              color: '#262626',
              fontSize: 18,
              fontWeight: 600
            }}>
              <SearchOutlined style={{ marginRight: 8, color: '#15803d' }} />
              Tìm kiếm và lọc
            </Title>
            <Tag color="green" style={{ margin: 0 }}>
              {filteredStudents.length} kết quả
            </Tag>
          </div>
          
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
                style={{ 
                  width: '100%', 
                  borderRadius: 8
                }}
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
                style={{ 
                  borderRadius: 8,
                  border: '1px solid #d9d9d9'
                }}
                size="large"
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Space>
                <Button
                  icon={<ClearOutlined />}
                  onClick={handleClearFilter}
                  style={{ 
                    borderRadius: 8,
                    background: '#fff',
                    borderColor: '#d9d9d9',
                    color: '#595959'
                  }}
                  size="large"
                >
                  Xóa bộ lọc
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
      <Card 
        style={{ 
          borderRadius: 16, 
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          border: 'none',
          overflow: 'hidden'
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f0f0f0',
          background: '#fafafa'
        }}>
          <Title level={4} style={{ 
            margin: 0,
            color: '#262626',
            fontSize: 18,
            fontWeight: 600
          }}>
            <TeamOutlined style={{ marginRight: 8, color: '#15803d' }} />
            Danh sách học sinh
          </Title>
        </div>
        <Table 
          dataSource={filteredStudents}
          loading={loading}
          rowKey={(record) => record.studentId}
          locale={{
            emptyText: (
              <div style={{ padding: '40px 0' }}>
                <TeamOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                <p style={{ marginTop: 16, color: '#8c8c8c' }}>Không có học sinh nào trong hệ thống.</p>
              </div>
            )
          }}
          rowClassName={(record, index) => index % 2 === 0 ? 'even-row' : 'odd-row'}
          columns={[
            {
              title: 'Họ và tên',
              dataIndex: 'fullName',
              key: 'fullName',
              render: (text) => (
                <Space>
                  <Avatar 
                    size="small" 
                    style={{ backgroundColor: '#15803d' }}
                  >
                    {text.charAt(0).toUpperCase()}
                  </Avatar>
                  <strong style={{ color: '#262626' }}>{text}</strong>
                </Space>
              )
            },
            {
              title: 'Ngày sinh',
              dataIndex: 'dob',
              key: 'dob',
              render: (date) => (
                <span style={{ color: '#595959' }}>
                  <CalendarOutlined style={{ marginRight: 4, color: '#8c8c8c' }} />
                  {formatDate(date)}
                </span>
              )
            },
            {
              title: 'Giới tính',
              dataIndex: 'gender',
              key: 'gender',
              render: (gender) => {
                // Handle both English and Vietnamese gender values
                const isNam = gender === 'Male' || gender === 'Nam';
                return (
                  <Tag 
                    color={isNam ? 'blue' : 'pink'}
                    icon={isNam ? <ManOutlined /> : <WomanOutlined />}
                  >
                    {isNam ? 'Nam' : 'Nữ'}
                  </Tag>
                );
              }
            },
            {
              title: 'Lớp',
              dataIndex: 'className',
              key: 'className',
              render: (className) => (
                <Tag 
                  color="green"
                  style={{ 
                    borderRadius: 6,
                    padding: '2px 12px',
                    fontSize: 13
                  }}
                >
                  <HomeOutlined style={{ marginRight: 4 }} />
                  {className}
                </Tag>
              )
            },
            // Parent information
            {
              title: 'Phụ huynh',
              dataIndex: 'parentId',
              key: 'parentId',
              render: (parentId) => (
                <span style={{ color: '#595959' }}>
                  <UserOutlined style={{ marginRight: 4, color: '#8c8c8c' }} />
                  {getParentName(parentId)}
                </span>
              )
              
            },
            {
  title: 'Số điện thoại phụ huynh',
  dataIndex: 'parentId',
  key: 'parentPhone',
  render: (parentId) => {
    const phoneNumber = getParentPhone(parentId);
    return (
      <span style={{ color: '#595959' }}>
        <PhoneOutlined style={{ marginRight: 4, color: '#8c8c8c' }} />
        {phoneNumber}
      </span>
    );
  }
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
                      danger
                      shape="circle"
                      icon={<DeleteOutlined />}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Delete button clicked:', record.studentId, record.fullName);
                        deleteStudent(record.studentId, record.fullName);
                      }}
                    />
                  </Tooltip>
                </Space>
              ),
            },
          ]}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => (
              <span style={{ color: '#595959' }}>
                Hiển thị <strong>{range[0]}-{range[1]}</strong> trong tổng số <strong>{total}</strong> học sinh
              </span>
            ),
            pageSizeOptions: ['10', '20', '50', '100']
          }}
        />
      </Card>
      
      {/* Delete Confirmation Modal */}
      <Modal
        title="Xác nhận xóa học sinh"
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setStudentToDelete(null);
        }}
        okText="Xác nhận xóa"
        cancelText="Hủy"
        okType="danger"
        confirmLoading={loading}
      >
        {studentToDelete && (
          <div>
            <p>Bạn có chắc chắn muốn xóa học sinh:</p>
            <p><strong>{studentToDelete.name}</strong></p>
            <p style={{ color: 'red' }}>Hành động này không thể hoàn tác!</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentList;
