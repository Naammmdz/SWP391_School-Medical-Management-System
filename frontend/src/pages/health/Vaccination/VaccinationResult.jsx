import React, { useCallback, useState, useEffect } from 'react';
import VaccinationService from '../../../services/VaccinationService';
import UserService from '../../../services/UserService';
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
// Lấy danh sách học sinh từ localStorage, nếu rỗng thì fetch từ backend
    let students = [];
    try {
      students = JSON.parse(localStorage.getItem('students') || '[]');
    } catch {
      students = [];
    }
    if (!students || students.length === 0) {
      // Gọi API lấy danh sách học sinh nếu localStorage rỗng
      const fetchStudents = async () => {
        try {
          const token = localStorage.getItem('token');
          const config = { headers: { Authorization: `Bearer ${token}` } };
          const res = await UserService.getAllStudents(config);
          const studentList = Array.isArray(res.data) ? res.data : [];
          localStorage.setItem('students', JSON.stringify(studentList));
          const map = {};
          studentList.forEach(s => {
            map[s.studentId] = {
              name: s.fullName || s.name || '',
              className: s.className || '',
            };
          });
          setStudentInfoMap(map);
          console.log('Fetched students:', studentList);
        } catch {
          setStudentInfoMap({});
        }
      };
      fetchStudents();
    } else {
      const map = {};
      students.forEach(s => {
        map[s.studentId] = {
          name: s.fullName || s.name || '',
          className: s.className || '',
        };
      });
      setStudentInfoMap(map);
    }
  }, [fetchApprovedCampaigns]);

  // Hàm lấy kết quả PH đã xác nhận hoặc filter theo điều kiện
  const fetchConfirmedResults = async (filterValues = {}) => {
    setConfirmedLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Ensure parentConfirmation is properly set based on the current tab or passed value
      const parentConfirmation = filterValues.hasOwnProperty('parentConfirmation')
          ? filterValues.parentConfirmation
          : parentConfirmationTab === 'confirmed';

      const params = {
        ...filterValues,
        parentConfirmation: parentConfirmation,
      };

      console.log('Fetching with params:', params); // Debug log

      const config = { headers: { Authorization: `Bearer ${token}` }, params };
      let res = await VaccinationService.filterResult(config);
      setConfirmedResults(Array.isArray(res.data) ? res.data : []);
      console.log('Response data:', res.data);
      console.log('Sample record structure:', res.data[0] || 'No data');
      if (res.data && res.data.length > 0) {
        console.log('Available fields:', Object.keys(res.data[0]));
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setConfirmedResults([]);
    }
    setConfirmedLoading(false);
  };

  useEffect(() => {
    // Load confirmed results by default
    fetchConfirmedResults({ parentConfirmation: true });
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

  // Real-time filter handling
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilterForm = { ...filterForm, [name]: value };
    setFilterForm(newFilterForm);

    // Apply filter immediately
    fetchConfirmedResults({
      ...newFilterForm,
      parentConfirmation: parentConfirmationTab === 'confirmed',
    });
  };

  const handleSelectChange = (name, value) => {
    const newFilterForm = { ...filterForm, [name]: value };
    setFilterForm(newFilterForm);

    // Apply filter immediately
    fetchConfirmedResults({
      ...newFilterForm,
      parentConfirmation: parentConfirmationTab === 'confirmed',
    });
  };

  const handleDateChange = (name, value) => {
    const newFilterForm = { ...filterForm, [name]: value ? value.format('YYYY-MM-DD') : null };
    setFilterForm(newFilterForm);

    // Apply filter immediately
    fetchConfirmedResults({
      ...newFilterForm,
      parentConfirmation: parentConfirmationTab === 'confirmed',
    });
  };

  const handleClearFilters = () => {
    setFilterForm({});
    fetchConfirmedResults({
      parentConfirmation: parentConfirmationTab === 'confirmed'
    });
  };

  // Xem chi tiết
  const handleOpenDetail = (record) => {
    console.log('Debug - Record data:', record);
    console.log('Debug - scheduledDate:', record.scheduledDate);
    console.log('Debug - date:', record.date);
    
    // Clear previous selected result first
    setSelectedResult(null);
    setUpdateForm({});
    
    // Get campaign info to determine the correct scheduled date
    const campaignInfo = getCampaignInfo(record.campaignId);
    let scheduledDate = null;
    
    // For scheduled date, prioritize: record.scheduledDate > campaign.scheduledDate
    // DO NOT use record.date as it's the actual vaccination date
    if (record.scheduledDate) {
      scheduledDate = record.scheduledDate;
    } else if (campaignInfo.scheduledDate) {
      scheduledDate = Array.isArray(campaignInfo.scheduledDate) 
        ? campaignInfo.scheduledDate.join('-') 
        : campaignInfo.scheduledDate;
    }
    
    console.log('Debug - Determined scheduledDate:', scheduledDate);
    
    const formData = {
      scheduledDate: scheduledDate ? dayjs(scheduledDate) : null,
      actualDate: record.date ? dayjs(record.date) : dayjs(), // Ngày thực hiện tiêm, mặc định hôm nay
      doseNumber: record.doseNumber,
      parentConfirmation: record.parentConfirmation,
      previousDose: record.isPreviousDose,
      vaccineName: record.vaccineName,
      adverseReaction: record.adverseReaction,
      notes: record.notes,
      result: record.result,
    };
    
    console.log('Debug - Form data:', formData);
    console.log('Debug - Form scheduledDate value:', formData.scheduledDate ? formData.scheduledDate.format('YYYY-MM-DD') : 'null');
    console.log('Debug - Form actualDate value:', formData.actualDate.format('YYYY-MM-DD'));
    
    // Set the selected result and form data
    setSelectedResult(record);
    setUpdateForm(formData);
    setSubmitStatus(null);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setOpenDetail(false);
    setSelectedResult(null);
    setUpdateForm({});
    setSubmitStatus(null);
  };

  // Cập nhật kết quả
  const handleUpdateSubmit = async (values) => {
    setLoadingSubmit(true);
    setSubmitStatus(null);
    try {
      // Use the actual vaccination date from form input
      const actualDate = values.actualDate || dayjs();
      const dateArr = [actualDate.year(), actualDate.month() + 1, actualDate.date()];
      
      console.log('Setting actual vaccination date:', dateArr);
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
      parentConfirmation: key === 'confirmed' ? true : false,
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
      render: (studentId, record) => record.className || getStudentClass(studentId)
    },
    {
      title: 'Chiến dịch',
      dataIndex: 'campaignId',
      key: 'campaignId',
      render: (campaignId) => getCampaignInfo(campaignId).campaignName || campaignId
    },
    {
      title: 'Ngày dự kiến',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      render: (scheduledDate, record) => {
        // Get scheduled date from record or campaign info
        let displayDate = scheduledDate;
        if (!displayDate) {
          const campaignInfo = getCampaignInfo(record.campaignId);
          displayDate = campaignInfo.scheduledDate;
        }
        
        if (displayDate) {
          // Handle different date formats
          if (Array.isArray(displayDate)) {
            return displayDate.join('-');
          }
          return displayDate;
        }
        return '-';
      }
    },
    {
      title: 'Ngày thực hiện tiêm',
      dataIndex: 'date',
      key: 'date',
      render: (date, record) => {
        // Only show actual vaccination date (when result was entered)
        // Don't fallback to scheduled date as this is for actual execution date
        if (date) {
          // Handle different date formats
          if (Array.isArray(date)) {
            return date.join('-');
          }
          return date;
        }
        // If no actual date, show empty or pending status
        return <Text type="secondary">Chưa thực hiện</Text>;
      }
    },
    // {
    //   title: 'Kết quả',
    //   dataIndex: 'result',
    //   key: 'result',
    //   render: (result) => getResultTag(result)
    // },
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
      render: (_, record) => {
        const isConfirmed = record.result === 'SUCCESS';
        return record.parentConfirmation ? (
            <Button
                type={isConfirmed ? "default" : "primary"}
                size="small"
                icon={isConfirmed ? <EyeOutlined /> : <EditOutlined />}
                onClick={() => handleOpenDetail(record)}
                disabled={isConfirmed}
            >
              {isConfirmed ? 'Đã xác nhận' : 'Xem chi tiết'}
            </Button>
        ) : null;
      }
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
          <Form layout="vertical">
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
                      onChange={(value) => handleSelectChange('campaignName', value)}
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
            <Row justify="end">
              <Col>
                <Button
                    icon={<ClearOutlined />}
                    onClick={handleClearFilters}
                    style={{ borderRadius: 8 }}
                >
                  Xóa bộ lọc
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
              <Form 
                layout="vertical" 
                onFinish={handleUpdateSubmit} 
                initialValues={updateForm}
                key={selectedResult.vaccinationId || `${selectedResult.studentId}-${selectedResult.campaignId}`}
              >
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
                    <Form.Item label="Ngày tiêm dự kiến theo lịch" name="scheduledDate">
                      <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                          disabled
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Ngày thực hiện tiêm" name="actualDate" rules={[{ required: true, message: 'Vui lòng chọn ngày thực hiện tiêm' }]}>
                      <DatePicker
                          style={{ width: '100%' }}
                          format="YYYY-MM-DD"
                          placeholder="Chọn ngày thực hiện tiêm"
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
                  {/*<Col xs={24} sm={12}>*/}
                  {/*  <Form.Item label="Kết quả" name="result" rules={[{ required: true, message: 'Vui lòng chọn kết quả' }]}>*/}
                  {/*    <Select placeholder="Chọn kết quả">*/}
                  {/*      {resultOptions.map(opt => (*/}
                  {/*          <Option key={opt.value} value={opt.value}>{opt.label}</Option>*/}
                  {/*      ))}*/}
                  {/*    </Select>*/}
                  {/*  </Form.Item>*/}
                  {/*</Col>*/}
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