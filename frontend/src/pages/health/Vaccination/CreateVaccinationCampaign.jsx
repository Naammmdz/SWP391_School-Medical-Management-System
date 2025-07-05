import React, { useState } from 'react';
import { Card, Form, Input, DatePicker, TimePicker, Button, Row, Col, Typography, message, Space, Select, Checkbox, Tag, Tooltip } from 'antd';
import { MedicineBoxOutlined, SaveOutlined, ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import VaccinationService from '../../../services/VaccinationService';
import dayjs from 'dayjs';
import './CreateVaccinationCampaign.css';

const { Title } = Typography;
const { TextArea } = Input;

const CreateVaccinationCampaign = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [targetType, setTargetType] = useState('specific'); // 'all', 'grade', 'specific', 'custom'
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [customTarget, setCustomTarget] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserName = user.fullName || 'Không xác định';

  // Data for target group options
  const gradeOptions = [
    { label: 'Khối 1', value: '1' },
    { label: 'Khối 2', value: '2' },
    { label: 'Khối 3', value: '3' },
    { label: 'Khối 4', value: '4' },
    { label: 'Khối 5', value: '5' }
  ];

  const classOptions = [
    '1A', '1B', '1C', '1D',
    '2A', '2B', '2C', '2D',
    '3A', '3B', '3C', '3D',
    '4A', '4B', '4C', '4D',
    '5A', '5B', '5C', '5D'
  ];

  // Generate target group string based on selection
  const generateTargetGroup = () => {
    switch (targetType) {
      case 'all':
        return 'toàn trường';
      case 'grade':
        return selectedGrades.length === 1 ? selectedGrades[0] : selectedGrades.join(',');
      case 'specific':
        return selectedClasses.join(',');
      case 'custom':
        return customTarget;
      default:
        return '';
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const targetGroup = generateTargetGroup();
      if (!targetGroup) {
        message.error('Vui lòng chọn đối tượng áp dụng!');
        setLoading(false);
        return;
      }

      const campaignData = {
        campaignName: values.campaignName,
        targetGroup: targetGroup,
        type: values.type,
        address: values.address,
        organizer: values.organizer,
        description: values.description || '',
        scheduledDate: values.scheduledDate.format('YYYY-MM-DD'),
        status: 'PENDING'
      };

      await VaccinationService.createVaccinationCampaign(campaignData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      message.success('Tạo chiến dịch tiêm chủng thành công!');
      navigate('/quanlytiemchung');
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo chiến dịch. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setTargetType('specific');
    setSelectedGrades([]);
    setSelectedClasses([]);
    setCustomTarget('');
    message.info('Đã xóa tất cả thông tin trong form');
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#15803d' }}>
            <MedicineBoxOutlined style={{ marginRight: 12 }} />
            Tạo chiến dịch tiêm chủng
          </Title>
          <div style={{ color: '#8c8c8c', fontSize: 16, marginTop: 8 }}>
            Tạo một chiến dịch tiêm chủng mới cho học sinh
          </div>
        </Col>
        <Col>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/quanlytiemchung')}
            style={{
              borderRadius: 8,
              height: 40,
              border: '1px solid #d9d9d9',
              color: '#595959'
            }}
          >
            Quay lại
          </Button>
        </Col>
      </Row>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        className="campaign-form"
        initialValues={{
          organizer: form.getFieldValue('organizer'),
          scheduledTime: dayjs('09:00', 'HH:mm')
        }}
      >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tên chiến dịch"
                name="campaignName"
                rules={[{ required: true, message: 'Vui lòng nhập tên chiến dịch!' }]}
              >
                <Input placeholder="Tên chiến dịch" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Loại vắc-xin"
                name="type"
                rules={[{ required: true, message: 'Vui lòng nhập loại vắc-xin!' }]}
              >
                <Input placeholder="Loại vắc-xin" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                label={
                  <span>
                    Đối tượng áp dụng
                    <Tooltip title="Chọn học sinh sẽ nhận thông báo tiêm chủng">
                      <InfoCircleOutlined style={{ marginLeft: 4, color: '#1890ff' }} />
                    </Tooltip>
                  </span>
                }
              >
                {/* Target Type Selector */}
                <div style={{ marginBottom: 12 }}>
                  <Select
                    value={targetType}
                    onChange={setTargetType}
                    style={{ width: '100%' }}
                    size="large"
                    placeholder="Chọn loại đối tượng"
                  >
                    <Select.Option value="all">Toàn trường</Select.Option>
                    <Select.Option value="grade">Theo khối lớp</Select.Option>
                    <Select.Option value="specific">Lớp cụ thể</Select.Option>
                    <Select.Option value="custom">Tùy chỉnh</Select.Option>
                  </Select>
                </div>

                {/* Target Selection based on type */}
                {targetType === 'all' && (
                  <div style={{ padding: 16, background: '#f0f9ff', borderRadius: 8, border: '1px solid #91d5ff' }}>
                    <Tag color="blue" style={{ fontSize: 14 }}>Áp dụng cho toàn trường</Tag>
                    <div style={{ color: '#595959', marginTop: 8, fontSize: 13 }}>
                      Tất cả học sinh trong trường sẽ nhận được thông báo tiêm chủng này
                    </div>
                  </div>
                )}

                {targetType === 'grade' && (
                  <div>
                    <div style={{ marginBottom: 8, color: '#595959' }}>Chọn khối lớp:</div>
                    <Checkbox.Group
                      options={gradeOptions}
                      value={selectedGrades}
                      onChange={setSelectedGrades}
                      style={{ width: '100%' }}
                    />
                    {selectedGrades.length > 0 && (
                      <div style={{ marginTop: 12, padding: 12, background: '#f6ffed', borderRadius: 6, border: '1px solid #b7eb8f' }}>
                        <div style={{ marginBottom: 8, color: '#52c41a', fontWeight: 500 }}>Đã chọn:</div>
                        <Space wrap>
                          {selectedGrades.map(grade => (
                            <Tag key={grade} color="green">Khối {grade}</Tag>
                          ))}
                        </Space>
                      </div>
                    )}
                  </div>
                )}

                {targetType === 'specific' && (
                  <div>
                    <div style={{ marginBottom: 8, color: '#595959' }}>Chọn lớp cụ thể:</div>
                    <Select
                      mode="multiple"
                      size="large"
                      placeholder="Chọn các lớp"
                      value={selectedClasses}
                      onChange={setSelectedClasses}
                      style={{ width: '100%' }}
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {classOptions.map(className => (
                        <Select.Option key={className} value={className}>
                          Lớp {className}
                        </Select.Option>
                      ))}
                    </Select>
                    {selectedClasses.length > 0 && (
                      <div style={{ marginTop: 12, padding: 12, background: '#f6ffed', borderRadius: 6, border: '1px solid #b7eb8f' }}>
                        <div style={{ marginBottom: 8, color: '#52c41a', fontWeight: 500 }}>Đã chọn {selectedClasses.length} lớp:</div>
                        <Space wrap>
                          {selectedClasses.map(className => (
                            <Tag key={className} color="green">Lớp {className}</Tag>
                          ))}
                        </Space>
                      </div>
                    )}
                  </div>
                )}

                {targetType === 'custom' && (
                  <div>
                    <div style={{ marginBottom: 8, color: '#595959' }}>Nhập đối tượng tùy chỉnh:</div>
                    <Input.TextArea
                      value={customTarget}
                      onChange={(e) => setCustomTarget(e.target.value)}
                      placeholder="Ví dụ: 1A,2B,3C hoặc khối 1,2 hoặc toàn trường"
                      rows={3}
                      size="large"
                    />
                    <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>
                      Hướng dẫn: Nhập tên lớp (1A,2B), số khối (1,2,3), hoặc "toàn trường"
                    </div>
                  </div>
                )}

                {/* Preview */}
                {generateTargetGroup() && (
                  <div style={{ marginTop: 16, padding: 12, background: '#fff7e6', borderRadius: 6, border: '1px solid #ffd666' }}>
                    <div style={{ color: '#fa8c16', fontWeight: 500, marginBottom: 4 }}>Kết quả:</div>
                    <Tag color="orange" style={{ fontSize: 13 }}>{generateTargetGroup()}</Tag>
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Địa điểm"
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
              >
                <Input placeholder="Địa điểm" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Đơn vị tổ chức"
                name="organizer"
                rules={[{ required: true, message: 'Vui lòng nhập đơn vị tổ chức!' }]}
              >
                <Input placeholder="Đơn vị tổ chức" size="large"/>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Ngày tiêm"
                name="scheduledDate"
                rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
              >
                <DatePicker
                  placeholder="Chọn ngày"
                  size="large"
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Mô tả chi tiết"
            name="description"
          >
            <TextArea
              rows={4}
              placeholder="Mô tả"
              maxLength={500}
            />
          </Form.Item>

          <Form.Item className="form-actions">
            <Space>
              <Button onClick={handleReset} size="large" className="reset-btn">
                Xóa form
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} size="large" icon={<SaveOutlined />} className="submit-btn">
                Tạo chiến dịch
              </Button>
            </Space>
          </Form.Item>
        </Form>
    </div>
  );
};

export default CreateVaccinationCampaign;
