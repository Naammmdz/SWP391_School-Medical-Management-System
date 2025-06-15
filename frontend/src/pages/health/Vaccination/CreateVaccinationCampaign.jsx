import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VaccinationService from '../../../services/VaccinationService';

const statusOptions = [
  { value: '', label: 'Chọn trạng thái' },
  { value: 'CRAFT', label: 'Nháp' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'REJECTED', label: 'Từ chối' }
];

const CreateVaccinationCampaign = () => {
  const [form, setForm] = useState({
    campaignName: '',
    description: '',
    scheduledDate: '',
    status: ''
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
    // Validate
    if (!form.campaignName || !form.scheduledDate || !form.status) {
      setError('Vui lòng nhập đầy đủ thông tin bắt buộc.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      // scheduledDate phải là LocalDate (yyyy-MM-dd)
      const data = {
        campaignName: form.campaignName,
        description: form.description,
        scheduledDate: form.scheduledDate,
        status: form.status
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
        <div className="form-group">
          <label>Trạng thái <span style={{color: 'red'}}>*</span></label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Tạo chiến dịch</button>
        {successMsg && <div className="success-message">{successMsg}</div>}
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default CreateVaccinationCampaign;