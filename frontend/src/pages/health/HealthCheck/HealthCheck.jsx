import React, { useEffect, useState } from 'react';
import HealthCheckService from '../../../services/HealthCheckService';
import { Card, Spin, Alert, Typography, Button, Modal, Space, Tag, message, Divider, Tabs } from 'antd';
import { CalendarOutlined, UserOutlined, EnvironmentOutlined, TeamOutlined, FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './HealthCheck.css';

const { Title } = Typography;

const HealthCheck = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [confirmedCampaigns, setConfirmedCampaigns] = useState([]); // Đã xác nhận
  const [rejectedCampaigns, setRejectedCampaigns] = useState([]);   // Đã từ chối
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [activeTab, setActiveTab] = useState('notHandled'); // 'notHandled' | 'handled'

  const studentId = localStorage.getItem('selectedStudentId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(usersData);
  }, []);

  const getUserNameById = (id) => {
    const user = users.find(u => String(u.id) === String(id));
    return user ? user.fullName : id || '';
  };

  // Lấy danh sách chiến dịch đã duyệt, đã xác nhận và đã từ chối
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const allCampaigns = await HealthCheckService.getHealthCheckApproved(config);

      // Kiểm tra trạng thái xác nhận/từ chối cho từng chiến dịch
      let confirmed = [];
      let rejected = [];
      let hasStatus = false;

      if (studentId && Array.isArray(allCampaigns)) {
        try {
          // Lấy danh sách chiến dịch đã xác nhận
          const confirmedData = await HealthCheckService.parentGetStautusCampaigns(studentId, true, config);
          confirmed = Array.isArray(confirmedData) ? confirmedData : [];

          // Lấy danh sách chiến dịch đã từ chối
          const rejectedData = await HealthCheckService.parentGetStautusCampaigns(studentId, false, config);
          rejected = Array.isArray(rejectedData) ? rejectedData : [];

          hasStatus = true;
          console.log('Confirmed campaigns:', confirmed);
          console.log('Rejected campaigns:', rejected);
        } catch (statusErr) {
          console.log('Error fetching status, treating as no status available:', statusErr);
          hasStatus = false;
        }

        // Cập nhật trạng thái cho từng chiến dịch
        const updatedCampaigns = allCampaigns.map(campaign => {
          const isConfirmed = confirmed.some(c => c.campaignId === campaign.campaignId);
          const isRejected = rejected.some(c => c.campaignId === campaign.campaignId);

          return {
            ...campaign,
            parentConfirmStatus: isConfirmed ? true : (isRejected ? false : null)
          };
        });

        setCampaigns(updatedCampaigns);
      } else {
        setCampaigns(Array.isArray(allCampaigns) ? allCampaigns : []);
      }

      console.log('All campaigns with status:', allCampaigns);
      setConfirmedCampaigns(hasStatus ? confirmed : []);
      setRejectedCampaigns(hasStatus ? rejected : []);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Không thể tải danh sách chiến dịch!');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [token, studentId]);

  // Xử lý xác nhận/tham gia
  const handleConfirm = async (campaignId) => {
    setConfirming(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await HealthCheckService.parentConfirmHealthCheck(campaignId, studentId, config);

      // Cập nhật trạng thái ngay lập tức trong state
      setCampaigns(prev => prev.map(c =>
          c.campaignId === campaignId
              ? { ...c, parentConfirmStatus: true }
              : c
      ));

      message.success('Xác nhận tham gia thành công!');
      setModalVisible(false);
      // Fetch lại dữ liệu để đảm bảo đồng bộ
      fetchData();
    } catch (err) {
      console.error('Error confirming campaign:', err);
      message.error('Xác nhận thất bại!');
    }
    setConfirming(false);
  };

  // Xử lý từ chối
  const handleReject = async (campaignId) => {
    setConfirming(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await HealthCheckService.parentRejectHealthCheck(campaignId, studentId, config);

      // Cập nhật trạng thái ngay lập tức trong state
      setCampaigns(prev => prev.map(c =>
          c.campaignId === campaignId
              ? { ...c, parentConfirmStatus: false }
              : c
      ));

      message.success('Từ chối tham gia thành công!');
      setModalVisible(false);
      // Fetch lại dữ liệu để đảm bảo đồng bộ
      fetchData();
    } catch (err) {
      console.error('Error rejecting campaign:', err);
      message.error('Từ chối thất bại!');
    }
    setConfirming(false);
  };

  // Phân loại các chiến dịch dựa trên parentConfirmStatus từ backend
  // Lọc chiến dịch phù hợp với lớp học sinh
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const selectedStudent = students.find(s => String(s.studentId) === String(studentId));
  const studentClass = selectedStudent?.className || "";

  function removeVietnameseTones(str) {
    return str ? str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D') : '';
  }

  const filteredCampaigns = campaigns.filter(item => {
    if (!studentClass || !item.targetGroup) {
      return false;
    }
    const target = item.targetGroup.toLowerCase().trim();
    const studentClassLower = studentClass.toLowerCase().trim();
    const targetNoSign = removeVietnameseTones(target).replace(/\s/g, '');
    const studentClassNoSign = removeVietnameseTones(studentClassLower).replace(/\s/g, '');

    // Toàn trường - matches all students
    if (targetNoSign === 'toantruong') {
      return true;
    }

    // Exact class match (e.g., "1a" matches "1A")
    if (targetNoSign === studentClassNoSign) {
      return true;
    }

    // Extract grade number from student class (e.g., "3A" -> "3", "1B" -> "1")
    const studentGradeMatch = studentClassNoSign.match(/^(\d+)/);
    const studentGrade = studentGradeMatch ? studentGradeMatch[1] : null;

    // Handle "khối X" format in target (e.g., "khối 4", "khoi 4")
    const khoiMatch = targetNoSign.match(/khoi(\d+)/);
    if (khoiMatch && studentGrade === khoiMatch[1]) {
      return true;
    }

    // Handle simple grade numbers (e.g., "1", "2", "3")
    if (targetNoSign.match(/^\d+$/) && studentGrade === targetNoSign) {
      return true;
    }

    // Handle comma-separated targets (e.g., "1,2,3", "khối 1,2", "1a,1b")
    if (targetNoSign.includes(',')) {
      const targetParts = targetNoSign.split(',').map(part => part.trim());
      for (const part of targetParts) {
        // Check exact class match
        if (part === studentClassNoSign) {
          return true;
        }
        // Check simple grade number
        if (part.match(/^\d+$/) && studentGrade === part) {
          return true;
        }
        // Check "khoi X" format
        const partKhoiMatch = part.match(/khoi(\d+)/);
        if (partKhoiMatch && studentGrade === partKhoiMatch[1]) {
          return true;
        }
      }
    }

    // Partial matching - target contains class or vice versa
    if (targetNoSign.includes(studentClassNoSign) || studentClassNoSign.includes(targetNoSign)) {
      return true;
    }
    return false;
  });

  const handledList = filteredCampaigns.filter(c => c.parentConfirmStatus === true || c.parentConfirmStatus === false);
  const notHandledList = filteredCampaigns.filter(c => c.parentConfirmStatus === null || c.parentConfirmStatus === undefined);

  // Lấy trạng thái xác nhận/từ chối cho từng campaign
  const getStatus = (campaign) => {
    if (campaign.parentConfirmStatus === true) return 'CONFIRMED';
    if (campaign.parentConfirmStatus === false) return 'REJECTED';
    return null;
  };

  // Card hiển thị thông tin cơ bản
  const renderCampaignCard = (c, status = null) => (
      <Card
          key={c.campaignId}
          style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px #e6f7ff' }}
          title={<span><Tag color="blue">{c.campaignId}</Tag> <b>{c.campaignName}</b></span>}
          extra={
            <Button type="primary" icon={<InfoCircleOutlined />} onClick={() => { setSelectedCampaign(c); setModalVisible(true); }}>
              Xem chi tiết
            </Button>
          }
      >
        <Space direction="vertical" size={8}>
          <span><TeamOutlined /> <b>Đối tượng:</b> {c.targetGroup}</span>
          <span><CalendarOutlined /> <b>Ngày khám:</b> {c.scheduledDate}</span>
          <span>
          <Tag color={c.status === 'APPROVED' ? 'green' : 'default'}>
            {c.status === 'APPROVED' ? 'Đã duyệt' : c.status}
          </Tag>
            {status === 'CONFIRMED' && <Tag color="blue">Đã xác nhận</Tag>}
            {status === 'REJECTED' && <Tag color="red">Đã từ chối</Tag>}
        </span>
        </Space>
      </Card>
  );

  // Modal hiển thị chi tiết chiến dịch và 2 nút xác nhận/từ chối
  const renderDetailModal = () => {
    if (!selectedCampaign) return null;
    const status = getStatus(selectedCampaign);
    return (
        <Modal
            open={modalVisible}
            title={`Chi tiết chiến dịch: ${selectedCampaign.campaignName}`}
            onCancel={() => setModalVisible(false)}
            footer={
              status
                  ? null
                  : [
                    <Button key="reject" danger onClick={() => handleReject(selectedCampaign.campaignId)} loading={confirming}>
                      Từ chối
                    </Button>,
                    <Button key="confirm" type="primary" onClick={() => handleConfirm(selectedCampaign.campaignId)} loading={confirming}>
                      Xác nhận
                    </Button>,
                  ]
            }
        >
          <Space direction="vertical" size={10} style={{ width: '100%' }}>
            <div><b>Mã chiến dịch:</b> <Tag color="blue">{selectedCampaign.campaignId}</Tag></div>
            <div><b>Tên chiến dịch:</b> {selectedCampaign.campaignName}</div>
            <div><b>Đối tượng:</b> {selectedCampaign.targetGroup}</div>
            <div><b>Loại:</b> {selectedCampaign.type}</div>
            <div><b>Địa điểm:</b> {selectedCampaign.address}</div>
            <div><b>Người thực hiện:</b> {selectedCampaign.organizer}</div>
            <div><b>Mô tả:</b> {selectedCampaign.description}</div>
            <div><b>Ngày khám:</b> {selectedCampaign.scheduledDate}</div>
            <div><b>Người duyệt:</b> {getUserNameById(selectedCampaign.approvedBy) || <span style={{ color: '#bfbfbf' }}>Chưa duyệt</span>}</div>
            <div><b>Trạng thái:</b> <Tag color={selectedCampaign.status === 'APPROVED' ? 'green' : 'default'}>
              {selectedCampaign.status === 'APPROVED' ? 'Đã duyệt' : selectedCampaign.status}
            </Tag></div>
            <div><b>Ngày tạo:</b> {selectedCampaign.createdAt ? new Date(selectedCampaign.createdAt).toLocaleString('vi-VN') : ''}</div>
            {status === 'CONFIRMED' && <Tag color="blue">Đã xác nhận</Tag>}
            {status === 'REJECTED' && <Tag color="red">Đã từ chối</Tag>}
          </Space>
        </Modal>
    );
  };

  return (
      <div className="approved-health-check-campaigns" style={{ maxWidth: 900, margin: '32px auto' }}>
        <Card
            bordered={false}
            style={{
              borderRadius: 16,
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              padding: 24,
              background: '#f9fafb'
            }}
        >
          <Title level={2} style={{ textAlign: 'center', marginBottom: 32, color: '#2563eb' }}>
            Danh sách chiến dịch kiểm tra sức khỏe
          </Title>
          <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={[
                {
                  key: 'notHandled',
                  label: <b>Chưa phản hồi</b>,
                  children: (
                      loading ? (
                          <div style={{ textAlign: 'center', margin: '40px 0' }}>
                            <Spin size="large" />
                          </div>
                      ) : error ? (
                          <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />
                      ) : notHandledList.length === 0 ? (
                          <div style={{ color: '#bfbfbf', padding: '16px 0' }}>Không còn chiến dịch nào cần xác nhận.</div>
                      ) : (
                          notHandledList.map(c => renderCampaignCard(c, getStatus(c)))
                      )
                  )
                },
                {
                  key: 'handled',
                  label: <b>Đã phản hồi</b>,
                  children: (
                      loading ? (
                          <div style={{ textAlign: 'center', margin: '40px 0' }}>
                            <Spin size="large" />
                          </div>
                      ) : error ? (
                          <Alert message={error} type="error" showIcon style={{ marginBottom: 24 }} />
                      ) : handledList.length === 0 ? (
                          <div style={{ color: '#bfbfbf', padding: '16px 0' }}>Chưa xác nhận hoặc từ chối chiến dịch nào.</div>
                      ) : (
                          handledList.map(c => renderCampaignCard(c, getStatus(c)))
                      )
                  )
                }
              ]}
          />
          {renderDetailModal()}
        </Card>
      </div>
  );
};

export default HealthCheck;