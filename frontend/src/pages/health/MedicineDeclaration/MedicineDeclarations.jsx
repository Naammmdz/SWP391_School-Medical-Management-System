import React, { useState, useEffect } from 'react';
import { Card, Form, Input, DatePicker, Upload, Button, Alert, Spin, Typography, Space, Row, Col, message, Image } from 'antd';
import { SendOutlined, InfoCircleOutlined, MedicineBoxOutlined, UploadOutlined, PlusOutlined, FileTextOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import './MedicineDeclarations.css';
import MedicineDeclarationService from '../../../services/MedicineDeclarationService';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const MedicineDeclarations = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const selectedStudentId = localStorage.getItem('selectedStudentId');

  // State cho thông tin học sinh
  const [studentInfo, setStudentInfo] = useState({
    studentId: '',
    studentName: '',
    classroom: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy thông tin học sinh từ localStorage (danh sách students đã lưu)
  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => String(s.studentId) === String(selectedStudentId));
    if (student) {
      setStudentInfo({
        studentId: student.studentId,
        studentName: student.fullName,
        classroom: student.className
      });
    }
    setIsLoading(false);
  }, [selectedStudentId]);

  const handleImageUpload = (info) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      setImageFile(file);
      // Tạo preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (values) => {
    if (!studentInfo.studentId) {
      message.error('Không tìm thấy thông tin học sinh');
      return;
    }

    const { dateRange, instruction, notes } = values;
    const [startDate, endDate] = dateRange || [];
    
    if (!startDate || !endDate) {
      message.error('Vui lòng chọn thời gian sử dụng thuốc');
      return;
    }

    const duration = Math.max(1, endDate.diff(startDate, 'day') + 1);

    // Chuẩn bị dữ liệu theo API mới
    const requestData = {
      studentId: studentInfo.studentId,
      instruction,
      duration,
      startDate: startDate.format('YYYY-MM-DD'),
      endDate: endDate.format('YYYY-MM-DD'),
      notes: notes || ''
    };

    const token = localStorage.getItem('token');

    setIsSubmitting(true);
    try {
      await MedicineDeclarationService.createMedicineSubmission(
        { requestData, imageFile: imageFile || undefined },
        token
      );

      form.resetFields();
      setImageFile(null);
      setImagePreview(null);
      message.success('Khai báo thuốc đã được gửi thành công!');
    } catch (err) {
      message.error('Có lỗi xảy ra khi gửi khai báo. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24, marginTop: 50 }}>
        <Spin size="large" />
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text>Đang tải thông tin học sinh...</Text>
        </div>
      </div>
    );
  }

  if (!studentInfo.studentId) {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24, marginTop: 50 }}>
        <Alert
          message="Chưa chọn học sinh"
          description="Vui lòng chọn học sinh để tiếp tục khai báo thuốc."
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 32, marginTop: 50 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#15803d' }}>
            <MedicineBoxOutlined style={{ marginRight: 12 }} />
            Khai báo thuốc
          </Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<FileTextOutlined />}
            size="large"
            onClick={() => navigate('/parent/donthuocdagui')}
            style={{ borderRadius: 8 }}
          >
            Xem đơn thuốc đã gửi
          </Button>
        </Col>
      </Row>

      {/* Thông tin học sinh */}
      <Card
        style={{ 
          marginBottom: 24, 
          borderRadius: 16, 
          boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
          background: 'linear-gradient(135deg, #059669 0%, #065f46 100%)',
          color: 'white'
        }}
        bordered={false}
      >
        <Space align="center" size={16}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserOutlined style={{ fontSize: 32, color: 'white' }} />
          </div>
          <div>
            <Title level={3} style={{ margin: 0, color: 'white' }}>{studentInfo.studentName}</Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
              Lớp: {studentInfo.classroom}
            </Text>
          </div>
        </Space>
      </Card>

      {/* Hướng dẫn */}
      <Alert
        message="Hướng dẫn khai báo thuốc"
        description={
          <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
            <li>Vui lòng mô tả tình trạng bệnh và hướng dẫn sử dụng thuốc</li>
            <li>Điền đầy đủ thông tin về thuốc cần sử dụng</li>
            <li>Nhân viên y tế sẽ kiểm tra và xử lý khai báo</li>
            <li>Mọi thông tin sẽ được bảo mật và chỉ sử dụng cho mục đích chăm sóc sức khỏe của học sinh</li>
          </ul>
        }
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 24, borderRadius: 12 }}
      />

      {/* Form khai báo */}
      <Card
        title={
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            <MedicineBoxOutlined style={{ marginRight: 8, color: '#15803d' }} />
            Thông tin thuốc cần sử dụng
          </span>
        }
        style={{ borderRadius: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.07)' }}
        bodyStyle={{ padding: 32 }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
        >
          <Form.Item
            label="Hướng dẫn sử dụng thuốc"
            name="instruction"
            rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn sử dụng thuốc!' }]}
            style={{ marginBottom: 24 }}
          >
            <TextArea
              rows={4}
              placeholder="Mô tả chi tiết về thuốc, liều lượng, cách sử dụng..."
              maxLength={500}
              showCount
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            label="Thời gian sử dụng thuốc"
            name="dateRange"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian sử dụng thuốc!' }]}
            style={{ marginBottom: 24 }}
          >
            <RangePicker
              style={{ width: '100%', borderRadius: 8, height: 40 }}
              placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
              format="DD/MM/YYYY"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            label="Ghi chú thêm"
            name="notes"
            style={{ marginBottom: 24 }}
          >
            <TextArea
              rows={3}
              placeholder="Thông tin thêm mà nhân viên y tế cần biết..."
              maxLength={300}
              showCount
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            label="Hình ảnh đơn thuốc (không bắt buộc)"
            style={{ marginBottom: 32 }}
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              beforeUpload={() => false}
              onChange={handleImageUpload}
              onRemove={removeImage}
              style={{ borderRadius: 8 }}
            >
              {!imageFile && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                </div>
              )}
            </Upload>
            {imagePreview && (
              <div style={{ marginTop: 16 }}>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: 200, borderRadius: 8 }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={isSubmitting}
              icon={<SendOutlined />}
              style={{ 
                borderRadius: 8, 
                height: 48, 
                minWidth: 120,
                fontSize: 16,
                fontWeight: 600
              }}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi khai báo'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default MedicineDeclarations;