import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HealthCheckService from '../../../services/HealthCheckService';
import './HealthCheckList.css';
import { Table, Button, Modal, Tag, message, Space, Tabs } from 'antd';
import AllStudentsInHealthCheckCampaign from '../../../components/healthcheck/AllStudentsInHealthCheckCampaign';
import StudentsWithHealthStatus from '../../../components/healthcheck/StudentsWithHealthStatus';

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
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingCampaignId, setRejectingCampaignId] = useState(null);
  const [approveSuccess, setApproveSuccess] = useState(false);
  const [rejectSuccess, setRejectSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [detailActiveTab, setDetailActiveTab] = useState('info');

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
      user.userRole === 'ROLE_PRINCIPAL'
    ) {
      fetchCampaigns();
    }
  }, [token, user.userRole]);

  if (
    user.userRole !== 'ROLE_ADMIN' &&
    user.userRole !== 'ROLE_NURSE' &&
    user.userRole !== 'ROLE_PRINCIPAL'
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
      setApproveSuccess(true);
      setTimeout(() => {
        setApproveSuccess(false);
        setDetailModalOpen(false);
      }, 2000);
    } catch (err) {
      alert('Duyệt chiến dịch thất bại!');
    }
    setApprovingId(null);
  };

  // Hàm reject chiến dịch
  const handleReject = async (campaignId) => {
    setRejectingCampaignId(campaignId);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!rejectReason.trim()) {
      message.warning('Vui lòng nhập lý do từ chối!');
      return;
    }
    try {
      await HealthCheckService.rejectHealthCheckCampaign(rejectingCampaignId, {
        params: { rejectionReason: rejectReason },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRejectSuccess(true);
      // Reload lại danh sách
      const data = await HealthCheckService.getAllHealthCheckCampaign({
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampaigns(data);
      localStorage.setItem('healthCheckCampaigns', JSON.stringify(data));
      setTimeout(() => {
        setRejectSuccess(false);
        setRejectModalOpen(false);
      }, 2000);
    } catch (err) {
      message.error('Từ chối chiến dịch thất bại!');
    }
    setRejectingCampaignId(null);
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

  // Helper to render campaign status in Vietnamese
  const renderStatusVN = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ duyệt';
      case 'APPROVED':
        return 'Đã duyệt';
      case 'CANCELLED':
        return 'Đã từ chối';
      default:
        return status;
    }
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
      if (status === 'CANCELLED') color = 'red';
      return <Tag color={color}>{renderStatusVN(status)}</Tag>;
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
          {(user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_PRINCIPAL') && c.status === 'PENDING' && (
            <>
              <Button 
                type="primary" 
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                loading={approvingId === c.campaignId} 
                onClick={() => handleApprove(c.campaignId)}
              >
                {approvingId === c.campaignId ? 'Đang duyệt...' : 'Chấp nhận'}
              </Button>
              <Button 
                danger 
                loading={rejectingId === c.campaignId} 
                onClick={() => handleReject(c.campaignId)}
              >
                {rejectingId === c.campaignId ? 'Đang từ chối...' : 'Từ chối'}
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  const campaignsByStatus = {
    PENDING: campaigns.filter(c => c.status === 'PENDING'),
    APPROVED: campaigns.filter(c => c.status === 'APPROVED'),
    CANCELLED: campaigns.filter(c => c.status === 'CANCELLED'),
  };

  const tabItems = [
    {
      key: 'PENDING',
      label: 'Chờ duyệt',
      children: (
        <Table
          className="health-check-table"
          columns={columns}
          dataSource={campaignsByStatus.PENDING}
          rowKey={c => c.campaignId}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: 'APPROVED',
      label: 'Đã duyệt',
      children: (
        <Table
          className="health-check-table"
          columns={columns}
          dataSource={campaignsByStatus.APPROVED}
          rowKey={c => c.campaignId}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
    {
      key: 'CANCELLED',
      label: 'Đã từ chối',
      children: (
        <Table
          className="health-check-table"
          columns={columns}
          dataSource={campaignsByStatus.CANCELLED}
          rowKey={c => c.campaignId}
          pagination={{ pageSize: 10 }}
        />
      ),
    },
  ];

  return (
    <div className="health-check-list-container">
      <h2>Danh sách chiến dịch kiểm tra sức khỏe</h2>
      {(user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_NURSE') && (
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={() => navigate('/kiemtradinhky')}>
            Tạo chiến dịch kiểm tra sức khỏe
          </Button>
        </div>
      )}
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-danger">{error}</div>}
      {!loading && !error && (
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabBarGutter={32}
          type="card"
        />
      )}
      <Modal
        open={detailModalOpen}
        title={selectedCampaign ? `Chi tiết chiến dịch: ${selectedCampaign.campaignName}` : ''}
        onCancel={() => setDetailModalOpen(false)}
        width={900}
        footer={
          selectedCampaign && selectedCampaign.status === 'PENDING' && (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_PRINCIPAL') ? [
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
          <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', lineHeight: 1.8 }}>
              <div>
                <div><strong>Tên chiến dịch:</strong> {selectedCampaign.campaignName}</div>
                <div><strong>Mô tả:</strong> {selectedCampaign.description}</div>
                <div><strong>Ngày dự kiến:</strong> {formatScheduledDate(selectedCampaign.scheduledDate)}</div>
                <div><strong>Địa điểm:</strong> {selectedCampaign.address}</div>
              </div>
              <div>
                <div><strong>Đối tượng:</strong> {selectedCampaign.targetGroup}</div>
                <div><strong>Loại:</strong> {selectedCampaign.type}</div>
                <div><strong>Người thực hiện:</strong> {selectedCampaign.organizer}</div>
                <div><strong>Trạng thái:</strong> <Tag color={selectedCampaign.status === 'PENDING' ? 'orange' : selectedCampaign.status === 'APPROVED' ? 'green' : selectedCampaign.status === 'CANCELLED' ? 'red' : 'default'}>{renderStatusVN(selectedCampaign.status)}</Tag></div>
              </div>
            </div>
            <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div><strong>Người tạo:</strong> {getUserNameById(selectedCampaign.createdBy)}</div>
              <div><strong>Người duyệt:</strong> {selectedCampaign.approvedBy ? getUserNameById(selectedCampaign.approvedBy) : <span style={{ color: '#bfbfbf' }}>Chưa duyệt</span>}</div>
            </div>
            <div style={{ marginTop: '8px' }}>
              <div><strong>Ngày tạo:</strong> {selectedCampaign.createdAt}</div>
            </div>
          </div>
        )}
        
        <Tabs activeKey={detailActiveTab} onChange={setDetailActiveTab} type="card">
          <Tabs.TabPane tab="Học sinh đủ điều kiện" key="eligible">
            {selectedCampaign && <AllStudentsInHealthCheckCampaign campaignId={selectedCampaign.campaignId} />}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Trạng thái kiểm tra" key="status">
            {selectedCampaign && <StudentsWithHealthStatus campaignId={selectedCampaign.campaignId} />}
          </Tabs.TabPane>
        </Tabs>
      </Modal>
      {/* Modal xác nhận từ chối với lý do */}
      <Modal
        open={rejectModalOpen}
        title={<span>Từ chối chiến dịch</span>}
        onCancel={() => setRejectModalOpen(false)}
        onOk={handleConfirmReject}
        okText="Từ chối"
        okType="danger"
        cancelText="Hủy"
        confirmLoading={rejectingId === rejectingCampaignId}
      >
        {rejectSuccess && (
          <div style={{ background: '#f6ffed', color: '#389e0d', padding: 10, borderRadius: 6, marginBottom: 12, textAlign: 'center', fontWeight: 600 }}>
            Từ chối chiến dịch thành công!
          </div>
        )}
        <div style={{ marginBottom: 12 }}>
          Bạn có chắc muốn từ chối chiến dịch này? Hành động này không thể hoàn tác.<br/>
          <b>Vui lòng nhập lý do từ chối:</b>
        </div>
        <textarea
          rows={4}
          style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #d9d9d9' }}
          placeholder="Nhập lý do từ chối..."
          value={rejectReason}
          onChange={e => setRejectReason(e.target.value)}
          maxLength={255}
          disabled={rejectSuccess}
        />
      </Modal>
    </div>
  );
};

export default HealthCheckList;
