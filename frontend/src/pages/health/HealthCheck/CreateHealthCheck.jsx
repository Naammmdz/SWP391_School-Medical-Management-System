import React, { useState } from 'react';
import './CreateHealthCheck.css';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import HealthCheckService from '../../../services/HealthCheckService';

const CreateHealthCheck = () => {
  const nurse = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const [form, setForm] = useState({
    campaignName: '',
    targetGroup: '',
    type: '',
    address: '',
    description: '',
    scheduledDate: '',
    status: 'CRAFT',
    organizer: nurse.id || '' 
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
    // Gửi status là PENDING khi tạo chiến dịch
    const submitData = { ...form, status: 'PENDING' };
    await HealthCheckService.createHealthCheckCampaign(
      submitData, // truyền body trước
      { headers: { Authorization: `Bearer ${token}` } } // truyền config sau
    );

    setSuccessMsg('Tạo chiến dịch kiểm tra sức khỏe thành công!');
    setForm({
      campaignName: '',
      targetGroup: '',
      type: '',
      address: '',
      description: '',
      scheduledDate: '',
      status: 'CRAFT',
      organizer: nurse.id || ''
    });
  } catch (err) {
    setErrorMsg('Tạo chiến dịch thất bại!');
  }
};

  return (
    <div className="health-check-container">
      {(nurse.userRole === 'ROLE_NURSE' || nurse.userRole === 'ROLE_ADMIN') && (
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
              <Textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Ngày khám</label>
              <Input
                type="date"
                name="scheduledDate"
                value={form.scheduledDate}
                onChange={handleInputChange}
                required
              />
            </div>
           
            <div className="form-group">
              <label>Người thực hiện</label>
              <Input
                type="text"
                name="organizer"
                value={nurse.fullName || ''}
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

export default CreateHealthCheck;