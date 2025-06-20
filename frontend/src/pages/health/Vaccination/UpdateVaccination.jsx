import React, { useEffect, useState } from 'react';
import { Form, Input, Button, DatePicker, Card, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import VaccinationService from '../../../services/VaccinationService';
import dayjs from 'dayjs';

const UpdatetVaccination = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Lấy tên người tổ chức từ localStorage (giả sử lưu user hiện tại)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const organizerName = user.fullName || user.name || '';

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!event) {
        message.error('Không tìm thấy thông tin sự kiện tiêm chủng!');
        navigate(-1);
        return;
      }
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await VaccinationService.getAllVaccinationCampaigns({
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = Array.isArray(response.data) ? response.data : response.data.content || [];
        const mappedData = data.map((item, idx) => ({
          id: item.id || item.campaignId || idx + 1,
          campaignName: item.campaignName || '',
          targetGroup: item.targetGroup || '',
          type: item.type || '',
          address: item.address || '',
          organizer: item.organizer || organizerName,
          description: item.description || '',
          scheduledDate: item.scheduledDate || '',
          status: item.status || '',
          // Các trường bị comment và không update
          // vaccineType: item.vaccineType || '',
          // notes: item.notes || '',
          // vaccineBatch: item.vaccineBatch || '',
          // manufacturer: item.manufacturer || '',
          // doseAmount: item.doseAmount || '',
          // requiredDocuments: item.requiredDocuments || '',
        }));
        // Tìm sự kiện theo id
        const found = mappedData.find(
          (item) =>
            item.id === event.id ||
            item.id === event.campaignId ||
            item.campaignId === event.id
        );
        if (!found) {
          message.error('Không tìm thấy sự kiện tiêm chủng!');
          navigate(-1);
          return;
        }
        form.setFieldsValue({
          campaignName: found.campaignName,
          targetGroup: found.targetGroup,
          type: found.type,
          address: found.address,
          organizer: found.organizer,
          description: found.description,
          scheduledDate: found.scheduledDate ? dayjs(found.scheduledDate) : null,
          status: found.status,
        });
      } catch (err) {
        message.error('Không thể lấy dữ liệu sự kiện!');
        navigate(-1);
      }
      setLoading(false);
    };
    fetchEventDetail();
    // eslint-disable-next-line
  }, [event, form, navigate]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        campaignName: values.campaignName,
        targetGroup: values.targetGroup,
        type: values.type,
        address: values.address,
        organizer: values.organizer,
        description: values.description,
        scheduledDate: values.scheduledDate ? values.scheduledDate.format('YYYY-MM-DD') : '',
        status: values.status, // giữ nguyên, không cho chỉnh sửa
        // Các trường đã comment sẽ không gửi lên backend
      };
      const token = localStorage.getItem('token');
      await VaccinationService.updateVaccinationCampaign(event.id || event.campaignId, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Cập nhật thông tin tiêm chủng thành công!');
      navigate('/quanlytiemchung');
    } catch (err) {
      message.error('Cập nhật thất bại!');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: '32px auto' }}>
      <Card title="Cập nhật thông tin tiêm chủng" bordered>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="Tên chiến dịch" name="campaignName" rules={[{ required: true, message: 'Vui lòng nhập tên chiến dịch' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Nhóm đối tượng" name="targetGroup" rules={[{ required: true, message: 'Vui lòng nhập nhóm đối tượng' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Loại Vaccin" name="type" rules={[{ required: true, message: 'Vui lòng nhập loại chiến dịch' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Địa điểm" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Người tổ chức" name="organizer">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Ngày tiêm" name="scheduledDate" rules={[{ required: true, message: 'Vui lòng chọn ngày tiêm' }]}>
            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status">
            <Input disabled />
          </Form.Item>
          {/* Các trường đã comment và không update */}
          {/* 
          <Form.Item label="Loại vắc-xin" name="vaccineType">
            <Input />
          </Form.Item>
          <Form.Item label="Ghi chú" name="notes">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Lô vắc-xin" name="vaccineBatch">
            <Input />
          </Form.Item>
          <Form.Item label="Nhà sản xuất" name="manufacturer">
            <Input />
          </Form.Item>
          <Form.Item label="Liều lượng" name="doseAmount">
            <Input />
          </Form.Item>
          <Form.Item label="Giấy tờ yêu cầu" name="requiredDocuments">
            <Input />
          </Form.Item>
          */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
            <Button style={{ marginLeft: 12 }} onClick={() => navigate('/quanlytiemchung')}>
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdatetVaccination;