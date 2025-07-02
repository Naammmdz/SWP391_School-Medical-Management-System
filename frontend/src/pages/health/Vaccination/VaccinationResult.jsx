import React, { useCallback, useState, useEffect } from 'react';
import VaccinationService from '../../../services/VaccinationService';
import dayjs from 'dayjs';
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Checkbox,
  Alert,
  Tag,
  Row,
  Col,
  Table,
  Spin,
  Typography,
  Space,
  DatePicker,
  message,
  Tooltip,
  Badge,
  Descriptions,
  Empty,
  Divider,
  Tabs
} from 'antd';
import {
  SearchOutlined,
  ClearOutlined,
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import './VaccinationResult.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const resultOptions = [
  { value: 'SUCCESS', label: 'Thành công', color: 'success' },
  { value: 'FAILED', label: 'Thất bại', color: 'error' },
  { value: 'DELAYED', label: 'Hoãn', color: 'warning' },
];

const getResultTag = (result) => {
  switch (result) {
    case 'SUCCESS':
      return <Tag color="green" icon={<CheckCircleOutlined />}>Thành công</Tag>;
    case 'FAILED':
      return <Tag color="red" icon={<CloseCircleOutlined />}>Thất bại</Tag>;
    case 'DELAYED':
      return <Tag color="orange" icon={<ExclamationCircleOutlined />}>Hoãn</Tag>;
    default:
      return <Tag>{result}</Tag>;
  }
};

