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

      // Gọi thử API xác nhận, nếu lỗi thì coi như chưa xác nhận/từ chối chiến dịch nào
      let confirmed = [];
      let rejected = [];
      let hasStatus = false;
      console.log('chien dich', allCampaigns);
      
      setCampaigns(Array.isArray(allCampaigns) ? allCampaigns : []);
      setConfirmedCampaigns(hasStatus ? confirmed : []);
      setRejectedCampaigns(hasStatus ? rejected : []);
    } catch (err) {
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
      message.success('Xác nhận tham gia thành công!');
      setModalVisible(false);
      fetchData();
    } catch (err) {
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
      message.success('Từ chối tham gia thành công!');
      setModalVisible(false);
      fetchData();
    } catch (err) {
      message.error('Từ chối thất bại!');
    }
    setConfirming(false);
  };

  // Phân loại các chiến dịch dựa trên parentConfirmStatus từ backend
  const handledList = campaigns.filter(c => c.parentConfirmStatus === true || c.parentConfirmStatus === false);
  const notHandledList = campaigns.filter(c => c.parentConfirmStatus === null || c.parentConfirmStatus === undefined);

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