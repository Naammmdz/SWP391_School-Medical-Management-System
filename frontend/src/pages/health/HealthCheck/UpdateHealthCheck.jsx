import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HealthCheckService from '../../../services/HealthCheckService';
import './UpdateHealthCheck.css';
import { Input } from '../../../components/ui/input';

const UpdateHealthCheck = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const campaignId = localStorage.getItem('selectedCampaignId');
  const [form, setForm] = useState({
    campaignName: '',
    targetGroup: '',
    type: '',
    address: '',
    description: '',
    scheduledDate: '',
    status: 'CRAFT',
    organizer: user.id || ''
  });
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchCampaign = async () => {
      setLoading(true);
      try {
        const data = await HealthCheckService.getHealthCheckCampaignById(
          campaignId,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setForm({
          campaignName: data.campaignName || '',
          targetGroup: data.targetGroup || '',
          type: data.type || '',
          address: data.address || '',
          organizer: data.organizer || user.id || '',
          description: data.description || '',
          scheduledDate: data.scheduledDate || '',
          status: data.status || 'CRAFT'
        });
      } catch (err) {
        setErrorMsg('Không thể tải thông tin chiến dịch!');
      }
      setLoading(false);
    };
    if (campaignId) {
      fetchCampaign();
    } else {
      setErrorMsg('Không tìm thấy ID chiến dịch!');
      setLoading(false);
    }
  }, [campaignId, token, user.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await HealthCheckService.updateHealthCheckCampaign(
        campaignId,
        form,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSuccessMsg('Cập nhật chiến dịch thành công!');
      setTimeout(() => navigate(-1), 1200);
    } catch (err) {
      setErrorMsg('Cập nhật chiến dịch thất bại!');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  const canEditStatus =
    user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_PRINCIPAL';

  return (
    <div className="update-health-check-container">
      <h2>Cập nhật chiến dịch kiểm tra sức khỏe</h2>
      <form onSubmit={handleSubmit} className="campaign-form">
        <div className="form-group">
          <label>Tên chiến dịch</label>
          <Input
            type="text"
            name="campaignName"
            value={form.campaignName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Đối tượng áp dụng</label>
          <Input
            type="text"
            name="targetGroup"
            value={form.targetGroup}
            onChange={handleInputChange}
            placeholder="VD: Lớp 3A, 3B, 3C hoặc Khối 3"
            required
          />
        </div>
        <div className="form-group">
          <label>Loại chiến dịch</label>
          <Input
            type="text"
            name="type"
            value={form.type}
            onChange={handleInputChange}
            placeholder="VD: Khám sức khỏe định kỳ"
            required
          />
        </div>
        <div className="form-group">
          <label>Địa điểm tổ chức</label>
          <Input
            type="text"
            name="address"
            value={form.address}
            onChange={handleInputChange}
            placeholder="VD: Phòng y tế, Hội trường"
            required
          />
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Ngày dự kiến</label>
          <Input
            type="date"
            name="scheduledDate"
            value={form.scheduledDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Trạng thái</label>
          <select
            name="status"
            value={form.status}
            onChange={handleInputChange}
            required
            disabled={!canEditStatus}
          >
            <option value="CRAFT">CRAFT</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          {!canEditStatus && (
            <div className="text-muted" style={{ fontSize: 13, marginTop: 4 }}>
              {/* Chỉ hiệu trưởng hoặc quản trị viên mới được thay đổi trạng thái. */}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Người thực hiện</label>
          <Input
            type="text"
            name="organizer"
            value={form.organizer}
            readOnly
            disabled
          />
        </div>
        <button type="submit" className="btn btn-primary">Cập nhật</button>
        {successMsg && <div className="success-message">{successMsg}</div>}
        {errorMsg && <div className="error-message">{errorMsg}</div>}
      </form>
    </div>
  );
};

export default UpdateHealthCheck;