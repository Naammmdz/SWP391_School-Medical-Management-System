import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Checkbox, DatePicker, message, Table } from 'antd';
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

  // Modal xem kết quả
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [healthResult, setHealthResult] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  // Danh sách tất cả kết quả kiểm tra sức khỏe cho y tá
  const [allResults, setAllResults] = useState([]);
  const [allResultsLoading, setAllResultsLoading] = useState(false);

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

    // Lấy tất cả kết quả kiểm tra sức khỏe cho y tá
    const fetchAllResults = async () => {
      setAllResultsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const data = await HealthCheckService.getAllHealthCheckResult(config);
        setAllResults(Array.isArray(data) ? data : []);
      } catch (err) {
        setAllResults([]);
      }
      setAllResultsLoading(false);
    };
    fetchAllResults();
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

  // Xem kết quả kiểm tra sức khỏe
  const openResultModal = async (student, campaignId) => {
    setHealthResult(null);
    setSelectedStudent(student);
    setSelectedCampaignId(campaignId);
    setResultModalOpen(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const result = await HealthCheckService.getHealthCheckResult(student.studentId, campaignId, config);
      setHealthResult(result);
    } catch (err) {
      setHealthResult({ error: 'Không tìm thấy kết quả.' });
    }
  };

  // Cột cho bảng tất cả kết quả kiểm tra sức khỏe
  const columns = [
    { title: 'Học sinh', dataIndex: 'studentName', key: 'studentName' },
    { title: 'Lớp', dataIndex: 'className', key: 'className' },
    { title: 'Chiến dịch', dataIndex: 'campaignName', key: 'campaignName' },
    { title: 'Ngày khám', dataIndex: 'date', key: 'date' },
    { title: 'Chiều cao (cm)', dataIndex: 'height', key: 'height' },
    { title: 'Cân nặng (kg)', dataIndex: 'weight', key: 'weight' },
    { title: 'Thị lực trái', dataIndex: 'eyesightLeft', key: 'eyesightLeft' },
    { title: 'Thị lực phải', dataIndex: 'eyesightRight', key: 'eyesightRight' },
    { title: 'Huyết áp', dataIndex: 'bloodPressure', key: 'bloodPressure' },
    { title: 'Thính lực trái', dataIndex: 'hearingLeft', key: 'hearingLeft' },
    { title: 'Thính lực phải', dataIndex: 'hearingRight', key: 'hearingRight' },
    { title: 'Nhiệt độ', dataIndex: 'temperature', key: 'temperature' },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '32px auto' }}>
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
                  <Select
                    placeholder="Xem kết quả"
                    style={{ width: 140, marginLeft: 8 }}
                    onChange={(campaignId) => openResultModal(student, campaignId)}
                    allowClear
                    size="small"
                  >
                    {approvedCampaigns.map(c => (
                      <Option key={c.campaignId} value={c.campaignId}>
                        {c.campaignName}
                      </Option>
                    ))}
                  </Select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Bảng tất cả kết quả kiểm tra sức khỏe cho y tá */}
      <h2 style={{ marginTop: 40 }}>Tất cả kết quả kiểm tra sức khỏe</h2>
      <Table
        dataSource={allResults}
        columns={columns}
        rowKey={record => `${record.studentId}-${record.campaignId}`}
        loading={allResultsLoading}
        scroll={{ x: true }}
        pagination={{ pageSize: 10 }}
      />

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

      {/* Modal xem kết quả kiểm tra */}
      <Modal
        title={`Kết quả kiểm tra: ${selectedStudent ? selectedStudent.fullName : ''}`}
        open={resultModalOpen}
        onCancel={() => setResultModalOpen(false)}
        footer={null}
        width={600}
      >
        {healthResult ? (
          healthResult.error ? (
            <div style={{ color: 'red' }}>{healthResult.error}</div>
          ) : (
            <div>
              <p><b>Ngày khám:</b> {healthResult.date}</p>
              <p><b>Chiều cao:</b> {healthResult.height} cm</p>
              <p><b>Cân nặng:</b> {healthResult.weight} kg</p>
              <p><b>Thị lực trái:</b> {healthResult.eyesightLeft}</p>
              <p><b>Thị lực phải:</b> {healthResult.eyesightRight}</p>
              <p><b>Huyết áp:</b> {healthResult.bloodPressure}</p>
              <p><b>Thính lực trái:</b> {healthResult.hearingLeft}</p>
              <p><b>Thính lực phải:</b> {healthResult.hearingRight}</p>
              <p><b>Nhiệt độ:</b> {healthResult.temperature}</p>
              <p><b>Ghi chú:</b> {healthResult.notes}</p>
              <p><b>Đặt lịch tư vấn:</b> {healthResult.consultationAppointment ? 'Có' : 'Không'}</p>
              <p><b>Phụ huynh xác nhận:</b> {healthResult.parentConfirmation ? 'Đã xác nhận' : 'Chưa xác nhận'}</p>
            </div>
          )
        ) : (
          <div>Đang tải...</div>
        )}
      </Modal>
    </div>
  );
};

export default HealthCheckResult;