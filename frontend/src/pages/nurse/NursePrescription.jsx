import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { SearchOutlined, CheckCircleOutlined } from '@ant-design/icons';
import './NursePrescription.css';

const NursePrescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Mock data - sẽ thay thế bằng API call
  const mockPrescriptions = [
    {
      id: 1,
      studentName: 'Nguyễn Văn A',
      studentId: 'HS001',
      className: '10A1',
      parentName: 'Nguyễn Văn B',
      parentPhone: '0123456789',
      prescriptionDate: '2024-03-20',
      medicines: [
        { name: 'Paracetamol', dosage: '500mg', frequency: '3 lần/ngày', note: 'Sau khi ăn' },
        { name: 'Vitamin C', dosage: '100mg', frequency: '1 lần/ngày', note: 'Buổi sáng' }
      ],
      status: 'pending' // pending, completed
    },
    // Thêm dữ liệu mẫu khác...
  ];

  useEffect(() => {
    // TODO: Gọi API lấy danh sách đơn thuốc
    setPrescriptions(mockPrescriptions);
  }, []);

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
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span className={`status-badge ${status}`}>
          {status === 'pending' ? 'Chờ xử lý' : 'Đã xử lý'}
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
          disabled={record.status === 'completed'}
        >
          Xử lý
        </Button>
      ),
    },
  ];

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setIsModalVisible(true);
  };

  const handleComplete = async (values) => {
    try {
      // TODO: Gọi API cập nhật trạng thái đơn thuốc
      const updatedPrescriptions = prescriptions.map(p => 
        p.id === selectedPrescription.id 
          ? { ...p, status: 'completed', nurseNote: values.nurseNote }
          : p
      );
      setPrescriptions(updatedPrescriptions);
      message.success('Đã cập nhật trạng thái đơn thuốc');
      setIsModalVisible(false);
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật đơn thuốc');
    }
  };

  return (
    <div className="nurse-prescription-container">
      <div className="header">
        <h1>Quản lý đơn thuốc</h1>
        <div className="search-box">
          <Input
            placeholder="Tìm kiếm theo tên học sinh..."
            prefix={<SearchOutlined />}
            // TODO: Thêm logic tìm kiếm
          />
        </div>
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
              <h3>Danh sách thuốc</h3>
              <Table
                dataSource={selectedPrescription.medicines}
                columns={[
                  { title: 'Tên thuốc', dataIndex: 'name' },
                  { title: 'Liều lượng', dataIndex: 'dosage' },
                  { title: 'Tần suất', dataIndex: 'frequency' },
                  { title: 'Ghi chú', dataIndex: 'note' },
                ]}
                pagination={false}
              />
            </div>

            <Form
              form={form}
              onFinish={handleComplete}
              layout="vertical"
            >
              <Form.Item
                name="nurseNote"
                label="Ghi chú của y tá"
                rules={[{ required: true, message: 'Vui lòng nhập ghi chú' }]}
              >
                <Input.TextArea rows={4} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit">
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