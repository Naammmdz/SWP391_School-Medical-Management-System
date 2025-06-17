import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VaccinationService from '../../../services/VaccinationService';

const CreateVaccinationCampaign = () => {
  const nurse = JSON.parse(localStorage.getItem('user') || '{}');
  const [form, setForm] = useState({
    campaignName: '',
    targetGroup: '',
    type: '',
    address: '',
    organizer: nurse.id || '',
    description: '',
    scheduledDate: '',
    status: 'CRAFT' // Mặc định là nháp khi nhập form
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!form.campaignName || !form.scheduledDate) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      // Khi gửi đi, trạng thái là PENDING
      const data = {
        ...form,
        status: 'PENDING'
      };
      await VaccinationService.createVaccinationCampaign(data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setSuccessMsg('Tạo chiến dịch tiêm chủng thành công!');
      setTimeout(() => {
        setSuccessMsg('');
        navigate('/quanlytiemchung');
      }, 1500);
    } catch (err) {
      setError('Tạo chiến dịch thất bại!');
    }
  };

  return (
    <div className="create-vaccination-campaign-container">
      <h2>Tạo chiến dịch tiêm chủng</h2>
      <form onSubmit={handleSubmit} className="campaign-form">
        <div className="form-group">
          <label>Tên chiến dịch <span style={{color: 'red'}}>*</span></label>
          <input
            type="text"
            name="campaignName"
            value={form.campaignName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Đối tượng <span style={{color: 'red'}}>*</span></label>
          <input
            type="text"
            name="targetGroup"
            value={form.targetGroup}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Địa điểm <span style={{color: 'red'}}>*</span></label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Ngày tiêm chủng <span style={{color: 'red'}}>*</span></label>
          <input
            type="date"
            name="scheduledDate"
            value={form.scheduledDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        {/* Trạng thái mặc định là nháp, không cho nhập */}
        <div className="form-group">
          <label>Trạng thái</label>
          <input
            type="text"
            name="status"
            value="Nháp"
            readOnly
            disabled
          />
        </div>
        {/* Organizer hiển thị tên người tạo, không cho nhập */}
        <div className="form-group">
          <label>Người tạo</label>
          <input
            type="text"
            name="organizer"
            value={nurse.fullName || ''}
            readOnly
            disabled
          />
        </div>
        <button type="submit" className="btn btn-primary">Tạo chiến dịch</button>
        {successMsg && <div className="success-message">{successMsg}</div>}
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default CreateVaccinationCampaign;