import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HealthCheckService from '../../../services/HealthCheckService';
import './HealthCheckList.css';
import { Table, Button, Modal, Tag, message, Space } from 'antd';

const HealthCheckList = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  const getUserNameById = (id) => {
    const user = users.find(u => String(u.id) === String(id));
    return user ? user.fullName : id;
  };

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await HealthCheckService.getAllHealthCheckCampaign({
          headers: { Authorization: `Bearer ${token}` }
        });
        setCampaigns(data);
        localStorage.setItem('healthCheckCampaigns', JSON.stringify(data));
        console.log('Campaigns loaded:', data);
      } catch (err) {
        setError('Không thể tải danh sách chiến dịch!');
      }
      setLoading(false);
    };
    if (
      user.userRole === 'ROLE_ADMIN' ||
      user.userRole === 'ROLE_NURSE' ||
      user.userRole === 'ROLE_PRICIPAL'
    ) {
      fetchCampaigns();
    }
  }, [token, user.userRole]);

  if (
    user.userRole !== 'ROLE_ADMIN' &&
    user.userRole !== 'ROLE_NURSE' &&
    user.userRole !== 'ROLE_PRICIPAL'
  ) {
    return <div>Bạn không có quyền truy cập trang này.</div>;
  }

  // Hàm lưu thông tin chiến dịch vào localStorage
  const handleUpdateClick = (campaign) => {
    localStorage.setItem('selectedCampaignId', campaign.campaignId);
    localStorage.setItem('selectedCampaign', JSON.stringify(campaign));
    navigate('/capnhatkiemtradinhky');
  };

  // Hàm approve chiến dịch
  const handleApprove = async (campaignId) => {
    setApprovingId(campaignId);
    try {
      await HealthCheckService.approveHealthCheckCampaign(campaignId, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Sau khi duyệt, reload lại danh sách
      const data = await HealthCheckService.getAllHealthCheckCampaign({
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(data);
      localStorage.setItem('healthCheckCampaigns', JSON.stringify(data));
    } catch (err) {
      alert('Duyệt chiến dịch thất bại!');
    }
    setApprovingId(null);
  };

  // Hàm reject chiến dịch
  const handleReject = async (campaignId) => {
    setRejectingId(campaignId);
    try {
      await HealthCheckService.rejectHealthCheckCampaign(campaignId, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Từ chối chiến dịch thành công!');
      // Reload lại danh sách
      const data = await HealthCheckService.getAllHealthCheckCampaign({
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(data);
      localStorage.setItem('healthCheckCampaigns', JSON.stringify(data));
    } catch (err) {
      message.error('Từ chối chiến dịch thất bại!');
    }
    setRejectingId(null);
  };

  // Hàm format ngày dự kiến
  const formatScheduledDate = (date) => {
    if (Array.isArray(date) && date.length === 3) {
      const [y, m, d] = date;
      return `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
    }
    if (typeof date === 'string') return date;
    return '';
  };

  const columns = [
    { title: 'STT', dataIndex: 'index', key: 'index', render: (_, __, idx) => idx + 1 },
    { title: 'Tên chiến dịch', dataIndex: 'campaignName', key: 'campaignName' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { title: 'Ngày dự kiến', dataIndex: 'scheduledDate', key: 'scheduledDate', render: formatScheduledDate },
    { title: 'Địa điểm', dataIndex: 'address', key: 'address' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status) => {
      let color = 'default';
      if (status === 'PENDING') color = 'orange';
      if (status === 'APPROVED') color = 'green';
      if (status === 'REJECTED') color = 'red';
      return <Tag color={color}>{status}</Tag>;
    } },
    { title: 'Người tạo', dataIndex: 'createdBy', key: 'createdBy', render: getUserNameById },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, c) => (
        <Space>
          <Button type="primary" onClick={() => { setSelectedCampaign(c); setDetailModalOpen(true); }}>Xem chi tiết</Button>
          <Button className="btn btn-warning btn-sm" onClick={() => handleUpdateClick(c)}>
            Cập nhật
          </Button>
          {(user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_PRICIPAL') && c.status === 'PENDING' && (
            <>
              <Button type="success" loading={approvingId === c.campaignId} onClick={() => handleApprove(c.campaignId)}>
                {approvingId === c.campaignId ? 'Đang duyệt...' : 'Chấp nhận'}
              </Button>
              <Button type="danger" loading={rejectingId === c.campaignId} onClick={() => handleReject(c.campaignId)}>
                {rejectingId === c.campaignId ? 'Đang từ chối...' : 'Từ chối'}
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="health-check-list-container">
      <h2>Danh sách chiến dịch kiểm tra sức khỏe</h2>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => navigate('/kiemtradinhky')}>
          Tạo chiến dịch kiểm tra sức khỏe
        </Button>
      </div>
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-danger">{error}</div>}
      {!loading && !error && (
        <Table
          className="health-check-table"
          columns={columns}
          dataSource={campaigns}
          rowKey={c => c.campaignId}
          pagination={{ pageSize: 10 }}
        />
      )}
      <Modal
        open={detailModalOpen}
        title={selectedCampaign ? `Chi tiết chiến dịch: ${selectedCampaign.campaignName}` : ''}
        onCancel={() => setDetailModalOpen(false)}
        width={700}
        footer={
          selectedCampaign && selectedCampaign.status === 'PENDING' && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_PRICIPAL') ? [
            <Button key="reject" danger loading={rejectingId === selectedCampaign.campaignId} onClick={() => handleReject(selectedCampaign.campaignId)}>
              {rejectingId === selectedCampaign.campaignId ? 'Đang từ chối...' : 'Từ chối'}
            </Button>,
            <Button key="approve" type="primary" loading={approvingId === selectedCampaign.campaignId} onClick={() => handleApprove(selectedCampaign.campaignId)}>
              {approvingId === selectedCampaign.campaignId ? 'Đang duyệt...' : 'Chấp nhận'}
            </Button>
          ] : null
        }
      >
        {selectedCampaign && (
          <div style={{ lineHeight: 2, fontSize: 16 }}>
            <div><b>Tên chiến dịch:</b> {selectedCampaign.campaignName}</div>
            <div><b>Mô tả:</b> {selectedCampaign.description}</div>
            <div><b>Ngày dự kiến:</b> {formatScheduledDate(selectedCampaign.scheduledDate)}</div>
            <div><b>Địa điểm:</b> {selectedCampaign.address}</div>
            <div><b>Đối tượng:</b> {selectedCampaign.targetGroup}</div>
            <div><b>Loại:</b> {selectedCampaign.type}</div>
            <div><b>Người thực hiện:</b> {selectedCampaign.organizer}</div>
            <div><b>Trạng thái:</b> <Tag color={selectedCampaign.status === 'PENDING' ? 'orange' : selectedCampaign.status === 'APPROVED' ? 'green' : 'red'}>{selectedCampaign.status}</Tag></div>
            <div><b>Người tạo:</b> {getUserNameById(selectedCampaign.createdBy)}</div>
            <div><b>Người duyệt:</b> {selectedCampaign.approvedBy ? getUserNameById(selectedCampaign.approvedBy) : <span style={{ color: '#bfbfbf' }}>Chưa duyệt</span>}</div>
            <div><b>Ngày tạo:</b> {selectedCampaign.createdAt}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HealthCheckList;