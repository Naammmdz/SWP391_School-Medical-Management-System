import React, { useState } from 'react';
import { Card, Form, Input, DatePicker, TimePicker, Button, Row, Col, Typography, message, Space } from 'antd';
import { MedicineBoxOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import VaccinationService from '../../../services/VaccinationService';
import dayjs from 'dayjs';
import './CreateVaccinationCampaign.css';

const { Title } = Typography;
const { TextArea } = Input;

const CreateVaccinationCampaign = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserName = user.fullName || 'Không xác định';

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const campaignData = {
        campaignName: values.campaignName,
        targetGroup: values.targetGroup,
        type: values.type,
        address: values.address,
        organizer: values.organizer || currentUserName,
        description: values.description || '',
        scheduledDate: values.scheduledDate.format('YYYY-MM-DD'),
        scheduledTime: values.scheduledTime.format('HH:mm'),
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
    message.info('Đã xóa tất cả thông tin trong form');
  };

  return (
    <div className="create-vaccination-page">
      {/* Header */}
      <Card className="header-card">
        <div className="header-content">
          <Title level={2}>
            <MedicineBoxOutlined /> Tạo chiến dịch tiêm chủng
          </Title>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/quanlytiemchung')}>
            Quay lại
          </Button>
        </div>
      </Card>

      {/* Form */}
      <Card className="form-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="campaign-form"
          initialValues={{
            organizer: currentUserName,
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
            <Col xs={24} md={12}>
              <Form.Item
                label="Đối tượng"
                name="targetGroup"
                rules={[{ required: true, message: 'Vui lòng nhập đối tượng!' }]}
              >
                <Input placeholder="Đối tượng" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Địa điểm"
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa điểm!' }]}
              >
                <Input placeholder="Địa điểm" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
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
            <Col xs={24} md={8}>
              <Form.Item
                label="Giờ tiêm"
                name="scheduledTime"
                rules={[{ required: true, message: 'Vui lòng chọn giờ!' }]}
              >
                <TimePicker
                  placeholder="Chọn giờ"
                  size="large"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Đơn vị tổ chức"
                name="organizer"
              >
                <Input placeholder="Đơn vị tổ chức" size="large" disabled />
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
      </Card>
    </div>
  );
};

export default CreateVaccinationCampaign;
