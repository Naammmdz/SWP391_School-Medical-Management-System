import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, Form, Input, Button, Alert, Spin, Typography, Space, Row, Col, message, Table, Tag, Select, Divider, Modal, Descriptions } from 'antd';
import { 
  HeartOutlined, 
  UserOutlined, 
  SearchOutlined, 
  ClearOutlined, 
  SaveOutlined, 
  EyeOutlined,
  FileTextOutlined,
  MedicineBoxOutlined,
  ProfileOutlined,
  EditOutlined,
  InfoCircleOutlined,
  CloseOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import { Search, XCircle } from 'lucide-react';
import Header from '../../../components/Header';

import './HealthRecord.css';
import HealthRecordService from '../../../services/HealthRecordService';
import studentService from '../../../services/StudentService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const HealthRecord = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const accessToken = localStorage.getItem('token');
  const isNurseOrAdmin =
    user &&
    user.userRole &&
    (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_NURSE');
  const isParent = user && user.userRole === 'ROLE_PARENT';

  // Nếu là học sinh thì lấy studentId từ user
  const studentId = user && user.studentId ? user.studentId : null;

  // State cho danh sách hồ sơ (nurse/admin)
  const [healthRecords, setHealthRecords] = useState([]);
  // State cho 1 hồ sơ (student/parent)
  const { register, handleSubmit, setValue, formState: { errors }, reset, control } = useForm({
    defaultValues: {
      studentName: '',
      studentClass: '',
      allergies: '',
      chronicDiseases: '',
      treatmentHistory: '',
      eyesight: '',
      hearing: '',
      bloodType: '',
      weight: '',
      height: '',
      notes: ''
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hasRecord, setHasRecord] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Search states for Nurse/Admin
  const [searchFullName, setSearchFullName] = useState('');
  const [searchClassName, setSearchClassName] = useState('');
  const [availableClasses, setAvailableClasses] = useState([]);
  
  // Modal states for detailed view
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Lấy id học sinh đã chọn từ localStorage (dành cho phụ huynh)
  const selectedStudentId = isParent ? localStorage.getItem('selectedStudentId') : null;

  console.log('selectedStudentId:', selectedStudentId);

  // Fetch all health records for the table display (unfiltered)
  const fetchAllHealthRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await HealthRecordService.getAllHealthRecord(config);
      setHealthRecords(res.data || []);
    } catch (err) {
      console.error("Error fetching all health records:", err);
      setError('Không thể tải danh sách hồ sơ sức khỏe!');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  const fetchFilteredHealthRecords = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const body = {};
      if (filters.fullName) body.name = filters.fullName;
      if (filters.className) body.className = filters.className;
      const res = await HealthRecordService.filterHealthRecord(body, config);
      setHealthRecords(res.data || []);
    } catch (err) {
      console.error("Error fetching filtered health records:", err);
      setError('Không thể tải danh sách hồ sơ sức khỏe!');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  // Fetch all classes for the dropdown independently
  const fetchAllClasses = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await HealthRecordService.getAllHealthRecord(config); 
      const classes = new Set(res.data.map(record => record.studentClass).filter(Boolean));
      setAvailableClasses(Array.from(classes));
    } catch (err) {
      console.error("Error fetching all classes:", err);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isNurseOrAdmin) {
      fetchAllHealthRecords();
      fetchAllClasses();
    } else if (isParent) {
      if (!selectedStudentId) {
        setIsLoading(false);
        setError('Vui lòng chọn học sinh để xem hồ sơ sức khỏe!');
        reset();
        return;
      }
      setIsLoading(true);
      HealthRecordService.getHealthRecordByStudentId(selectedStudentId, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
        .then((res) => {
          if (res.data && Object.keys(res.data).length > 0) {
            setHasRecord(true);
            reset({
              studentName: res.data.studentName || '',
              studentClass: res.data.studentClass || '',
              allergies: res.data.allergies || '',
              chronicDiseases: res.data.chronicDiseases || '',
              treatmentHistory: res.data.treatmentHistory || '',
              eyesight: res.data.eyesight || '',
              hearing: res.data.hearing || '',
              bloodType: res.data.bloodType || '',
              weight: res.data.weight || '',
              height: res.data.height || '',
              notes: res.data.notes || ''
            });
          } else {
            setHasRecord(false);
            reset();
          }
          setIsLoading(false);
        })
        .catch(() => {
          setHasRecord(false);
          setIsLoading(false);
          setError('Không thể tải hồ sơ sức khỏe của học sinh!');
          reset();
        });
    } else if (studentId) {
      HealthRecordService.getHealthRecordByStudentId(studentId, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
          if (res.data && Object.keys(res.data).length > 0) {
            setHasRecord(true);
            reset({
              studentName: res.data.studentName || '',
              studentClass: res.data.studentClass || '',
              allergies: res.data.allergies || '',
              chronicDiseases: res.data.chronicDiseases || '',
              treatmentHistory: res.data.treatmentHistory || '',
              eyesight: res.data.eyesight || '',
              hearing: res.data.hearing || '',
              bloodType: res.data.bloodType || '',
              weight: res.data.weight || '',
              height: res.data.height || '',
              notes: res.data.notes || ''
            });
          } else {
            setHasRecord(false);
            reset();
          }
          setIsLoading(false);
        })
        .catch(() => {
          setHasRecord(false);
          setIsLoading(false);
          reset();
        });
    } else {
      setError('Không tìm thấy thông tin học sinh!');
      setIsLoading(false);
    }
  }, [
    reset,
    isNurseOrAdmin,
    isParent,
    studentId,
    accessToken,
    formSubmitted,
    fetchAllHealthRecords,
    fetchAllClasses,
    selectedStudentId
  ]);

  // Xử lý submit cho học sinh/phụ huynh
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      let idToUpdate = studentId;
      if (isParent) {
        idToUpdate = selectedStudentId;
      }
      await HealthRecordService.updateHealthRecord(
        idToUpdate,
        data,
        {   headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 1500);
    } catch (err) {
      setError('Có lỗi xảy ra khi lưu hồ sơ. Vui lòng thử lại sau.');
    }
    setIsLoading(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchFullName || searchClassName) {
      fetchFilteredHealthRecords({ fullName: searchFullName, className: searchClassName });
    } else {
      fetchAllHealthRecords();
    }
  };

  const handleClearSearch = () => {
    setSearchFullName('');
    setSearchClassName('');
    fetchAllHealthRecords();
  };
  
  // Modal handlers
  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  if (isLoading && (!isNurseOrAdmin || (isNurseOrAdmin && healthRecords.length === 0 && !error))) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24, marginTop: 50 }}>
        <Spin size="large" />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text>Đang tải thông tin hồ sơ sức khỏe...</Text>
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 32, marginTop: 50 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#15803d' }}>
            <HeartOutlined style={{ marginRight: 12 }} />
            {isNurseOrAdmin
              ? 'Danh Sách Hồ Sơ Sức Khỏe Học Sinh'
              : isParent
                ? 'Hồ Sơ Sức Khỏe '
                : 'Hồ Sơ Sức Khỏe Học Sinh'}
          </Title>
        </Col>
      </Row>
      
      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          style={{ marginBottom: 24, borderRadius: 12 }}
        />
      )}

        {/* Y tá/admin xem danh sách */}
        {isNurseOrAdmin ? (
          <>
            {/* Search Section */}
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
                  Tìm kiếm hồ sơ sức khỏe
                </Title>
                
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={10}>
                    <Input
                      placeholder="Nhập tên học sinh"
                      value={searchFullName}
                      onChange={(e) => setSearchFullName(e.target.value)}
                      prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                      style={{ borderRadius: 8 }}
                      size="large"
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Select
                      placeholder="Chọn lớp"
                      value={searchClassName || undefined}
                      onChange={(value) => setSearchClassName(value || '')}
                      style={{ width: '100%', borderRadius: 8 }}
                      size="large"
                      allowClear
                    >
                      {availableClasses.map(className => (
                        <Option key={className} value={className}>
                          {className}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col xs={24} sm={24} md={6}>
                    <Space>
                      <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        onClick={handleSearchSubmit}
                        style={{ borderRadius: 8 }}
                        size="large"
                      >
                        Tìm kiếm
                      </Button>
                      {(searchFullName || searchClassName) && (
                        <Button
                          icon={<ClearOutlined />}
                          onClick={handleClearSearch}
                          style={{ borderRadius: 8 }}
                          size="large"
                        >
                          Xóa
                        </Button>
                      )}
                    </Space>
                  </Col>
                </Row>
              </Space>
            </Card>

            {/* Health Records Table */}
            <Card style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}>
              <Table 
                dataSource={healthRecords}
                loading={isLoading}
                rowKey={(record, index) => record.profileId || index}
                locale={{
                  emptyText: (searchFullName || searchClassName) 
                    ? 'Không tìm thấy hồ sơ sức khỏe nào phù hợp với điều kiện tìm kiếm.'
                    : 'Chưa có hồ sơ sức khỏe nào trong hệ thống.'
                }}
                columns={[
                  {
                    title: 'Học sinh',
                    key: 'studentInfo',
                    width: 150,
                    render: (_, record) => (
                      <div style={{ maxWidth: 130 }}>
                        <div style={{ 
                          fontWeight: 600, 
                          color: '#2563eb', 
                          fontSize: 13, 
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {record.studentName}
                        </div>
                        <div style={{ 
                          fontSize: 11, 
                          color: '#666', 
                          marginTop: 1,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {record.studentClass} • {record.studentGender || 'N/A'}
                        </div>
                      </div>
                    )
                  },
                  {
                    title: 'Trạng thái',
                    key: 'status',
                    width: 80,
                    align: 'center',
                    render: (_, record) => {
                      const hasIssues = (record.allergies && record.allergies.trim()) || 
                                       (record.chronicDiseases && record.chronicDiseases.trim());
                      
                      if (hasIssues) {
                        return (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                              width: 8, 
                              height: 8, 
                              borderRadius: '50%', 
                              backgroundColor: '#ff4d4f', 
                              margin: '0 auto 2px' 
                            }} />
                            <Text style={{ fontSize: 9, color: '#ff4d4f' }}>Cần chú ý</Text>
                          </div>
                        );
                      }
                      return (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            backgroundColor: '#52c41a', 
                            margin: '0 auto 2px' 
                          }} />
                          <Text style={{ fontSize: 9, color: '#52c41a' }}>Bình thường</Text>
                        </div>
                      );
                    }
                  },
                  {
                    title: '',
                    key: 'action',
                    width: 60,
                    align: 'center',
                    render: (_, record) => (
                      <Button 
                        type="link"
                        icon={<EyeOutlined />} 
                        size="small"
                        onClick={() => handleViewRecord(record)}
                        style={{ 
                          color: '#1890ff',
                          fontSize: 10,
                          padding: 0,
                          height: 'auto'
                        }}
                      >
                        Chi tiết
                      </Button>
                    )
                  }
                ]}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} hồ sơ`
                }}
              />
            </Card>
          </>
        ) : isParent ? (
          <>
            {/* Parent Form Section */}
            {selectedStudentId ? (
              <Card
                style={{ 
                  borderRadius: 16, 
                  boxShadow: '0 4px 16px rgba(0,0,0,0.07)', 
                  marginBottom: 32
                }}
                bodyStyle={{ padding: 32 }}
                title={
                  <Space>
                    <ProfileOutlined style={{ color: '#15803d' }} />
                    <span style={{ fontSize: 18, fontWeight: 600, color: '#15803d' }}>
                      Hồ sơ sức khỏe học sinh
                    </span>
                  </Space>
                }
              >
                {formSubmitted && (
                  <Alert
                    message="Thông tin đã được gửi thành công!"
                    type="success"
                    showIcon
                    style={{ marginBottom: 24, borderRadius: 12 }}
                  />
                )}
                {updateSuccess && (
                  <Alert
                    message="Cập nhật hồ sơ thành công!"
                    type="success"
                    showIcon
                    style={{ marginBottom: 24, borderRadius: 12 }}
                  />
                )}
                
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                  {/* Student Information Section */}
                  <Divider orientation="left" style={{ color: '#15803d', fontWeight: 600 }}>
                    <UserOutlined style={{ marginRight: 8 }} />
                    Thông tin học sinh
                  </Divider>
                  
                  <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item 
                        label="Họ và tên" 
                        validateStatus={errors.studentName ? 'error' : ''}
                        help={errors.studentName ? 'Vui lòng nhập họ tên' : ''}
                      >
                        <Controller
                          name="studentName"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Input 
                              {...field}
                              size="large"
                              placeholder="Nhập họ và tên học sinh"
                              prefix={<UserOutlined style={{ color: '#8c8c8c' }} />}
                              style={{ borderRadius: 8 }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item 
                        label="Lớp" 
                        validateStatus={errors.studentClass ? 'error' : ''}
                        help={errors.studentClass ? 'Vui lòng nhập lớp' : ''}
                      >
                        <Controller
                          name="studentClass"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Input 
                              {...field}
                              size="large"
                              placeholder="Nhập lớp học"
                              style={{ borderRadius: 8 }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Health Information Section */}
                  <Divider orientation="left" style={{ color: '#15803d', fontWeight: 600 }}>
                    <HeartOutlined style={{ marginRight: 8 }} />
                    Thông tin sức khỏe
                  </Divider>
                  
                  <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Dị ứng">
                        <Controller
                          name="allergies"
                          control={control}
                          render={({ field }) => (
                            <Input 
                              {...field}
                              size="large"
                              placeholder="Nhập thông tin dị ứng (nếu có)"
                              style={{ borderRadius: 8 }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Bệnh mãn tính">
                        <Controller
                          name="chronicDiseases"
                          control={control}
                          render={({ field }) => (
                            <Input 
                              {...field}
                              size="large"
                              placeholder="Nhập bệnh mãn tính (nếu có)"
                              style={{ borderRadius: 8 }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Lịch sử điều trị">
                        <Controller
                          name="treatmentHistory"
                          control={control}
                          render={({ field }) => (
                            <Input 
                              {...field}
                              size="large"
                              placeholder="Nhập lịch sử điều trị"
                              style={{ borderRadius: 8 }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Thị lực">
                        <Controller
                          name="eyesight"
                          control={control}
                          render={({ field }) => (
                            <Input 
                              {...field}
                              size="large"
                              placeholder="Tình trạng thị lực"
                              style={{ borderRadius: 8 }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Thính lực">
                        <Controller
                          name="hearing"
                          control={control}
                          render={({ field }) => (
                            <Input 
                              {...field}
                              size="large"
                              placeholder="Tình trạng thính lực"
                              style={{ borderRadius: 8 }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Nhóm máu">
                        <Controller
                          name="bloodType"
                          control={control}
                          render={({ field }) => (
                            <Select
                              {...field}
                              size="large"
                              placeholder="Chọn nhóm máu"
                              style={{ borderRadius: 8 }}
                              allowClear
                            >
                              <Option value="A">A</Option>
                              <Option value="B">B</Option>
                              <Option value="AB">AB</Option>
                              <Option value="O">O</Option>
                            </Select>
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Cân nặng (kg)">
                        <Controller
                          name="weight"
                          control={control}
                          render={({ field }) => (
                            <Input 
                              {...field}
                              type="number"
                              step="0.1"
                              size="large"
                              placeholder="Nhập cân nặng"
                              style={{ borderRadius: 8 }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Chiều cao (cm)">
                        <Controller
                          name="height"
                          control={control}
                          render={({ field }) => (
                            <Input 
                              {...field}
                              type="number"
                              step="0.1"
                              size="large"
                              placeholder="Nhập chiều cao"
                              style={{ borderRadius: 8 }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item label="Ghi chú">
                        <Controller
                          name="notes"
                          control={control}
                          render={({ field }) => (
                            <TextArea 
                              {...field}
                              rows={4}
                              placeholder="Thông tin bổ sung về sức khỏe của học sinh..."
                              style={{ borderRadius: 8 }}
                            />
                          )}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Submit Button */}
                  <Row justify="center" style={{ marginTop: 32 }}>
                    <Col>
                      <Button 
                        type="primary" 
                        htmlType="submit" 
                        size="large"
                        loading={isLoading}
                        icon={<SaveOutlined />}
                        style={{ 
                          borderRadius: 8, 
                          height: 48, 
                          minWidth: 160,
                          fontSize: 16,
                          fontWeight: 600
                        }}
                      >
                        {isLoading ? 'Đang lưu...' : 'Cập nhật hồ sơ'}
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card>
            ) : (
              <Alert
                message="Chưa chọn học sinh"
                description="Vui lòng chọn học sinh ở trang chính để xem hồ sơ sức khỏe!"
                type="warning"
                showIcon
                style={{ borderRadius: 12 }}
              />
            )}
          </>
        ) : (
          // Phụ huynh xem và cập nhật hồ sơ của con mình
          <>
            {formSubmitted && (
              <div className="success-message">
                <h2>Thông tin đã được gửi thành công!</h2>
              </div>
            )}
            {updateSuccess && (
              <div className="success-message">
                <h2>Cập nhật hồ sơ thành công!</h2>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="health-record-form">
              <div className="form-container">
                <div className="student-info-card">
                  <div className="info-card">
                    <h3>Thông tin học sinh</h3>
                    <div className="form-group">
                      <label>Họ và tên</label>
                      <input type="text" className="form-control" {...register("studentName", { required: true })} />
                      {errors.studentName && <span className="text-danger">Vui lòng nhập họ tên</span>}
                    </div>
                    <div className="form-group">
                      <label>Lớp</label>
                      <input type="text" className="form-control" {...register("studentClass", { required: true })} />
                      {errors.studentClass && <span className="text-danger">Vui lòng nhập lớp</span>}
                    </div>
                  </div>
                </div>

                <div className="health-info-column">
                  <div className="info-card">
                    <h3>Thông tin sức khỏe</h3>
                    <div className="health-info-grid">
                      <div className="form-group">
                        <label>Dị ứng</label>
                        <input type="text" className="form-control" {...register("allergies")} />
                      </div>
                      <div className="form-group">
                        <label>Bệnh mãn tính</label>
                        <input type="text" className="form-control" {...register("chronicDiseases")} />
                      </div>
                      <div className="form-group">
                        <label>Lịch sử điều trị</label>
                        <input type="text" className="form-control" {...register("treatmentHistory")} />
                      </div>
                      <div className="form-group">
                        <label>Thị lực</label>
                        <input type="text" className="form-control" {...register("eyesight")} />
                      </div>
                      <div className="form-group">
                        <label>Thính lực</label>
                        <input type="text" className="form-control" {...register("hearing")} />
                      </div>
                      <div className="form-group">
                        <label>Nhóm máu</label>
                        <input type="text" className="form-control" {...register("bloodType")} />
                      </div>
                      <div className="form-group">
                        <label>Cân nặng (kg)</label>
                        <input type="number" step="0.1" className="form-control" {...register("weight")} />
                      </div>
                      <div className="form-group">
                        <label>Chiều cao (cm)</label>
                        <input type="number" step="0.1" className="form-control" {...register("height")} />
                      </div>
                    </div>
                    <div className="form-group notes-section">
                      <label>Ghi chú</label>
                      <textarea className="form-control" {...register("notes")} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Đang lưu...' : 'Cập nhật hồ sơ'}
                </button>
              </div>
            </form>
          </>
        )}
        
        {/* Detailed Health Record Modal */}
        <Modal
          title={
            <Space>
              <HeartOutlined style={{ color: '#15803d' }} />
              <span style={{ fontSize: 18, fontWeight: 600, color: '#15803d' }}>
                Chi tiết hồ sơ sức khỏe
              </span>
            </Space>
          }
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={[
            <Button key="close" onClick={handleCloseModal} size="large">
              <CloseOutlined /> Đóng
            </Button>
          ]}
          width={800}
          style={{ top: 20 }}
        >
          {selectedRecord && (
            <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <Descriptions
                title="Thông tin học sinh"
                bordered
                column={{ xs: 1, sm: 2 }}
                size="middle"
                style={{ marginBottom: 24 }}
              >
                <Descriptions.Item 
                  label={<span><UserOutlined /> Họ và tên</span>}
                  span={2}
                >
                  <Text strong style={{ fontSize: 16, color: '#2563eb' }}>
                    {selectedRecord.studentName}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Lớp">
                  <Tag color="blue" style={{ fontSize: 14 }}>
                    {selectedRecord.studentClass}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Giới tính">
                  <Tag color={selectedRecord.studentGender === 'Nam' ? 'geekblue' : 'magenta'}>
                    {selectedRecord.studentGender || 'Chưa cập nhật'}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>

              <Descriptions
                title="Thông tin sức khỏe chi tiết"
                bordered
                column={{ xs: 1, sm: 2 }}
                size="middle"
                style={{ marginBottom: 24 }}
              >
                <Descriptions.Item 
                  label={<span><MedicineBoxOutlined /> Dị ứng</span>}
                >
                  {selectedRecord.allergies ? (
                    <Tag color="orange" style={{ fontSize: 13 }}>
                      {selectedRecord.allergies}
                    </Tag>
                  ) : (
                    <Text type="secondary">Không có</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item 
                  label={<span><HeartOutlined /> Bệnh mãn tính</span>}
                >
                  {selectedRecord.chronicDiseases ? (
                    <Tag color="red" style={{ fontSize: 13 }}>
                      {selectedRecord.chronicDiseases}
                    </Tag>
                  ) : (
                    <Text type="secondary">Không có</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item 
                  label="Nhóm máu"
                >
                  {selectedRecord.bloodType ? (
                    <Tag color="blue" style={{ fontSize: 13 }}>
                      {selectedRecord.bloodType}
                    </Tag>
                  ) : (
                    <Text type="secondary">Chưa xác định</Text>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Thị lực">
                  <Text>{selectedRecord.eyesight || 'Chưa kiểm tra'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Thính lực">
                  <Text>{selectedRecord.hearing || 'Chưa kiểm tra'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Cân nặng">
                  <Text strong>
                    {selectedRecord.weight ? `${selectedRecord.weight} kg` : 'Chưa đo'}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Chiều cao">
                  <Text strong>
                    {selectedRecord.height ? `${selectedRecord.height} cm` : 'Chưa đo'}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item 
                  label={<span><FileTextOutlined /> Lịch sử điều trị</span>}
                  span={2}
                >
                  <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                    {selectedRecord.treatmentHistory || 'Không có lịch sử điều trị đặc biệt'}
                  </Paragraph>
                </Descriptions.Item>
                <Descriptions.Item 
                  label={<span><InfoCircleOutlined /> Ghi chú</span>}
                  span={2}
                >
                  <Paragraph ellipsis={{ rows: 3, expandable: true }}>
                    {selectedRecord.notes || 'Không có ghi chú thêm'}
                  </Paragraph>
                </Descriptions.Item>
              </Descriptions>

              {/* BMI Calculation if height and weight are available */}
              {selectedRecord.height && selectedRecord.weight && (
                <Card 
                  title={<span><BarChartOutlined /> Chỉ số BMI</span>}
                  style={{ marginTop: 16 }}
                  size="small"
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Text>BMI: </Text>
                      <Text strong style={{ fontSize: 16, color: '#15803d' }}>
                        {(selectedRecord.weight / ((selectedRecord.height / 100) ** 2)).toFixed(1)}
                      </Text>
                    </Col>
                    <Col span={12}>
                      <Text>Đánh giá: </Text>
                      <Tag color={
                        (() => {
                          const bmi = selectedRecord.weight / ((selectedRecord.height / 100) ** 2);
                          if (bmi < 18.5) return 'blue';
                          if (bmi < 25) return 'green';
                          if (bmi < 30) return 'orange';
                          return 'red';
                        })()
                      }>
                        {
                          (() => {
                            const bmi = selectedRecord.weight / ((selectedRecord.height / 100) ** 2);
                            if (bmi < 18.5) return 'Thiếu cân';
                            if (bmi < 25) return 'Bình thường';
                            if (bmi < 30) return 'Thừa cân';
                            return 'Béo phì';
                          })()
                        }
                      </Tag>
                    </Col>
                  </Row>
                </Card>
              )}
            </div>
          )}
        </Modal>
    </div>
  );
};

export default HealthRecord;
