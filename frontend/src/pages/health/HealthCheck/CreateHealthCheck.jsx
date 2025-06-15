import React, { useState } from 'react';
import './CreateHealthCheck.css';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import HealthCheckService from '../../../services/HealthCheckService';

const HealthCheck = () => {
  const nurse = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const [form, setForm] = useState({
    campaignName: '',
    description: '',
    scheduledDate: '',
    status: 'CRAFT' // Đổi từ 'DRAFT' sang 'CRAFT' theo enum backend
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
      await HealthCheckService.createHealthCheckCampaign(form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccessMsg('Tạo chiến dịch kiểm tra sức khỏe thành công!');
      setForm({
        campaignName: '',
        description: '',
        scheduledDate: '',
        status: 'CRAFT' 
      });
    } catch (err) {
      setErrorMsg('Tạo chiến dịch thất bại!');
    }
  };

  return (
    <div className="health-check-container">
      {nurse.userRole === 'ROLE_NURSE' || 'ROLE_ADMIN' &&  (
        <div className="campaign-form-section">
          <h2>Tạo chiến dịch kiểm tra sức khỏe</h2>
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
              <label>Mô tả</label>
              <Textarea
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
              <Input
                type="text"
                name="status"
                value={form.status}
                readOnly
                disabled
              />
            </div>
            <Button type="submit" variant="primary">Tạo chiến dịch</Button>
            {successMsg && <div className="success-message">{successMsg}</div>}
            {errorMsg && <div className="error-message">{errorMsg}</div>}
          </form>
        </div>
      )}
    </div>
  );
};

export default HealthCheck;