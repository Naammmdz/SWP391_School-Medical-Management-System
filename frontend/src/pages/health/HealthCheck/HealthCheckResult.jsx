import React, { useMemo, useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Checkbox, DatePicker, message, Table, Card, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import HealthCheckService from '../../../services/HealthCheckService';
import dayjs from 'dayjs';

const { Option } = Select;

const HealthCheckResult = () => {
  const navigate = useNavigate();

  // Lấy danh sách học sinh và users từ localStorage
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // Danh sách chiến dịch đã duyệt
  const [approvedCampaigns, setApprovedCampaigns] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  // Danh sách học sinh đã đăng ký tham gia chiến dịch
  const [registeredStudents, setRegisteredStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Modal và form ghi nhận kết quả
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
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
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Lấy danh sách tất cả kết quả kiểm tra sức khỏe cho y tá
  const [allResults, setAllResults] = useState([]);
  const [allResultsLoading, setAllResultsLoading] = useState(false);
  // 
  const visibleCampaigns = useMemo(() => {
    return approvedCampaigns.filter(c =>  c.parentConfirmation !== false);
  }, [approvedCampaigns]);
  // Map campaignId -> campaignName
  const campaignIdToName = useMemo(() => {
    const map = {};
    approvedCampaigns.forEach(c => {
      map[c.campaignId] = c.campaignName;
    });
    return map;
  }, [approvedCampaigns]);

  // Lấy tên phụ huynh từ userId
  const getParentName = (parentId) => {
    const parent = users.find(u => u.id === parentId);
    return parent ? parent.fullName : 'Không xác định';
  };

  // Lấy thông tin học sinh từ studentId
  const getStudentInfo = (studentId) => {
    const student = students.find(s => String(s.studentId) === String(studentId));
    return student
      ? { fullName: student.fullName, className: student.className }
      : { fullName: 'Không xác định', className: 'Không xác định' };
  };

  useEffect(() => {
    // Lấy danh sách chiến dịch đã duyệt
    const fetchCampaigns = async () => {
      setLoadingCampaigns(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const data = await HealthCheckService.getHealthCheckApproved(config);
        setApprovedCampaigns(Array.isArray(data) ? data : []);
      } catch (err) {
        setApprovedCampaigns([]);
      }
      setLoadingCampaigns(false);
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

  // Khi nhấn nút "Ghi nhận kết quả" trên từng chiến dịch
  const handleOpenStudentsModal = async (campaign) => {
    setSelectedCampaign(campaign);
    setLoadingStudents(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const data = await HealthCheckService.getHealthCheckNurse(campaign.campaignId, config);
      setRegisteredStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setRegisteredStudents([]);
      message.error('Không thể tải danh sách học sinh đã đăng ký!');
    }
    setLoadingStudents(false);
    setModalOpen(true);
    setSelectedStudent(null);
  };

  // Khi chọn học sinh để ghi nhận kết quả
  const handleSelectStudent = (student) => {
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
      campaignId: selectedCampaign.campaignId
    });
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

  // Gửi kết quả kiểm tra sức khỏe
  const handleSubmit = async () => {
    if (!form.date || !form.height || !form.weight || !form.studentId || !form.campaignId) {
      message.error('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }
    setLoadingSubmit(true);
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
      setSelectedStudent(null);
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
        studentId: '',
        campaignId: ''
      });
      // Reload lại danh sách kết quả nếu cần
    } catch (err) {
      message.error('Ghi nhận kết quả thất bại!');
    }
    setLoadingSubmit(false);
  };

  // Cột cho bảng tất cả kết quả kiểm tra sức khỏe
 const columns = [
  { 
    title: 'Học sinh', 
    dataIndex: 'studentId', 
    key: 'studentId',
    render: (studentId) => getStudentInfo(studentId).fullName
  },
  { 
    title: 'Lớp', 
    dataIndex: 'studentId', 
    key: 'className',
    render: (studentId) => getStudentInfo(studentId).className
  },
  {
    title: 'Chiến dịch',
    dataIndex: 'campaignId',
    key: 'campaignId',
    render: (campaignId) => campaignIdToName[campaignId] || `Mã: ${campaignId}`
  },
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
  {
    title: 'Trạng thái',
    key: 'status',
    render: (_, record) => {
      // Tìm campaign trong visibleCampaigns để lấy parentConfirmation
      const campaign = visibleCampaigns.find(c => c.campaignId === record.campaignId);
      if (campaign && campaign.parentConfirmation === false) {
        return (
          <Button type="default" disabled>
            Học sinh không tham gia đợt kiểm tra này
          </Button>
        );
      }
      return (
        <Button
          type="dashed"
          onClick={() => navigate('/capnhatketquakiemtra', { state: { result: record } })}
        >
          Cập nhật
        </Button>
      );
    },
    width: 210
  }
];

  return (
     <div style={{ maxWidth: 1200, margin: '32px auto' }}>
      <h2>Danh sách chiến dịch kiểm tra sức khỏe đã duyệt</h2>
      <Space direction="vertical" style={{ width: '100%' }}>
        {loadingCampaigns ? (
          <div>Đang tải danh sách chiến dịch...</div>
        ) : visibleCampaigns.length === 0 ? (
          <div>Không có chiến dịch nào đã duyệt.</div>
        ) : (
          visibleCampaigns.map(campaign => (
            <Card
              key={campaign.campaignId}
              title={campaign.campaignName}
              style={{ marginBottom: 16 }}
              extra={
                <Button type="primary" onClick={() => handleOpenStudentsModal(campaign)}>
                  Ghi nhận kết quả
                </Button>
              }
            >
              <div>
                <b>Đối tượng:</b> {campaign.targetGroup} &nbsp;|&nbsp;
                <b>Ngày khám:</b> {campaign.scheduledDate}
              </div>
              <div>
                <b>Mô tả:</b> {campaign.description}
              </div>
            </Card>
          ))
        )}
      </Space>

      {/* Modal chọn học sinh và ghi nhận kết quả */}
      <Modal
        title={
          selectedCampaign
            ? `Danh sách học sinh đã đăng ký: ${selectedCampaign.campaignName}`
            : 'Danh sách học sinh đã đăng ký'
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setSelectedStudent(null);
        }}
        footer={null}
        width={selectedStudent ? 900 : 600}
      >
        {!selectedStudent ? (
          loadingStudents ? (
            <div>Đang tải danh sách học sinh...</div>
          ) : registeredStudents.length === 0 ? (
            <div>Không có học sinh nào đã đăng ký tham gia chiến dịch này.</div>
          ) : (
            <Table
              dataSource={registeredStudents}
              rowKey={record => record.studentId}
              pagination={false}
              columns={[
                {
                  title: 'Họ và tên',
                  dataIndex: 'studentId',
                  key: 'studentName',
                  render: (studentId) => getStudentInfo(studentId).fullName
                },
                {
                  title: 'Lớp',
                  dataIndex: 'studentId',
                  key: 'className',
                  render: (studentId) => getStudentInfo(studentId).className
                },
                {
                  title: 'Phụ huynh',
                  dataIndex: 'parentId',
                  key: 'parentName',
                  render: (parentId) => getParentName(parentId)
                },
                {
                  title: 'Hành động',
                  key: 'action',
                  render: (_, record) => (
                    <Button type="primary" onClick={() => handleSelectStudent(record)}>
                      Ghi nhận kết quả
                    </Button>
                  )
                }
              ]}
            />
          )
        ) : (
          <div className="health-check-form">
            <h3>Ghi nhận kết quả cho: {getStudentInfo(selectedStudent.studentId).fullName}</h3>
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
            <div style={{ textAlign: 'right' }}>
              <Button style={{ marginRight: 8 }} onClick={() => setSelectedStudent(null)}>
                Quay lại
              </Button>
              <Button type="primary" loading={loadingSubmit} onClick={handleSubmit}>
                Lưu kết quả
              </Button>
            </div>
          </div>
        )}
      </Modal>

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
    </div>
  );
};

export default HealthCheckResult;