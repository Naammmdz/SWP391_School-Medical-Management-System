import React, { useEffect, useState } from "react";
import MedicineDeclarationService from "../../../services/MedicineDeclarationService";
import { Card, Table, Tag, Modal, Image, Typography, Spin, Alert, Empty, Button, Popconfirm, message } from "antd";
import { UserOutlined, FileTextOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import { Descriptions } from "antd";


const { Title, Text } = Typography;

const statusColors = {
  APPROVED: "green",
  PENDING: "orange",
  REJECTED: "red",
};

const statusLabels = {
  APPROVED: "Đã duyệt",
  PENDING: "Chờ duyệt",
  REJECTED: "Từ chối",
};

const MedicineList = () => {
  const [medicineList, setMedicineList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
   const [logModalOpen, setLogModalOpen] = useState(false);
  const [medicineLog, setMedicineLog] = useState(null);
  const [logLoading, setLogLoading] = useState(false);

  const navigate = useNavigate();

  // Lấy studentId từ localStorage (phụ huynh đã chọn con ở ParentPages.jsx)
  const studentId = localStorage.getItem("selectedStudentId");
  const students = JSON.parse(localStorage.getItem("students") || "[]");
  const student = students.find(s => String(s.studentId) === String(studentId));

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const data = await MedicineDeclarationService.getMedicineSubmissionMyStudent(studentId, config);
      setMedicineList(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Không thể tải danh sách đơn thuốc.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (studentId) {
      fetchData();
    } else {
      setMedicineList([]);
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [studentId]);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  // Xử lý xóa đơn thuốc
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await MedicineDeclarationService.deleteMedicineSubmission(id, config);
      message.success("Xóa đơn thuốc thành công!");
      fetchData();
    } catch (err) {
      message.error("Xóa đơn thuốc thất bại!");
    }
    setDeletingId(null);
  };
 const handleViewLog = async (medicineId) => {
    setLogLoading(true);
    setLogModalOpen(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const log = await MedicineDeclarationService.getMedicineLog(config, medicineId);
      setMedicineLog(log);
      console.log("Medicine Log:", log);
    } catch (err) {
      setMedicineLog(null);
      message.error("Không thể tải thông tin uống thuốc!");
    }
    setLogLoading(false);
  };
  // Cột cho bảng antd
  const columns = [
    {
      title: "Hướng dẫn sử dụng",
      dataIndex: "instruction",
      key: "instruction",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Thời gian (ngày)",
      dataIndex: "duration",
      key: "duration",
      align: "center",
    },
    {
      title: "Bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => <Text>{formatDate(date)}</Text>,
      align: "center",
    },
    {
      title: "Kết thúc",
      dataIndex: "endDate",
      key: "endDate",
      render: (date) => <Text>{formatDate(date)}</Text>,
      align: "center",
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
      key: "notes",
      render: (text) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "submissionStatus",
      key: "submissionStatus",
      align: "center",
      render: (status) => (
        <Tag color={statusColors[status] || "default"} style={{ fontWeight: 600, fontSize: 14 }}>
          {statusLabels[status] || status}
        </Tag>
      ),
    },
    {
      title: "Người duyệt",
      dataIndex: "approvedByName",
      key: "approvedByName",
      align: "center",
      render: (name) => name || <Text type="secondary">-</Text>,
    },
    {
      title: "Ngày duyệt",
      dataIndex: "approvedAt",
      key: "approvedAt",
      align: "center",
      render: (date) => date ? formatDate(date) : <Text type="secondary">-</Text>,
    },
    {
      title: "Ảnh đơn thuốc",
      dataIndex: "imageData",
      key: "imageData",
      align: "center",
      render: (img) =>
        img ? (
          <Image
            src={img}
            alt="Đơn thuốc"
            width={60}
            height={60}
            style={{ borderRadius: 6, objectFit: "cover", cursor: "pointer" }}
            preview={{ visible: false }}
            onClick={() => setPreviewImage(img)}
          />
        ) : (
          <Text type="secondary">Không có</Text>
        ),
    },
    {
      title: "Chi tiết",
      key: "log",
      align: "center",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewLog(record.id)}
        >
          Xem thông tin uống thuốc
        </Button>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center",
      render: (_, record) =>
        record.submissionStatus === "PENDING" ? (
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đơn thuốc này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: deletingId === record.id }}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              loading={deletingId === record.id}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32, color: "#3b5998", marginTop: 50 }}>
        Đơn thuốc đã gửi
      </Title>
      {/* Nút gửi thuốc */}
      <div style={{ textAlign: "right", marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate("/khaibaothuoc")}
        >
          Gửi đơn thuốc mới
        </Button>
      </div>
      {/* Thông tin học sinh */}
      {student ? (
        <Card
          style={{ marginBottom: 32, borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}
          bordered={false}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <UserOutlined style={{ fontSize: 48, color: "#1890ff" }} />
            <div>
              <Title level={4} style={{ margin: 0 }}>{student.fullName}</Title>
              <Text strong>Lớp: </Text><Text>{student.className}</Text><br />
              <Text strong>Ngày sinh: </Text><Text>{formatDate(student.dob || student.yob)}</Text><br />
              <Text strong>Giới tính: </Text><Text>{student.gender === "Male" ? "Nam" : "Nữ"}</Text>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Danh sách đơn thuốc */}
      <Card
        title={<span><FileTextOutlined /> <span style={{ marginLeft: 8 }}>Chi tiết đơn thuốc</span></span>}
        style={{ borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}
        bodyStyle={{ padding: 0 }}
      >
        {error && <Alert type="error" message={error} showIcon style={{ margin: 24 }} />}
        {loading ? (
          <div style={{ textAlign: "center", padding: 48 }}><Spin size="large" /></div>
        ) : medicineList.length === 0 ? (
          <Empty description="Không có đơn thuốc nào đã gửi." style={{ padding: 48 }} />
        ) : (
          <Table
            columns={columns}
            dataSource={medicineList.map((item, idx) => ({ ...item, key: item.id || idx }))}
            pagination={{ pageSize: 6 }}
            style={{ borderRadius: 16 }}
            scroll={{ x: true }}
          />
        )}
      </Card>

      {/* Modal xem ảnh lớn */}
      <Modal
        open={!!previewImage}
        footer={null}
        onCancel={() => setPreviewImage(null)}
        centered
        bodyStyle={{ textAlign: "center" }}
      >
        <Image src={previewImage} alt="Đơn thuốc" style={{ maxHeight: 400, borderRadius: 8 }} />
      </Modal>

      {/* Modal xem log uống thuốc */}
      <Modal
  open={logModalOpen}
  title="Thông tin y tá cho uống thuốc"
  onCancel={() => {
    setLogModalOpen(false);
    setMedicineLog(null);
  }}
  footer={null}
  centered
>
  {logLoading ? (
    <Spin />
  ) : medicineLog && Array.isArray(medicineLog.medicineLogs) && medicineLog.medicineLogs.length > 0 ? (
    <div>
      {medicineLog.medicineLogs.map((log, idx) => (
        <Descriptions
          key={log.id || idx}
          column={1}
          bordered
          size="small"
          style={{ marginBottom: 16 }}
          title={`Lần uống thuốc ${idx + 1}`}
        >
          <Descriptions.Item label="Người cho uống">
            {log.givenByName || <Text type="secondary">---</Text>}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày giờ uống">
            {log.givenAt
              ? Array.isArray(log.givenAt)
                ? new Date(log.givenAt[0], log.givenAt[1] - 1, log.givenAt[2]).toLocaleDateString("vi-VN")
                : new Date(log.givenAt).toLocaleString("vi-VN")
              : <Text type="secondary">---</Text>}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú">
            {log.notes || <Text type="secondary">---</Text>}
          </Descriptions.Item>
          <Descriptions.Item label="Ảnh xác nhận">
            {log.imageData ? (
              <Image
                src={log.imageData}
                alt="Ảnh xác nhận uống thuốc"
                style={{ maxWidth: 300, borderRadius: 8 }}
              />
            ) : (
              <Text type="secondary">Không có ảnh</Text>
            )}
          </Descriptions.Item>
        </Descriptions>
      ))}
    </div>
  ) : (
    <Alert type="info" message="Chưa có thông tin uống thuốc." />
  )}
</Modal>
    </div>
  );
}
export default MedicineList;