const VaccinationResult = () => {
  const [approvedCampaigns, setApprovedCampaigns] = useState([]);
  const [filterValues, setFilterValues] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [confirmedResults, setConfirmedResults] = useState([]);
  const [confirmedLoading, setConfirmedLoading] = useState(false);
  const [filterForm, setFilterForm] = useState({});
  const [studentInfoMap, setStudentInfoMap] = useState({});
  const [openDetail, setOpenDetail] = useState(false);
  const [updateForm, setUpdateForm] = useState({});
  const [form] = Form.useForm();
  const [updateFormRef] = Form.useForm();
  const [parentConfirmationTab, setParentConfirmationTab] = useState('confirmed'); // 'confirmed' | 'not_confirmed'

  // Lấy danh sách chiến dịch đã duyệt từ API
  const fetchApprovedCampaigns = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await VaccinationService.getVaccinationCampaignApproved(config);
      setApprovedCampaigns(Array.isArray(res.data) ? res.data : []);
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
      // Luôn gửi parentConfirmation đúng kiểu boolean theo tab
      const params = {
        ...filterValues,
        parentConfirmation: parentConfirmationTab === 'confirmed',
      };
      const config = { headers: { Authorization: `Bearer ${token}` }, params };
      let res = await VaccinationService.filterResult(config);
      setConfirmedResults(Array.isArray(res.data) ? res.data : []);
      console.log(res.data);
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

  // Xử lý filter
  const handleFilter = (values) => {
    setFilterForm(values);
    fetchConfirmedResults({
      ...values,
      parentConfirmation: parentConfirmationTab === 'confirmed',
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    setFilterForm(prev => ({ ...prev, [name]: value ? value.format('YYYY-MM-DD') : '' }));
  };

  // Xem chi tiết
  const handleOpenDetail = (record) => {
    setSelectedResult(record);
    setUpdateForm({
      date: record.date ? dayjs(record.date) : dayjs(),
      doseNumber: record.doseNumber,
      parentConfirmation: record.parentConfirmation,
      previousDose: record.isPreviousDose,
      vaccineName: record.vaccineName,
      adverseReaction: record.adverseReaction,
      notes: record.notes,
      result: record.result,
    });
    setSubmitStatus(null);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedResult(null);
    setSubmitStatus(null);
  };

  // Cập nhật kết quả
  const handleUpdateSubmit = async (values) => {
    setLoadingSubmit(true);
    setSubmitStatus(null);
    try {
      let dateArr = [];
      if (values.date && dayjs.isDayjs(values.date)) {
        dateArr = [values.date.year(), values.date.month() + 1, values.date.date()];
      } else if (Array.isArray(selectedResult.date)) {
        dateArr = selectedResult.date;
      } else if (selectedResult.date && typeof selectedResult.date === 'string') {
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
      fetchConfirmedResults(filterForm);
      setOpenDetail(false);
    } catch (err) {
      setSubmitStatus('error');
    }
    setLoadingSubmit(false);
  };

  const handleParentConfirmationTabChange = (key) => {
    setParentConfirmationTab(key);
    fetchConfirmedResults({
      ...filterForm,
      parentConfirmation: key === 'confirmed',
    });
  };

  // Table columns configuration
  const columns = [
    {
      title: 'Học sinh',
      dataIndex: 'studentId',
      key: 'studentId',
      render: (studentId, record) => getStudentName(studentId, record)
    },
    {
      title: 'Lớp',
      dataIndex: 'studentId',
      key: 'className',
      render: (studentId) => getStudentClass(studentId)
    },
    {
      title: 'Chiến dịch',
      dataIndex: 'campaignId',
      key: 'campaignId',
      render: (campaignId) => getCampaignInfo(campaignId).campaignName || campaignId
    },
    {
      title: 'Ngày tiêm',
      dataIndex: 'date',
      key: 'date',
      render: (date, record) => {
        if (date) return date;
        const campaign = getCampaignInfo(record.campaignId);
        return Array.isArray(campaign.scheduledDate) ? campaign.scheduledDate.join('-') : '';
      }
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      render: (result) => getResultTag(result)
    },
    {
      title: 'Xác nhận PH',
      dataIndex: 'parentConfirmation',
      key: 'parentConfirmation',
      render: (parentConfirmation) => (
        parentConfirmation ? 
          <Tag color="green" icon={<CheckCircleOutlined />}>Đã xác nhận</Tag> : 
          <Tag color="orange">Đã từ chối</Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        record.parentConfirmation ? (
          <Button 
            type="primary" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleOpenDetail(record)}
          >
            Xem chi tiết
          </Button>
        ) : null
      )
    }
  ];

  return (
    <div className="vaccination-result" style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: '#15803d' }}>
            <MedicineBoxOutlined style={{ marginRight: 12 }} />
            Kết quả tiêm chủng
          </Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={() => fetchConfirmedResults(filterForm)}
          >
            Làm mới
          </Button>
        </Col>
      </Row>

      {/* Filter Card */}
      <Card 
        title={
          <Space>
            <FilterOutlined />
            <span>Lọc kết quả tiêm chủng</span>
          </Space>
        }
        style={{ marginBottom: 24, borderRadius: 8 }}
      >
        <Form layout="vertical" onFinish={handleFilter}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Tên lớp">
                <Input
                  name="className"
                  placeholder="Nhập tên lớp"
                  value={filterForm.className || ''}
                  onChange={handleFilterChange}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Chiến dịch">
                <Select
                  name="campaignName"
                  placeholder="Chọn chiến dịch"
                  value={filterForm.campaignName || undefined}
                  onChange={(value) => setFilterForm(prev => ({ ...prev, campaignName: value }))}
                  allowClear
                >
                  {approvedCampaigns.map(campaign => (
                    <Option key={campaign.campaignId} value={campaign.campaignName}>
                      {campaign.campaignName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Tên học sinh">
                <Input
                  name="studentName"
                  placeholder="Nhập tên học sinh"
                  value={filterForm.studentName || ''}
                  onChange={handleFilterChange}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Từ ngày">
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Chọn ngày bắt đầu"
                  onChange={(value) => handleDateChange('startDate', value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label="Đến ngày">
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Chọn ngày kết thúc"
                  onChange={(value) => handleDateChange('endDate', value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end" gutter={[8, 8]}>
            <Col>
              <Button icon={<ClearOutlined />} onClick={() => { setFilterForm({}); fetchConfirmedResults({ parentConfirmation: parentConfirmationTab === 'confirmed' }); }}>
                Xóa bộ lọc
              </Button>
            </Col>
            <Col>
              <Button 
            type="primary" 
            
            onClick={() => fetchConfirmedResults(filterForm)}
          >
            Tìm kiếm
          </Button>
            </Col>
          </Row>
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
            label: <Button type={parentConfirmationTab === 'not_confirmed' ? 'primary' : 'default'}>Đã từ chối</Button>,
          }]}
        />
      </Card>

      {/* Results Table */}
      <Card
        title={
          <Space>
            <TeamOutlined />
            <span>Kết quả tiêm chủng đã xác nhận</span>
            <Badge count={confirmedResults.length} style={{ backgroundColor: '#15803d' }} />
          </Space>
        }
        style={{ borderRadius: 8 }}
      >
        <Table
          columns={columns}
          dataSource={confirmedResults}
          loading={confirmedLoading}
          rowKey={record => record.vaccinationId ? String(record.vaccinationId) : `${record.studentId}-${record.campaignId}-${record.date || 'no-date'}`}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} kết quả`
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có dữ liệu"
              />
            )
          }}
          scroll={{ x: 800 }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            <span>Cập nhật kết quả tiêm chủng</span>
          </Space>
        }
        open={openDetail}
        onCancel={handleCloseDetail}
        width={800}
        footer={null}
      >
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
        
        {selectedResult && (
          <Form layout="vertical" onFinish={handleUpdateSubmit} initialValues={updateForm}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item label="Tên học sinh">
                  <Input
                    value={getStudentName(selectedResult.studentId, selectedResult)}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Tên chiến dịch">
                  <Input
                    value={getCampaignInfo(selectedResult.campaignId).campaignName || selectedResult.campaignId}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Ngày tiêm" name="date">
                  <DatePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Tên vắc-xin">
                  <Input
                    value={selectedResult.vaccineName || getCampaignInfo(selectedResult.campaignId).type || ''}
                    disabled
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Số mũi tiêm" name="doseNumber" rules={[{ required: true, message: 'Vui lòng nhập số mũi tiêm' }]}> 
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Phản ứng sau tiêm" name="adverseReaction" rules={[{ required: true, message: 'Vui lòng nhập phản ứng sau tiêm' }]}> 
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item label="Ghi chú" name="notes">
                  <Input.TextArea rows={3} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="parentConfirmation" valuePropName="checked">
                  <Checkbox>
                    Xác nhận của phụ huynh
                  </Checkbox>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Kết quả" name="result" rules={[{ required: true, message: 'Vui lòng chọn kết quả' }]}> 
                  <Select placeholder="Chọn kết quả">
                    {resultOptions.map(opt => (
                      <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24}>
                <Form.Item name="previousDose" valuePropName="checked">
                  <Checkbox>
                    Đã tiêm mũi trước
                  </Checkbox>
                </Form.Item>
              </Col>
            </Row>
            
            <Divider />
            
            <Row justify="end" gutter={[8, 8]}>
              <Col>
                <Button onClick={handleCloseDetail}>
                  Hủy
                </Button>
              </Col>
              <Col>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loadingSubmit}
                  icon={<CheckCircleOutlined />}
                >
                  Cập nhật kết quả
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Modal>
    </div>
  );
};

export default VaccinationResult;