import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Card, Typography, Alert, Spin, Select, Checkbox, Tag, Tooltip, Space } from 'antd';
import {
  NotificationOutlined,
  TeamOutlined,
  TagOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import HealthCheckService from '../../../services/HealthCheckService';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;

const CreateHealthCheck = () => {
  const [form] = Form.useForm();
  const [nurse, setNurse] = useState({});
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [targetType, setTargetType] = useState('specific'); // 'all', 'grade', 'specific', 'custom'
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [customTarget, setCustomTarget] = useState('');

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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const storedToken = localStorage.getItem('token');
    setNurse(user);
    setToken(storedToken);
  }, []);

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
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const targetGroup = generateTargetGroup();
      if (!targetGroup) {
        setErrorMsg('Vui lòng chọn đối tượng áp dụng!');
        setLoading(false);
        return;
      }

      const submitData = {
        campaignName: values.campaignName,
        targetGroup: targetGroup,
        type: values.type,
        address: values.address,
        organizer: values.organizer, // y tá nhập tay
        description: values.description,
        scheduledDate: values.scheduledDate.format('YYYY-MM-DD'),
        status: 'PENDING',
      };

      await HealthCheckService.createHealthCheckCampaign(submitData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccessMsg('Tạo chiến dịch kiểm tra sức khỏe thành công!');
      form.resetFields();
      // Reset target selection
      setTargetType('specific');
      setSelectedGrades([]);
      setSelectedClasses([]);
      setCustomTarget('');
    } catch (err) {
      setErrorMsg(err.message || 'Tạo chiến dịch thất bại! Vui lòng thử lại.');
    }
    setLoading(false);
  };

  if (!nurse.userRole || (nurse.userRole !== 'ROLE_NURSE' && nurse.userRole !== 'ROLE_ADMIN')) {
    return (
      <div style={{ maxWidth: 800, margin: '32px auto', padding: '24px' }}>
        <Alert
          message="Không có quyền truy cập"
          description="Bạn không có quyền thực hiện chức năng này."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '32px auto', padding: '24px', background: '#f4f8fb' }}>
      <Card style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Title level={2} style={{ textAlign: 'center', color: '#1890ff', marginBottom: 24 }}>
          Tạo chiến dịch kiểm tra sức khỏe
        </Title>
        <Spin spinning={loading} tip="Đang xử lý...">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              name="campaignName"
              label="Tên chiến dịch"
              rules={[{ required: true, message: 'Vui lòng nhập tên chiến dịch!' }]}
            >
              <Input prefix={<NotificationOutlined />} placeholder="VD: Khám sức khỏe toàn trường đợt 1" />
            </Form.Item>

            <Form.Item
              label={
                <span>
                  Đối tượng áp dụng
                  <Tooltip title="Chọn học sinh sẽ nhận thông báo kiểm tra sức khỏe">
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
                    Tất cả học sinh trong trường sẽ nhận được thông báo kiểm tra sức khỏe này
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

            <Form.Item
              name="type"
              label="Loại chiến dịch"
              rules={[{ required: true, message: 'Vui lòng nhập loại chiến dịch!' }]}
            >
              <Input prefix={<TagOutlined />} placeholder="VD: Khám tổng quát, Khám nha khoa" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa điểm tổ chức"
              rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
            >
              <Input prefix={<EnvironmentOutlined />} placeholder="VD: Phòng y tế, Hội trường A" />
            </Form.Item>

            <Form.Item
              name="organizer"
              label="Đơn vị thực hiện"
              rules={[{ required: true, message: 'Vui lòng nhập đơn vị thực hiện!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Nhập tổ chức thực hiện" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả chi tiết"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
            >
              <TextArea prefix={<FileTextOutlined />} rows={4} placeholder="Mô tả các hoạt động, mục tiêu của chiến dịch" />
            </Form.Item>

            <Form.Item
              name="scheduledDate"
              label="Ngày khám dự kiến"
              rules={[{ required: true, message: 'Vui lòng chọn ngày khám!' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                prefix={<CalendarOutlined />}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày"
                disabledDate={(current) => current && current < moment().endOf('day')}
              />
            </Form.Item>

            {successMsg && <Alert message={successMsg} type="success" showIcon style={{ marginBottom: 16 }} />}
            {errorMsg && <Alert message={errorMsg} type="error" showIcon style={{ marginBottom: 16 }} />}

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                Tạo chiến dịch kiểm tra sức khỏe
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default CreateHealthCheck;