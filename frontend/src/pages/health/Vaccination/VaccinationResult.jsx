import React, { useState } from 'react';
import { Card, Button, Modal, List, Form, Input, DatePicker, Select, Checkbox, message, Alert, Tag, Table, Spin } from 'antd';
import VaccinationService from '../../../services/VaccinationService';
import dayjs from 'dayjs';

const { Option } = Select;

const resultOptions = [
  { value: 'SUCCESS', label: 'Thành công' },
  { value: 'FAILED', label: 'Thất bại' },
  { value: 'DELAYED', label: 'Hoãn' },
];

const resultLabel = {
  SUCCESS: <Tag color="green">Thành công</Tag>,
  FAILED: <Tag color="red">Thất bại</Tag>,
  DELAYED: <Tag color="orange">Hoãn</Tag>,
};

const VaccinationResult = () => {
  // Lấy danh sách chiến dịch đã duyệt từ localStorage
  const campaignsRaw = JSON.parse(localStorage.getItem('approvedCampaigns') || '[]');
  const approvedCampaigns = campaignsRaw.map(c => ({
    ...c,
    campaignId: c.campaignId ?? c.id,
    campaignName: c.campaignName ?? c.title,
  }));

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [studentsInCampaign, setStudentsInCampaign] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Ghi nhận kết quả
  const [activeStudent, setActiveStudent] = useState(null);
  const [form] = Form.useForm();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Lấy tất cả kết quả tiêm chủng (giữ nguyên)
  const [allResults, setAllResults] = useState([]);
  const [allResultsLoading, setAllResultsLoading] = useState(false);

  React.useEffect(() => {
    const fetchAllResults = async () => {
      setAllResultsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await VaccinationService.getAllVaccinationResults(config);
        setAllResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setAllResults([]);
      }
      setAllResultsLoading(false);
    };
    fetchAllResults();
  }, []);

  // Helper
  const getCampaignName = (campaignId) => {
    const c = approvedCampaigns.find(ca => String(ca.campaignId) === String(campaignId));
    return c ? c.campaignName : campaignId;
    
  };
  console.log("approvedCampaigns:", approvedCampaigns);

  // Hiển thị modal và load học sinh đã đăng ký chiến dịch
  const handleOpenModal = async (campaign) => {
    setSelectedCampaign(campaign);
    setOpenModal(true);
    setLoadingStudents(true);
    setActiveStudent(null);
    setSubmitStatus(null);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Gọi API lấy danh sách học sinh đã đăng ký chiến dịch
      const res = await VaccinationService.getVaccinationParentConfirmation(campaign.campaignId, config);
       
      setStudentsInCampaign(Array.isArray(res.data) ? res.data : []);
      console.log("studentInCampaign:" ,res.data);
    } catch (err) {
      setStudentsInCampaign([]);
      message.error("Không thể tải danh sách học sinh.");
    }
    setLoadingStudents(false);
  };

  // Ghi nhận kết quả tiêm chủng cho học sinh
  const handleSubmit = async (values) => {
    setLoadingSubmit(true);
    setSubmitStatus(null);
    try {
      const payload = {
        date: values.date ? values.date.format('YYYY-MM-DD') : '',
        doseNumber: values.doseNumber,
        adverseReaction: values.adverseReaction,
        isPreviousDose: values.previousDose,
        notes: values.notes,
        parentConfirmation: values.parentConfirmation,
        result: values.result,
        vaccineName: values.vaccineName,
        studentId: activeStudent.studentId,
        campaignId: selectedCampaign.campaignId,
      };
      const token = localStorage.getItem('token');
      await VaccinationService.vaccinationResult(payload.campaignId, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSubmitStatus('success');
      form.resetFields();
      setActiveStudent(null);
    } catch (err) {
      setSubmitStatus('error');
    }
    setLoadingSubmit(false);
  };

  // Cột cho bảng kết quả tiêm chủng
  const columns = [
    {
      title: 'Học sinh',
      dataIndex: 'studentId',
      key: 'studentId',
      render: (studentId) => {
        const s = studentsInCampaign.find(st => String(st.studentId) === String(studentId));
        return s ? s.fullName || s.name : studentId;
      },
    },
    {
      title: 'Chiến dịch',
      dataIndex: 'campaignId',
      key: 'campaignId',
      render: (campaignId) => getCampaignName(campaignId),
    },
    { title: 'Ngày tiêm', dataIndex: 'date', key: 'date' },
    { title: 'Tên vắc-xin', dataIndex: 'vaccineName', key: 'vaccineName' },
    { title: 'Số mũi', dataIndex: 'doseNumber', key: 'doseNumber' },
    { title: 'Phản ứng', dataIndex: 'adverseReaction', key: 'adverseReaction' },
    { title: 'Ghi chú', dataIndex: 'notes', key: 'notes' },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      render: (result) => resultLabel[result] || result,
    },
    {
      title: 'Xác nhận PH',
      dataIndex: 'parentConfirmation',
      key: 'parentConfirmation',
      render: (val) => val ? <Tag color="green">Đã xác nhận</Tag> : <Tag color="default">Chưa</Tag>,
    },
    {
      title: 'Đã tiêm mũi trước',
      dataIndex: 'isPreviousDose',
      key: 'isPreviousDose',
      render: (val) => val ? 'Có' : 'Không',
    },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '32px auto' }}>
      <Card title="Danh sách chiến dịch đã duyệt" bordered style={{ marginBottom: 32 }}>
        <List
          dataSource={approvedCampaigns}
          renderItem={campaign => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  onClick={() => handleOpenModal(campaign)}
                  key="record"
                >
                  Ghi nhận kết quả
                </Button>
              ]}
            >
              <span>{campaign.campaignName}</span>
            </List.Item>
          )}
        />
      </Card>

      {/* Modal ghi nhận kết quả cho từng học sinh trong chiến dịch */}
      <Modal
        open={openModal}
        title={selectedCampaign ? `Ghi nhận kết quả cho chiến dịch: ${selectedCampaign.campaignName}` : ""}
        onCancel={() => { setOpenModal(false); setActiveStudent(null); }}
        footer={null}
        width={700}
      >
        {loadingStudents ? (
          <Spin />
        ) : (
          <>
           {!activeStudent ? (
  <>
    {console.log("studentsInCampaign render:", studentsInCampaign)}
    <List
      dataSource={studentsInCampaign}
      renderItem={student => (
        <List.Item
          actions={[
            <Button
              type="primary"
              onClick={() => { setActiveStudent(student); setSubmitStatus(null); }}
              key="record"
            >
              Ghi nhận kết quả
            </Button>
          ]}
        >
          <span>{student.fullName || student.name}</span>
        </List.Item>
      )}
    />
  </>
) : (
              <Card
                title={`Ghi nhận kết quả cho: ${activeStudent.fullName || activeStudent.name}`}
                bordered
              >
                {submitStatus === 'success' && (
                  <Alert
                    message="Ghi nhận kết quả tiêm chủng thành công!"
                    type="success"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}
                {submitStatus === 'error' && (
                  <Alert
                    message="Ghi nhận thất bại! Vui lòng kiểm tra lại thông tin."
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                  />
                )}
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={{
                    date: dayjs(),
                    doseNumber: 1,
                    parentConfirmation: true,
                    previousDose: false,
                  }}
                >
                  <Form.Item label="Tên học sinh">
                    <Input value={activeStudent.fullName || activeStudent.name} disabled />
                  </Form.Item>
                  <Form.Item label="Tên chiến dịch">
                    <Input value={selectedCampaign.campaignName} disabled />
                  </Form.Item>
                  <Form.Item
                    label="Ngày tiêm"
                    name="date"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày tiêm' }]}
                  >
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                  </Form.Item>
                  <Form.Item
                    label="Tên vắc-xin"
                    name="vaccineName"
                    rules={[{ required: true, message: 'Vui lòng nhập tên vắc-xin' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Số mũi tiêm"
                    name="doseNumber"
                    rules={[{ required: true, message: 'Vui lòng nhập số mũi tiêm' }]}
                  >
                    <Input type="number" min={1} />
                  </Form.Item>
                  <Form.Item
                    label="Phản ứng sau tiêm"
                    name="adverseReaction"
                    rules={[{ required: true, message: 'không được để trống' }]}
                  >
                    <Input.TextArea rows={2} placeholder="Ghi chú phản ứng nếu có" />
                  </Form.Item>
                  <Form.Item label="Ghi chú" name="notes">
                    <Input.TextArea rows={2} />
                  </Form.Item>
                  <Form.Item name="parentConfirmation" valuePropName="checked">
                    <Checkbox>Xác nhận của phụ huynh</Checkbox>
                  </Form.Item>
                  <Form.Item
                    label="Kết quả"
                    name="result"
                    rules={[{ required: true, message: 'Kết quả không được để trống' }]}
                  >
                    <Select placeholder="Chọn kết quả">
                      {resultOptions.map(opt => (
                        <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item name="previousDose" valuePropName="checked">
                    <Checkbox>Đã tiêm mũi trước</Checkbox>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loadingSubmit}
                    >
                      Ghi nhận kết quả
                    </Button>
                    <Button
                      style={{ marginLeft: 12 }}
                      onClick={() => {
                        setActiveStudent(null);
                        form.resetFields();
                        setSubmitStatus(null);
                      }}
                    >
                      Hủy
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            )}
          </>
        )}
      </Modal>

      <Card title="Tất cả kết quả tiêm chủng" bordered style={{ marginTop: 40 }}>
        <Table
          dataSource={allResults}
          columns={columns}
          rowKey={record => `${record.studentId}-${record.campaignId}-${record.date}`}
          loading={allResultsLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default VaccinationResult;