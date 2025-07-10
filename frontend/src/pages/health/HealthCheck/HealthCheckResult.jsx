import React, { useMemo, useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Checkbox, DatePicker, message, Table, Card, Space, Form, Alert, Tabs } from 'antd';
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

  // Filter form
  const [filterForm] = Form.useForm();
  const [allResults, setAllResults] = useState([]);
  const [allResultsLoading, setAllResultsLoading] = useState(false);

  // State for detail modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);

  // Lọc chiến dịch có xác nhận PH
  const visibleCampaigns = useMemo(() => {
    return approvedCampaigns.filter(c => c.parentConfirmation !== false);
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

  // Lọc chiến dịch có xác nhận PH
  const [parentConfirmationTab, setParentConfirmationTab] = useState('confirmed'); // 'confirmed' | 'not_confirmed'

  // Lấy danh sách chiến dịch đã duyệt và kết quả kiểm tra sức khỏe (lọc)
  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoadingCampaigns(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const data = await HealthCheckService.getHealthCheckApproved(config);
        setApprovedCampaigns(Array.isArray(data) ? data : []);
        console.log('Approved campaigns loaded:', data);
      } catch (err) {
        setApprovedCampaigns([]);
      }
      setLoadingCampaigns(false);
    };
    fetchCampaigns();

    fetchFilteredResults();
  }, []);

  // Lọc kết quả kiểm tra sức khỏe
  const fetchFilteredResults = async (filterValues = {}) => {
    setAllResultsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: filterValues
      };
      const res = await HealthCheckService.filterResult(config);
      setAllResults(Array.isArray(res) ? res : []);
      console.log('Filtered results loaded:', res);
    } catch (err) {
      console.error('Lỗi khi lọc kết quả:', err);
      setAllResults([]);
    }
    setAllResultsLoading(false);
  };

  // Xử lý filter
  const handleFilter = (values) => {
    const filterValues = {};

    if (values.className) filterValues.className = values.className.trim();
    if (values.studentName) filterValues.studentName = values.studentName.trim();
    if (values.campaignName) filterValues.campaignName = values.campaignName;
    if (values.parentConfirmation !== undefined) filterValues.isParentConfirmation = values.parentConfirmation;
    if (values.startDate) filterValues.startDate = values.startDate.format('YYYY-MM-DD');
    if (values.endDate) filterValues.endDate = values.endDate.format('YYYY-MM-DD');

    console.log('Đang gửi query:', filterValues);
    fetchFilteredResults(filterValues);
  };

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
      fetchFilteredResults(filterForm.getFieldsValue());
    } catch (err) {
      message.error('Ghi nhận kết quả thất bại!');
    }
    setLoadingSubmit(false);
  };

  // Cột cho bảng tất cả kết quả kiểm tra sức khỏe
  const columns = [
    { 
      title: 'Học sinh', 
      dataIndex: 'studentName', 
      key: 'studentName',
      render: (studentName) => studentName || '-' 
    },
    { 
      title: 'Lớp', 
      dataIndex: 'className', 
      key: 'className',
      render: (className) => className || '-' 
    },
    {
      title: 'Chiến dịch',
      dataIndex: 'campaignName',
      key: 'campaignName',
      render: (campaignName) => campaignName || '-'
    },
    {
      title: 'Ngày khám',
      dataIndex: 'date',
      key: 'date',
      render: (date) => {
        if (!date || !Array.isArray(date)) return '-';
        const [y, m, d] = date;
        if (!y || !m || !d) return '-';
        const pad = (n) => n.toString().padStart(2, '0');
        return `${pad(d)}/${pad(m)}/${y}`;
      }
    },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes', render: (v, record) => record.parentConfirmation === false ? 'Phụ huynh từ chối khám' : (v || '-') },
    {
      title: 'Cập nhật',
      key: 'actions',
      render: (_, record) =>
        record.parentConfirmation ? (
          <Button
            type="link"
            onClick={e => {
              e.stopPropagation();
              navigate('/capnhatketquakiemtra', { state: { result: record } });
            }}
          >
            Cập nhật kết quả
          </Button>
        ) : null,
      width: 140
    }
  ];

  // Xem chi tiết popup
  const handleRowClick = (record) => {
    setDetailRecord(record);
    setDetailModalOpen(true);
  };

  // Khi đổi tab xác nhận PH
  const handleParentConfirmationTabChange = (key) => {
    setParentConfirmationTab(key);
    fetchFilteredResults({
      ...filterForm.getFieldsValue(),
      isParentConfirmation: key === 'confirmed'
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '32px auto' }}>
      <h2>Danh sách chiến dịch kiểm tra sức khỏe đã duyệt</h2>
     
      {/* Filter form (ẩn filter xác nhận PH) */}
      <Card title="Lọc kết quả kiểm tra sức khỏe" bordered style={{ marginBottom: 24 }}>
        <Form layout="inline" form={filterForm} onFinish={handleFilter}>
          <Form.Item name="className" label="Lớp">
            <Input placeholder="Nhập tên lớp" />
          </Form.Item>
          <Form.Item name="campaignName" label="Chiến dịch">
            <Select
              showSearch
              allowClear
              placeholder="Chọn chiến dịch"
              optionFilterProp="children"
              style={{ minWidth: 180 }}
            >
              {approvedCampaigns.map(campaign => (
                <Option key={campaign.campaignId} value={campaign.campaignName}>
                  {campaign.campaignName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {/* Ẩn filter xác nhận PH ở đây */}
          <Form.Item name="studentName" label="Học sinh">
            <Input placeholder="Tên học sinh" />
          </Form.Item>
          <Form.Item name="startDate" label="Từ ngày">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="endDate" label="Đến ngày">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Tìm kiếm</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={() => { filterForm.resetFields(); fetchFilteredResults({ isParentConfirmation: parentConfirmationTab === 'confirmed' }); }}>Xóa</Button>
          </Form.Item>
        </Form>
      </Card>
       {/* Tabs filter xác nhận PH */}
      <Card style={{ marginBottom: 16 }}>
        <Tabs
          activeKey={parentConfirmationTab}
          onChange={handleParentConfirmationTabChange}
          items={[{
            key: 'confirmed',
            label: <Button type={parentConfirmationTab === 'confirmed' ? 'primary' : 'default'}>Đã xác nhận</Button>,
          }, {
            key: 'not_confirmed',
            label: <Button type={parentConfirmationTab === 'not_confirmed' ? 'primary' : 'default'}>Chưa xác nhận</Button>,
          }]}
        />
      </Card>
      {/* Bảng tất cả kết quả kiểm tra sức khỏe cho y tá */}
      <h2 style={{ marginTop: 40 }}>Tất cả kết quả kiểm tra sức khỏe</h2>
      <Table
        dataSource={allResults}
        columns={columns}
        rowKey={record => `${record.studentId}-${record.campaignId}-${record.healthCheckId}`}
        loading={allResultsLoading}
        scroll={{ x: true }}
        onRow={record => ({ onClick: () => handleRowClick(record) })}
        pagination={{ pageSize: 10 }}
      />
      {/* Chi tiết modal */}
      <Modal
        open={detailModalOpen}
        title={detailRecord ? `Chi tiết kiểm tra sức khỏe: ${getStudentInfo(detailRecord.studentId).fullName}` : ''}
        onCancel={() => setDetailModalOpen(false)}
        footer={detailRecord && detailRecord.parentConfirmation ? (
          <Button
            type="primary"
            onClick={() => {
              setDetailModalOpen(false);
              navigate('/capnhatketquakiemtra', { state: { result: detailRecord } });
            }}
          >
            Cập nhật kết quả
          </Button>
        ) : null}
        width={600}
      >
        {detailRecord && (
          <div style={{ lineHeight: 2 }}>
            <div><b>Học sinh:</b> {getStudentInfo(detailRecord.studentId).fullName}</div>
            <div><b>Lớp:</b> {getStudentInfo(detailRecord.studentId).className}</div>
            <div><b>Chiến dịch:</b> {detailRecord.campaignName || '-'}</div>
            <div><b>Ngày khám:</b> {Array.isArray(detailRecord.date) ? `${detailRecord.date[2].toString().padStart(2, '0')}/${detailRecord.date[1].toString().padStart(2, '0')}/${detailRecord.date[0]}` : '-'}</div>
            <div><b>Chiều cao (cm):</b> {detailRecord.height || '-'}</div>
            <div><b>Cân nặng (kg):</b> {detailRecord.weight || '-'}</div>
            <div><b>Thị lực trái:</b> {detailRecord.eyesightLeft || '-'}</div>
            <div><b>Thị lực phải:</b> {detailRecord.eyesightRight || '-'}</div>
            <div><b>Huyết áp:</b> {detailRecord.bloodPressure || '-'}</div>
            <div><b>Thính lực trái:</b> {detailRecord.hearingLeft || '-'}</div>
            <div><b>Thính lực phải:</b> {detailRecord.hearingRight || '-'}</div>
            <div><b>Nhiệt độ:</b> {detailRecord.temperature || '-'}</div>
            <div><b>Ghi chú:</b> {detailRecord.parentConfirmation === false ? 'Phụ huynh từ chối khám' : (detailRecord.notes || '-')}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HealthCheckResult;