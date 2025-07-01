import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Card, Typography, Alert, Spin } from 'antd';
import {
  NotificationOutlined,
  TeamOutlined,
  TagOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  CalendarOutlined,
  UserOutlined,
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

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const storedToken = localStorage.getItem('token');
    setNurse(user);
    setToken(storedToken);
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const submitData = {
        campaignName: values.campaignName,
        targetGroup: values.targetGroup,
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
              name="targetGroup"
              label="Đối tượng áp dụng"
              rules={[{ required: true, message: 'Vui lòng nhập đối tượng!' }]}
            >
              <Input prefix={<TeamOutlined />} placeholder="VD: Khối 1, Khối 2 hoặc Toàn trường" />
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