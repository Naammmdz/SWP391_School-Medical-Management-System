import React, { useCallback, useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, DatePicker, Select, Checkbox, Alert, Tag, Table } from 'antd';
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
  const [approvedCampaigns, setApprovedCampaigns] = useState([]);
  const [filterValues, setFilterValues] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const [confirmedResults, setConfirmedResults] = useState([]);
  const [confirmedLoading, setConfirmedLoading] = useState(false);

  const [filterForm] = Form.useForm();
  const [studentInfoMap, setStudentInfoMap] = useState({});

  // Lấy danh sách chiến dịch đã duyệt từ API
  const fetchApprovedCampaigns = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await VaccinationService.getVaccinationCampaignApproved(config);
      setApprovedCampaigns(Array.isArray(res.data) ? res.data : []);
      console.log('Approved campaigns:', res.data);
    } catch (err) {
      setApprovedCampaigns([]);
    }
  }, []);
  useEffect(() => {
    fetchApprovedCampaigns();
    // Lấy danh sách học sinh từ localStorage
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const map = {};
    students.forEach(s => {
      map[s.studentId] = {
        name: s.fullName || s.name || '',
        className: s.className || '',
      };
    });
    setStudentInfoMap(map);
  }, [fetchApprovedCampaigns]);

  // Hàm lấy kết quả PH đã xác nhận hoặc filter theo điều kiện
  const fetchConfirmedResults = async (filterValues = {}) => {
    setConfirmedLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` }, params: filterValues };
      let res;
      
        // Không filter, lấy tất cả kết quả PH đã xác nhận
        res = await VaccinationService.filterResult(config);
       
     
      setConfirmedResults(Array.isArray(res.data) ? res.data : []);
      console.log('Confirmed results:', res.data);
    } catch (err) {
      setConfirmedResults([]);
    }
    setConfirmedLoading(false);
  };

  useEffect(() => {
    fetchConfirmedResults();
  }, []);

  const getCampaignInfo = (campaignId) => {
    const c = approvedCampaigns.find(ca => String(ca.campaignId) === String(campaignId));
    return c || {};
  };

  const getStudentName = (studentId, record) => {
    return studentInfoMap[studentId]?.name || record.studentName || record.fullName || record.name || studentId;
  };

  const getStudentClass = (studentId) => {
    return studentInfoMap[studentId]?.className || '';
  };

  const handleOpenUpdateModal = (record) => {
    setSelectedResult(record);
    setSubmitStatus(null);
  };

  const [updateForm] = Form.useForm();
  const handleUpdateSubmit = async (values) => {
  setLoadingSubmit(true);
  setSubmitStatus(null);
  try {
    // Xử lý lại trường date: nếu là object dayjs thì chuyển về array [yyyy, mm, dd]
    let dateArr = [];
    if (values.date && dayjs.isDayjs(values.date)) {
      dateArr = [values.date.year(), values.date.month() + 1, values.date.date()];
    } else if (Array.isArray(selectedResult.date)) {
      dateArr = selectedResult.date;
    } else if (selectedResult.date && typeof selectedResult.date === 'string') {
      // Nếu là string "2025-06-26"
      const parts = selectedResult.date.split('-');
      if (parts.length === 3) {
        dateArr = [parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2])];
      }
    }

    const payload = {
      vaccinationId: selectedResult.vaccinationId,
      date: dateArr,
      doseNumber: values.doseNumber,
      adverseReaction: values.adverseReaction,
      notes: values.notes,
      parentConfirmation: values.parentConfirmation,
      result: values.result,
      vaccineName: selectedResult.vaccineName || getCampaignInfo(selectedResult.campaignId).type || '',
      studentId: selectedResult.studentId,
      campaignId: selectedResult.campaignId,
      previousDose: values.previousDose,
    };
    const token = localStorage.getItem('token');
    await VaccinationService.updateVaccinationResult(selectedResult.vaccinationId, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setSubmitStatus('success');
    fetchConfirmedResults(filterForm.getFieldsValue());
    setSelectedResult(null);
  } catch (err) {
    setSubmitStatus('error');
  }
  setLoadingSubmit(false);
};

  const columns = [
  {
    title: 'Học sinh',
    dataIndex: 'studentId',
    key: 'studentId',
    render: (studentId, record) => (
      <div>
        <b>{getStudentName(studentId, record)}</b>
      </div>
    ),
  },
  {
    title: 'Lớp',
    dataIndex: 'className',
    key: 'className',
    render: (_, record) => {
      // Lấy từ targetGroup của campaign
      const info = getCampaignInfo(record.campaignId);
      return info.targetGroup || '';
    },
  },
  {
    title: 'Chiến dịch',
    dataIndex: 'campaignId',
    key: 'campaignId',
    render: (campaignId, record) => {
      const info = getCampaignInfo(campaignId);
      return <b>{info.campaignName || campaignId}</b>;
    },
  },
  {
    title: 'Ngày tiêm',
    dataIndex: 'date',
    key: 'date',
    render: (date, record) => {
      const info = getCampaignInfo(record.campaignId);
      if (date) return date;
      if (Array.isArray(info.scheduledDate)) {
        const [y, m, d] = info.scheduledDate;
        return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      }
      return '';
    }
  },
  {
    title: 'Tên vắc-xin',
    dataIndex: 'vaccineName',
    key: 'vaccineName',
    render: (vaccineName, record) => {
      const info = getCampaignInfo(record.campaignId);
      return vaccineName || info.type || '';
    }
  },
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
  {
  title: 'Thao tác',
  key: 'actions',
  render: (_, record) =>
    record.parentConfirmation ? (
      <Button type="link" onClick={() => handleOpenUpdateModal(record)}>
        Cập nhật kết quả
      </Button>
    ) : null,
},
];

  // Xử lý filter
  const handleFilter = (values) => {
    const filterValues = { ...values };
    if (filterValues.startDate) filterValues.startDate = filterValues.startDate.format('YYYY-MM-DD');
    if (filterValues.endDate) filterValues.endDate = filterValues.endDate.format('YYYY-MM-DD');
    fetchConfirmedResults(filterValues);
  };

  return (
    <div style={{ maxWidth: 900, margin: '32px auto' }}>
      {/* Filter form */}
      <Card title="Lọc kết quả tiêm chủng đã xác nhận PH" bordered style={{ marginBottom: 24 }}>
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
  <Form.Item name="parentConfirmation" label="Xác nhận PH">
    <Select
      allowClear
      placeholder="Chọn trạng thái"
      style={{ minWidth: 150 }}
    >
      <Option value={true}>Đã xác nhận</Option>
      <Option value={false}>Chưa xác nhận</Option>
    </Select>
  </Form.Item>
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
    <Button onClick={() => { filterForm.resetFields(); fetchConfirmedResults(); }}>Xóa</Button>
  </Form.Item>
</Form>
      </Card>

      {/* Modal update kết quả */}
      <Modal
        open={!!selectedResult}
        title={selectedResult ? `Update kết quả cho: ${getStudentName(selectedResult.studentId, selectedResult)}` : ""}
        onCancel={() => setSelectedResult(null)}
        footer={null}
        width={700}
        destroyOnClose
      >
        {selectedResult && (
          <Card bordered>
            <div style={{ marginBottom: 12, color: '#555' }}>
              <b>Lớp:</b> {getStudentClass(selectedResult.studentId)}
            </div>
            {submitStatus === 'success' && (
              <Alert
                message="Cập nhật kết quả tiêm chủng thành công!"
                type="success"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            {submitStatus === 'error' && (
              <Alert
                message="Cập nhật thất bại! Vui lòng kiểm tra lại thông tin."
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            <Form
              form={updateForm}
              layout="vertical"
              onFinish={handleUpdateSubmit}
              initialValues={{
                date: selectedResult.date ? dayjs(selectedResult.date) : dayjs(),
                doseNumber: selectedResult.doseNumber,
                parentConfirmation: selectedResult.parentConfirmation,
                previousDose: selectedResult.isPreviousDose,
                vaccineName: selectedResult.vaccineName,
                adverseReaction: selectedResult.adverseReaction,
                notes: selectedResult.notes,
                result: selectedResult.result,
              }}
            >
              <Form.Item label="Tên học sinh">
                <Input value={getStudentName(selectedResult.studentId, selectedResult)} disabled />
              </Form.Item>
              <Form.Item label="Tên chiến dịch">
                <Input value={getCampaignInfo(selectedResult.campaignId).campaignName || selectedResult.campaignId} disabled />
              </Form.Item>
              <Form.Item
                label="Ngày tiêm"
                name="date"
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: '100%' }}
                  value={selectedResult.date ? dayjs(selectedResult.date) : dayjs()}
                  disabled
                />
              </Form.Item>
         <Form.Item label="Tên vắc-xin">
  <Input
    value={selectedResult.vaccineName || getCampaignInfo(selectedResult.campaignId).type || ''}
    disabled
  />
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
                  Cập nhật kết quả
                </Button>
                <Button
                  style={{ marginLeft: 12 }}
                  onClick={() => {
                    setSelectedResult(null);
                    updateForm.resetFields();
                    setSubmitStatus(null);
                  }}
                >
                  Hủy
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}
      </Modal>

      <Card title="Kết quả tiêm chủng đã xác nhận PH" bordered style={{ marginTop: 40 }}>
        <Table
          dataSource={confirmedResults}
          columns={columns}
          rowKey={record => `${record.studentId}-${record.campaignId}-${record.date}`}
          loading={confirmedLoading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
};

export default VaccinationResult;