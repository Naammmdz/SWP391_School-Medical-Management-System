import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HealthCheckService from '../../../services/HealthCheckService';
import './UpdateHealthCheck.css';

const UpdateHealthCheck = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  // Lấy id từ localStorage thay vì useParams
  const campaignId = localStorage.getItem('selectedCampaignId');
  const [form, setForm] = useState({
    campaignName: '',
    description: '',
    scheduledDate: '',
    status: 'CRAFT'
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
  }, [campaignId, token]);

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
      console.log('ID gửi lên backend:', campaignId);
      console.log('Form gửi lên backend:', form);
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

  return (
    <div className="update-health-check-container">
      <h2>Cập nhật chiến dịch kiểm tra sức khỏe</h2>
      <form onSubmit={handleSubmit} className="campaign-form">
        <div className="form-group">
          <label>Tên chiến dịch</label>
          <input
            type="text"
            name="campaignName"
            value={form.campaignName}
            onChange={handleInputChange}
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
          <input
            type="date"
            name="scheduledDate"
            value={form.scheduledDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Trạng thái</label>
          <input
            type="text"
            name="status"
            value={form.status}
            onChange={handleInputChange}
            required
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