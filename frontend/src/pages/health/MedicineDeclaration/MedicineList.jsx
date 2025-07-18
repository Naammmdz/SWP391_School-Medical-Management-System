import React, { useEffect, useState } from "react";
import MedicineDeclarationService from "../../../services/MedicineDeclarationService";
import StudentService from "../../../services/StudentService";
import { Card, Modal, Image, Typography, Spin, Alert, Empty, Button, Popconfirm, message, Row, Col, Badge, Divider, Space, Tag } from "antd";
import { UserOutlined, FileTextOutlined, DeleteOutlined, PlusOutlined, CalendarOutlined, ClockCircleOutlined, MedicineBoxOutlined, CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";
import { Descriptions } from "antd";

const { Title, Text, Paragraph } = Typography;

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

const statusIcons = {
  APPROVED: <CheckCircleOutlined />,
  PENDING: <ExclamationCircleOutlined />,
  REJECTED: <CloseCircleOutlined />,
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
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);

  const navigate = useNavigate();

  // Lấy studentId từ URL params hoặc localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('studentId') || localStorage.getItem("selectedStudentId");

  // Fetch thông tin học sinh từ API
  const fetchStudentInfo = async () => {
    if (!studentId) return;
    
    setStudentLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // Fetch tất cả học sinh và tìm học sinh theo ID
      const response = await StudentService.getAllStudents(config);
      const students = Array.isArray(response.data) ? response.data : [];
      const student = students.find(s => String(s.studentId) === String(studentId));
      
      setStudentInfo(student || null);
      console.log("Found student info:", student);
    } catch (error) {
      console.error("Error fetching student info:", error);
      setStudentInfo(null);
    }
    setStudentLoading(false);
  };

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
      fetchStudentInfo();
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

  const renderMedicineCard = (medicine) => (
    <Col xs={24} sm={24} md={12} lg={8} xl={8} key={medicine.id}>
      <Card
        hoverable
        style={{
          marginBottom: 16,
          borderRadius: 16,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          border: "1px solid #f0f0f0",
          overflow: "hidden"
        }}
        bodyStyle={{ padding: 20 }}
        cover={
          medicine.imageData ? (
            <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
              <Image
                src={medicine.imageData}
                alt="Đơn thuốc"
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover",
                  cursor: "pointer"
                }}
                preview={{ visible: false }}
                onClick={() => setPreviewImage(medicine.imageData)}
              />
              <div style={{
                position: "absolute",
                top: 8,
                right: 8,
                background: "rgba(0,0,0,0.6)",
                borderRadius: 12,
                padding: "4px 8px"
              }}>
                <Text style={{ color: "white", fontSize: 12 }}>Đơn thuốc</Text>
              </div>
            </div>
          ) : (
            <div style={{
              height: 200,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column"
            }}>
              <MedicineBoxOutlined style={{ fontSize: 48, color: "white", marginBottom: 8 }} />
              <Text style={{ color: "white", fontSize: 16 }}>Không có ảnh đơn thuốc</Text>
            </div>
          )
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Space style={{ marginBottom: 8 }}>
            <Badge
              status={statusColors[medicine.submissionStatus]}
              text={
                <Tag
                  color={statusColors[medicine.submissionStatus]}
                  icon={statusIcons[medicine.submissionStatus]}
                  style={{ fontWeight: 600, fontSize: 12 }}
                >
                  {statusLabels[medicine.submissionStatus]}
                </Tag>
              }
            />
          </Space>
        </div>

        <div style={{ marginBottom: 16 }}>
          <Title level={5} style={{ marginBottom: 8, color: "#15803d" }}>
            <FileTextOutlined style={{ marginRight: 8 }} />
            Hướng dẫn sử dụng
          </Title>
          <Paragraph style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
            {medicine.instruction}
          </Paragraph>
        </div>

        <Divider style={{ margin: "12px 0" }} />

        <Row gutter={[16, 8]} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
              <ClockCircleOutlined style={{ color: "#52c41a", marginRight: 6 }} />
              <Text strong style={{ fontSize: 12 }}>Thời gian:</Text>
            </div>
            <Text style={{ fontSize: 13 }}>{medicine.duration} ngày</Text>
          </Col>
          <Col span={12}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
              <CalendarOutlined style={{ color: "#1890ff", marginRight: 6 }} />
              <Text strong style={{ fontSize: 12 }}>Bắt đầu:</Text>
            </div>
            <Text style={{ fontSize: 13 }}>{formatDate(medicine.startDate)}</Text>
          </Col>
        </Row>

        <Row gutter={[16, 8]} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
              <CalendarOutlined style={{ color: "#fa8c16", marginRight: 6 }} />
              <Text strong style={{ fontSize: 12 }}>Kết thúc:</Text>
            </div>
            <Text style={{ fontSize: 13 }}>{formatDate(medicine.endDate)}</Text>
          </Col>
          <Col span={12}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
              <UserOutlined style={{ color: "#722ed1", marginRight: 6 }} />
              <Text strong style={{ fontSize: 12 }}>Người duyệt:</Text>
            </div>
            <Text style={{ fontSize: 13 }}>{medicine.approvedByName || "Chưa duyệt"}</Text>
          </Col>
        </Row>

        {medicine.notes && (
          <>
            <Divider style={{ margin: "12px 0" }} />
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 12, color: "#666" }}>Ghi chú:</Text>
              <Paragraph style={{ margin: "4px 0 0 0", fontSize: 13, color: "#666" }}>
                {medicine.notes}
              </Paragraph>
            </div>
          </>
        )}

        {medicine.approvedAt && (
          <div style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, color: "#666" }}>
              <CalendarOutlined style={{ marginRight: 4 }} />
              Duyệt lúc: {formatDate(medicine.approvedAt)}
            </Text>
          </div>
        )}

        <Divider style={{ margin: "12px 0" }} />

        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewLog(medicine.id)}
            style={{ flex: 1, marginRight: 8 }}
          >
            Xem thông tin uống thuốc
          </Button>
          
          {medicine.submissionStatus === "PENDING" && (
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa đơn thuốc này?"
              onConfirm={() => handleDelete(medicine.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true, loading: deletingId === medicine.id }}
            >
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                loading={deletingId === medicine.id}
                size="small"
              >
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      </Card>
    </Col>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Title level={2} style={{ textAlign: "center", marginBottom: 32, color: "#15803d", marginTop: 50 }}>
        <MedicineBoxOutlined style={{ marginRight: 12 }} />
        Đơn thuốc đã gửi
      </Title>
      
{/* Nút quay về */}
      <div style={{ textAlign: "left", marginBottom: 24 }}>
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          size="large"
          onClick={() => navigate("/parent")}
          style={{ borderRadius: 8, height: 40 }}
        >
          Quay về
        </Button>
      </div>

      {/* Nút gửi thuốc */}
      <div style={{ textAlign: "right", marginBottom: 24 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => navigate("/parent/khaibaothuoc")}
          style={{ borderRadius: 8, height: 40 }}
        >
          Gửi đơn thuốc mới
        </Button>
      </div>

      {/* Thông tin học sinh */}
      {studentInfo ? (
        <Card
          style={{ 
            marginBottom: 32, 
            borderRadius: 16, 
            boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
          background: "linear-gradient(135deg, #059669 0%, #065f46 100%)",
            color: "white"
          }}
          bordered={false}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <UserOutlined style={{ fontSize: 40, color: "white" }} />
            </div>
            <div>
              <Title level={3} style={{ margin: 0, color: "white" }}>{studentInfo.fullName}</Title>
              <Text style={{ color: "rgba(255,255,255,0.9)", fontSize: 16 }}>
                <strong>Lớp:</strong> {
                  studentInfo.className || 
                  studentInfo.class || 
                  studentInfo.classroom || 
                  studentInfo.grade || 
                  studentInfo.classroomName ||
                  studentInfo.academicYear ||
                  "Chưa cập nhật"
                } | 
                <strong> Ngày sinh:</strong> {formatDate(studentInfo.dob || studentInfo.yob)} | 
                <strong> Giới tính:</strong> {studentInfo.gender === "Male" ? "Nam" : "Nữ"}
              </Text>
            </div>
          </div>
        </Card>
      ) : studentLoading ? (
        <Card style={{ marginBottom: 32, textAlign: "center", padding: "20px" }}>
          <Spin /> <Text style={{ marginLeft: 8 }}>Đang tải thông tin học sinh...</Text>
        </Card>
      ) : null}

      {/* Danh sách đơn thuốc */}
      <Card
        title={
          <span style={{ fontSize: 18, fontWeight: 600 }}>
            <FileTextOutlined style={{ marginRight: 8, color: "#15803d" }} />
            Chi tiết đơn thuốc
          </span>
        }
        style={{ borderRadius: 16, boxShadow: "0 4px 16px rgba(0,0,0,0.07)" }}
        bodyStyle={{ padding: 24 }}
      >
        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 24 }} />}
        
        {loading ? (
          <div style={{ textAlign: "center", padding: 48 }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Đang tải danh sách đơn thuốc...</Text>
            </div>
          </div>
        ) : medicineList.length === 0 ? (
          <Empty 
            description="Không có đơn thuốc nào đã gửi." 
            style={{ padding: 48 }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Row gutter={[16, 16]}>
            {medicineList.map(renderMedicineCard)}
          </Row>
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
        width={600}
      >
        {logLoading ? (
          <div style={{ textAlign: "center", padding: 48 }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Đang tải thông tin uống thuốc...</Text>
            </div>
          </div>
        ) : medicineLog && Array.isArray(medicineLog.medicineLogs) && medicineLog.medicineLogs.length > 0 ? (
          <div>
            {medicineLog.medicineLogs.map((log, idx) => {
              // Handle new status logic: true = given, false = not given, null = default
              const isGiven = log.status === true;
              const isNotGiven = log.status === false;
              const isDefault = log.status === null || log.status === undefined;
              
              // Get status display info
              const getStatusInfo = () => {
                if (isGiven) {
                  return {
                    icon: <CheckCircleOutlined style={{ marginRight: 8 }} />,
                    text: "Đã uống thuốc",
                    color: "#52c41a",
                    bgColor: "#f6ffed",
                    borderColor: "#b7eb8f"
                  };
                } else if (isNotGiven) {
                  return {
                    icon: <CloseCircleOutlined style={{ marginRight: 8 }} />,
                    text: "Không uống thuốc",
                    color: "#ff4d4f",
                    bgColor: "#fff2f0",
                    borderColor: "#ffccc7"
                  };
                } else {
                  return {
                    icon: <ExclamationCircleOutlined style={{ marginRight: 8 }} />,
                    text: "Chưa ghi nhận",
                    color: "#faad14",
                    bgColor: "#fff7e6",
                    borderColor: "#ffd591"
                  };
                }
              };
              
              const statusInfo = getStatusInfo();
              
              return (
                <Card
                  key={log.id || idx}
                  style={{ 
                    marginBottom: 16, 
                    borderRadius: 12,
                    border: `1px solid ${statusInfo.borderColor}`,
                    backgroundColor: statusInfo.bgColor
                  }}
                  title={
                    <span style={{ color: statusInfo.color, fontWeight: 600 }}>
                      {statusInfo.icon}
                      {statusInfo.text} - Ngày {idx + 1}
                    </span>
                  }
                >
                  <Row gutter={[16, 12]}>
                    <Col span={12}>
                      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                        <UserOutlined style={{ color: statusInfo.color, marginRight: 8 }} />
                        <Text strong>Người ghi nhận:</Text>
                      </div>
                      <Text>{log.givenByName || <Text type="secondary">---</Text>}</Text>
                    </Col>
                    <Col span={12}>
                      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                        <CalendarOutlined style={{ color: statusInfo.color, marginRight: 8 }} />
                        <Text strong>Ngày ghi nhận:</Text>
                      </div>
                      <Text>
                        {log.givenAt
                          ? Array.isArray(log.givenAt)
                            ? new Date(log.givenAt[0], log.givenAt[1] - 1, log.givenAt[2]).toLocaleDateString("vi-VN")
                            : new Date(log.givenAt).toLocaleString("vi-VN")
                          : <Text type="secondary">---</Text>}
                      </Text>
                    </Col>
                  </Row>
                  
                  {/* Status badge */}
                  <div style={{ marginTop: 12, marginBottom: 8 }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      backgroundColor: statusInfo.color,
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      {statusInfo.text}
                    </span>
                  </div>
                
                {log.notes && (
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                      <FileTextOutlined style={{ color: "#fa8c16", marginRight: 8 }} />
                      <Text strong>Ghi chú:</Text>
                    </div>
                    <Text>{log.notes}</Text>
                  </div>
                )}
                
                {log.imageData && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                      <Image style={{ color: "#722ed1", marginRight: 8 }} />
                      <Text strong>Ảnh xác nhận:</Text>
                    </div>
                    <Image
                      src={log.imageData}
                      alt="Ảnh xác nhận uống thuốc"
                      style={{ maxWidth: "100%", borderRadius: 8 }}
                    />
                  </div>
                )}
                </Card>
              );
            })}
          </div>
        ) : (
          <Alert 
            type="info" 
            message="Chưa có thông tin uống thuốc." 
            showIcon
            style={{ textAlign: "center" }}
          />
        )}
      </Modal>
    </div>
  );
}

export default MedicineList;