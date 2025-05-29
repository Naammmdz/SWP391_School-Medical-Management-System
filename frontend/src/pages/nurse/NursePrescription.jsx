import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message, DatePicker, TimePicker } from 'antd';
import { SearchOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './NursePrescription.css';
import PrescriptionService from '../../services/PrescriptionService';
import moment from 'moment';

const { TextArea } = Input;

const NursePrescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const data = await PrescriptionService.getPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      message.error('Không thể tải danh sách đơn thuốc');
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Học sinh',
      dataIndex: 'studentName',
      key: 'studentName',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div className="student-info">Mã: {record.studentId} - Lớp: {record.className}</div>
        </div>
      ),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) => 
        record.studentName.toLowerCase().includes(value.toLowerCase()) ||
        record.studentId.toLowerCase().includes(value.toLowerCase()) ||
        record.className.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Phụ huynh',
      dataIndex: 'parentName',
      key: 'parentName',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div className="parent-info">SĐT: {record.parentPhone}</div>
        </div>
      ),
    },
    {
      title: 'Ngày kê đơn',
      dataIndex: 'prescriptionDate',
      key: 'prescriptionDate',
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-badge ${status}`}>
          {status === 'pending' ? 'Chờ xử lý' : 
           status === 'in_progress' ? 'Đang xử lý' : 
           status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={() => handleViewPrescription(record)}
          disabled={record.status === 'completed' || record.status === 'cancelled'}
        >
          {record.status === 'pending' ? 'Xử lý' : 'Cập nhật'}
        </Button>
      ),
    },
  ];

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    form.setFieldsValue({
      nurseNote: prescription.nurseNote || '',
      medicationDate: prescription.medicationDate ? moment(prescription.medicationDate) : null,
      medicationTime: prescription.medicationTime ? moment(prescription.medicationTime) : null,
    });
    setIsModalVisible(true);
  };

  const handleComplete = async (values) => {
    try {
      const updatedData = {
        status: 'completed',
        nurseNote: values.nurseNote,
        medicationDate: values.medicationDate.format('YYYY-MM-DD'),
        medicationTime: values.medicationTime.format('HH:mm:ss'),
      };

      await PrescriptionService.updatePrescriptionStatus(
        selectedPrescription.id,
        updatedData.status,
        updatedData.nurseNote
      );

      // Thêm bản ghi cho học sinh uống thuốc
      await PrescriptionService.addMedicationRecord(selectedPrescription.id, {
        date: updatedData.medicationDate,
        time: updatedData.medicationTime,
        note: values.nurseNote
      });

      message.success('Đã cập nhật trạng thái đơn thuốc');
      setIsModalVisible(false);
      fetchPrescriptions(); // Refresh danh sách
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật đơn thuốc');
      console.error('Error updating prescription:', error);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  return (
    <div className="nurse-prescription-container">
      <h1>Quản lý đơn thuốc</h1>
      <div className="search-box">
        <Input
          placeholder="Tìm kiếm theo tên học sinh, mã học sinh hoặc lớp..."
          prefix={<SearchOutlined />}
          onChange={(e) => handleSearch(e.target.value)}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={prescriptions}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Chi tiết đơn thuốc"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedPrescription && (
          <div className="prescription-detail">
            <div className="student-info">
              <h3>Thông tin học sinh</h3>
              <p>Họ tên: {selectedPrescription.studentName}</p>
              <p>Mã học sinh: {selectedPrescription.studentId}</p>
              <p>Lớp: {selectedPrescription.className}</p>
            </div>

            <div className="medicine-list">
              <h3>Thông tin đơn thuốc</h3>
              <div className="prescription-info">
                <p><strong>Tình trạng bệnh:</strong> {selectedPrescription.condition}</p>
                <p><strong>Hướng dẫn sử dụng:</strong> {selectedPrescription.instructions}</p>
                <p><strong>Thời gian:</strong> {moment(selectedPrescription.startDate).format('DD/MM/YYYY')} - {moment(selectedPrescription.endDate).format('DD/MM/YYYY')}</p>
                {selectedPrescription.additionalNotes && (
                  <p><strong>Ghi chú thêm:</strong> {selectedPrescription.additionalNotes}</p>
                )}
              </div>
              {selectedPrescription.prescriptionImg && (
                <div className="prescription-image">
                  <h4>Hình ảnh đơn thuốc</h4>
                  <img src={selectedPrescription.prescriptionImg} alt="Đơn thuốc" />
                </div>
              )}
            </div>

            <Form
              form={form}
              onFinish={handleComplete}
              layout="vertical"
            >
              <Form.Item
                name="medicationDate"
                label="Ngày cho uống thuốc"
                rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item
                name="medicationTime"
                label="Thời gian cho uống thuốc"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
              >
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>

              <Form.Item
                name="nurseNote"
                label="Ghi chú của y tá"
                rules={[{ required: true, message: 'Vui lòng nhập ghi chú' }]}
              >
                <TextArea rows={4} placeholder="Nhập ghi chú về việc cho học sinh uống thuốc..." />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<CheckCircleOutlined />}>
                  Xác nhận đã cho uống thuốc
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NursePrescription;