import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Card, Select, Checkbox, message, List, Alert, Table, Tag } from 'antd';
import VaccinationService from '../../../services/VaccinationService';
import dayjs from 'dayjs';
import { useWatch } from 'antd/es/form/Form';

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

const VaccinationResult = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Thông báo trạng thái ghi nhận
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  // Lấy danh sách học sinh từ localStorage (ưu tiên studentId, fallback id)
  const studentsRaw = JSON.parse(localStorage.getItem('students') || '[]');
  const students = studentsRaw.map(s => ({
    ...s,
    studentId: s.studentId ?? s.id,
  }));

  // Lấy danh sách chiến dịch đã APPROVED từ localStorage (ưu tiên campaignId, fallback id)
  const campaignsRaw = JSON.parse(localStorage.getItem('approvedCampaigns') || '[]');
  const approvedCampaigns = campaignsRaw.map(c => ({
    ...c,
    campaignId: c.campaignId ?? c.id,
    campaignName: c.campaignName ?? c.title,
  }));

  // State để xác định học sinh nào đang được ghi nhận kết quả
  const [activeStudentId, setActiveStudentId] = useState(null);

  // Theo dõi campaignId trong form
  const campaignId = useWatch('campaignId', form);
  const selectedCampaign = approvedCampaigns.find(c => String(c.campaignId) === String(campaignId));

  // Lấy học sinh đang active
  const activeStudent = students.find(s => String(s.studentId) === String(activeStudentId));

  // State & fetch cho tất cả kết quả tiêm chủng
  const [allResults, setAllResults] = useState([]);
  const [allResultsLoading, setAllResultsLoading] = useState(false);

  useEffect(() => {
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

  // Helper: lấy tên học sinh từ studentId
  const getStudentName = (studentId) => {
    const s = students.find(st => String(st.studentId) === String(studentId));
    return s ? s.fullName || s.name : studentId;
  };
  // Helper: lấy tên chiến dịch từ campaignId
  const getCampaignName = (campaignId) => {
    const c = approvedCampaigns.find(ca => String(ca.campaignId) === String(campaignId));
    return c ? c.campaignName : campaignId;
  };

  const handleSubmit = async (values) => {
    setLoading(true);
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
        campaignId: values.campaignId,
      };
      const token = localStorage.getItem('token');
      await VaccinationService.vaccinationResult(payload.campaignId, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSubmitStatus('success');
      form.resetFields();
      setActiveStudentId(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setSubmitStatus('error');
    }
    setLoading(false);
  };

  // Cột cho bảng kết quả tiêm chủng
  const columns = [
    {
      title: 'Học sinh',
      dataIndex: 'studentId',
      key: 'studentId',
      render: (studentId) => getStudentName(studentId),
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
      <Card title="Danh sách học sinh" bordered style={{ marginBottom: 32 }}>
        <List
          dataSource={students}
          renderItem={student => (
            <List.Item
              actions={[
                <Button
                  type="primary"
                  onClick={() => {
                    setActiveStudentId(student.studentId);
                    setSubmitStatus(null);
                  }}
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
      </Card>

      {activeStudent && (
        <Card
          title={`Ghi nhận kết quả tiêm chủng cho: ${activeStudent.fullName || activeStudent.name}`}
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

            <Form.Item
              label="Chọn chiến dịch tiêm chủng"
              name="campaignId"
              rules={[{ required: true, message: 'Vui lòng chọn chiến dịch' }]}
            >
              <Select
                showSearch
                placeholder="Chọn chiến dịch"
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {approvedCampaigns.map(campaign => (
                  <Option key={campaign.campaignId} value={campaign.campaignId}>
                    {campaign.campaignName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {selectedCampaign && (
              <Form.Item label="Tên chiến dịch">
                <Input value={selectedCampaign.campaignName} disabled />
              </Form.Item>
            )}

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
                loading={loading}
              >
                Ghi nhận kết quả
              </Button>
              <Button
                style={{ marginLeft: 12 }}
                onClick={() => {
                  setActiveStudentId(null);
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