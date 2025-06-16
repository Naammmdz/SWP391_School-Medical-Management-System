import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HealthCheckService from '../../../services/HealthCheckService';
import './HealthCheckList.css';
const HealthCheckList = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      } catch (err) {
        setError('Không thể tải danh sách chiến dịch!');
      }
      setLoading(false);
    };
    if (
      user.userRole === 'ROLE_ADMIN' ||
      user.userRole === 'ROLE_NURSE'
    ) {
      fetchCampaigns();
    }
  }, [token, user.userRole]);

  if (
    user.userRole !== 'ROLE_ADMIN' &&
    user.userRole !== 'ROLE_NURSE'
  ) {
    return <div>Bạn không có quyền truy cập trang này.</div>;
  }

  return (
    <div className="health-check-list-container">
      <h2>Danh sách chiến dịch kiểm tra sức khỏe</h2>
      <div style={{ marginBottom: 16 }}>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/kiemtradinhky')}
        >
          Tạo chiến dịch kiểm tra sức khỏe
        </button>
      </div>
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-danger">{error}</div>}
      {!loading && !error && (
        <table className="table health-check-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên chiến dịch</th>
              <th>Mô tả</th>
              <th>Ngày dự kiến</th>
              <th>Địa điểm</th>
              <th>Trạng thái</th>
              <th>Người tạo</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {campaigns && campaigns.length > 0 ? (
              campaigns.map((c, idx) => (
                <tr key={c.campaignId || idx}>
                  <td>{idx + 1}</td>
                  <td>{c.campaignName}</td>
                  <td>{c.description}</td>
                  <td>{c.scheduledDate}</td>
                  <td>{c.address}</td>
                  <td>{c.status}</td>
                  <td>{getUserNameById(c.createdBy)}</td>
                  <td>{c.createdAt}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => {
                        localStorage.setItem('selectedCampaignId', c.campaignId);
                        navigate('/capnhatkiemtradinhky');
                      }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8}>Không có chiến dịch nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HealthCheckList;