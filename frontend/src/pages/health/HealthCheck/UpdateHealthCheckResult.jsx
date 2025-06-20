import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Checkbox, Card, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import HealthCheckService from '../../../services/HealthCheckService';
import dayjs from 'dayjs';

const UpdateHealthCheckResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  useEffect(() => {
    if (!result) {
      message.error('Không tìm thấy dữ liệu kết quả kiểm tra!');
      navigate('/ketquakiemtradinhky');
    }
    console.log('Received result:', result);
  }, [result, navigate]);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Điền dữ liệu mặc định vào form
  useEffect(() => {
    if (result) {
      form.setFieldsValue({
        date: result.date ? dayjs(result.date) : null,
        height: result.height,
        weight: result.weight,
        eyesightLeft: result.eyesightLeft,
        eyesightRight: result.eyesightRight,
        bloodPressure: result.bloodPressure,
        hearingLeft: result.hearingLeft,
        hearingRight: result.hearingRight,
        temperature: result.temperature,
        consultationAppointment: result.consultationAppointment,
        notes: result.notes,
        parentConfirmation: result.parentConfirmation,
        studentId: result.studentId,
        campaignId: result.campaignId,
      });
    }
  }, [result, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Gửi đầy đủ các trường theo yêu cầu backend
      const payload = {
        date: values.date ? values.date.format('YYYY-MM-DD') : '',
        height: Number(values.height),
        weight: Number(values.weight),
        eyesightLeft: values.eyesightLeft,
        eyesightRight: values.eyesightRight,
        bloodPressure: values.bloodPressure,
        hearingLeft: values.hearingLeft,
        hearingRight: values.hearingRight,
        temperature: values.temperature,
        consultationAppointment: !!values.consultationAppointment,
        notes: values.notes,
        parentConfirmation: !!values.parentConfirmation,
        studentId: Number(values.studentId),
        campaignId: Number(values.campaignId),
      };

      const token = localStorage.getItem('token');
      await HealthCheckService.updateHealthCheckResult(result.healthCheckId, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Cập nhật kết quả thành công!');
      navigate('/ketquakiemtradinhky');
    } catch (err) {
      message.error('Cập nhật thất bại!');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: '32px auto' }}>
      <Card title="Cập nhật kết quả kiểm tra sức khỏe" bordered>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="Ngày khám" name="date" rules={[{ required: true, message: 'Vui lòng chọn ngày khám' }]}>
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Chiều cao (cm)" name="height" rules={[{ required: true, message: 'Vui lòng nhập chiều cao' }]}>
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item label="Cân nặng (kg)" name="weight" rules={[{ required: true, message: 'Vui lòng nhập cân nặng' }]}>
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item label="Thị lực trái" name="eyesightLeft" rules={[{ required: true, message: 'Vui lòng nhập thị lực trái' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Thị lực phải" name="eyesightRight" rules={[{ required: true, message: 'Vui lòng nhập thị lực phải' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Huyết áp" name="bloodPressure" rules={[{ required: true, message: 'Vui lòng nhập huyết áp' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Thính lực trái" name="hearingLeft" rules={[{ required: true, message: 'Vui lòng nhập thính lực trái' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Thính lực phải" name="hearingRight" rules={[{ required: true, message: 'Vui lòng nhập thính lực phải' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Nhiệt độ" name="temperature" rules={[{ required: true, message: 'Vui lòng nhập nhiệt độ' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="consultationAppointment" valuePropName="checked">
            <Checkbox>Đặt lịch tư vấn</Checkbox>
          </Form.Item>
          <Form.Item label="Ghi chú" name="notes">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="parentConfirmation" valuePropName="checked">
            <Checkbox>Đã xác nhận với phụ huynh</Checkbox>
          </Form.Item>
          <Form.Item label="Mã học sinh" name="studentId" hidden>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Mã chiến dịch" name="campaignId" hidden>
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
            <Button style={{ marginLeft: 12 }} onClick={() => navigate('/ketquakiemtradinhky')}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateHealthCheckResult;