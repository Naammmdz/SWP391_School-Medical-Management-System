import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Checkbox, DatePicker, message } from 'antd';
import HealthCheckService from '../../../services/HealthCheckService';
import dayjs from 'dayjs';

const { Option } = Select;

const HealthCheckResult = () => {
  // Lấy danh sách học sinh từ localStorage
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const users = JSON.parse(localStorage.getItem('users') || '[]'); // Giả sử đã lưu users để lấy tên phụ huynh

  // Hàm lấy tên phụ huynh từ userId
  const getParentName = (parentId) => {
    const parent = users.find(u => u.id === parentId);
    return parent ? parent.fullName : 'Không xác định';
  };

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    height: '',
    weight: '',
    eyesightLeft: '',
    eyesightRight: '',
    bloodPressure: '',
    hearingLeft: '',
    hearingRight: '',
    temperature: '',
    consultationAppointment: false,
    notes: '',
    parentConfirmation: false,
    studentId: '',
    campaignId: ''
  });
  const [loading, setLoading] = useState(false);

  // Danh sách chiến dịch đã duyệt
  const [approvedCampaigns, setApprovedCampaigns] = useState([]);

  useEffect(() => {
    // Lấy danh sách chiến dịch đã duyệt
    const fetchCampaigns = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const data = await HealthCheckService.getHealthCheckApproved(config);
        setApprovedCampaigns(Array.isArray(data) ? data : []);
      } catch (err) {
        setApprovedCampaigns([]);
      }
    };
    fetchCampaigns();
  }, []);

  // Khi nhấn nút ghi nhận kết quả
  const openForm = (student) => {
    setSelectedStudent(student);
    setForm({
      date: dayjs().format('YYYY-MM-DD'),
      height: '',
      weight: '',
      eyesightLeft: '',
      eyesightRight: '',
      bloodPressure: '',
      hearingLeft: '',
      hearingRight: '',
      temperature: '',
      consultationAppointment: false,
      notes: '',
      parentConfirmation: false,
      studentId: student.studentId,
      campaignId: ''
    });
    setModalOpen(true);
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Xử lý ngày khám
  const handleDateChange = (date, dateString) => {
    setForm(prev => ({
      ...prev,
      date: dateString
    }));
  };

  // Xử lý chọn chiến dịch
  const handleCampaignChange = (value) => {
    setForm(prev => ({
      ...prev,
      campaignId: value
    }));
  };

  // Gửi kết quả kiểm tra sức khỏe
  const handleSubmit = async () => {
    if (!form.date || !form.height || !form.weight || !form.studentId || !form.campaignId) {
      message.error('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await HealthCheckService.recordHealthCheckResult(form.campaignId, {
        ...form,
        height: parseFloat(form.height),
        weight: parseFloat(form.weight),
        studentId: parseInt(form.studentId),
        campaignId: parseInt(form.campaignId)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Ghi nhận kết quả thành công!');
      setModalOpen(false);
    } catch (err) {
      message.error('Ghi nhận kết quả thất bại!');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: '32px auto' }}>
      <h2>Danh sách học sinh kiểm tra sức khỏe</h2>
      <table className="students-table" style={{ width: '100%', marginBottom: 32 }}>
        <thead>
          <tr>
            <th>Họ và tên</th>
            <th>Lớp</th>
            <th>Phụ huynh</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>Không có học sinh.</td>
            </tr>
          ) : (
            students.map(student => (
              <tr key={student.studentId}>
                <td>{student.fullName}</td>
                <td>{student.className}</td>
                <td>{getParentName(student.parentId)}</td>
                <td>
                  <Button type="primary" onClick={() => openForm(student)}>
                    Ghi nhận kết quả kiểm tra
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal nhập kết quả kiểm tra */}
      <Modal
        title={`Ghi nhận kết quả cho: ${selectedStudent ? selectedStudent.fullName : ''}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={loading}
        okText="Lưu kết quả"
        cancelText="Hủy"
        width={600}
      >
        <div className="health-check-form">
          <div style={{ marginBottom: 12 }}>
            <label>Ngày khám <span style={{ color: 'red' }}>*</span></label>
            <DatePicker
              value={form.date ? dayjs(form.date) : null}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Chiến dịch kiểm tra sức khỏe <span style={{ color: 'red' }}>*</span></label>
            <Select
              showSearch
              placeholder="Chọn chiến dịch"
              value={form.campaignId || undefined}
              onChange={handleCampaignChange}
              style={{ width: '100%' }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {approvedCampaigns.map(c => (
                <Option key={c.campaignId} value={c.campaignId}>
                  {c.campaignName}
                </Option>
              ))}
            </Select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Chiều cao (cm) <span style={{ color: 'red' }}>*</span></label>
            <Input
              name="height"
              type="number"
              min={0}
              value={form.height}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Cân nặng (kg) <span style={{ color: 'red' }}>*</span></label>
            <Input
              name="weight"
              type="number"
              min={0}
              value={form.weight}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Thị lực trái</label>
            <Input name="eyesightLeft" value={form.eyesightLeft} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Thị lực phải</label>
            <Input name="eyesightRight" value={form.eyesightRight} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Huyết áp</label>
            <Input name="bloodPressure" value={form.bloodPressure} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Thính lực trái</label>
            <Input name="hearingLeft" value={form.hearingLeft} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Thính lực phải</label>
            <Input name="hearingRight" value={form.hearingRight} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Nhiệt độ</label>
            <Input name="temperature" value={form.temperature} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Checkbox
              name="consultationAppointment"
              checked={form.consultationAppointment}
              onChange={handleChange}
            >
              Đặt lịch tư vấn
            </Checkbox>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label>Ghi chú</label>
            <Input.TextArea name="notes" value={form.notes} onChange={handleChange} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Checkbox
              name="parentConfirmation"
              checked={form.parentConfirmation}
              onChange={handleChange}
            >
              Đã xác nhận với phụ huynh
            </Checkbox>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HealthCheckResult;