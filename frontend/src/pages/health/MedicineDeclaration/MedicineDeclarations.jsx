import React, { useState, useEffect } from 'react';
import { Send, Info } from 'lucide-react';
import './MedicineDeclarations.css';
import MedicineDeclarationService from '../../../services/MedicineDeclarationService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const MedicineDeclarations = () => {
  const navigate = useNavigate();
  const selectedStudentId = localStorage.getItem('selectedStudentId');

  // State cho thông tin học sinh
  const [studentInfo, setStudentInfo] = useState({
    studentId: '',
    studentName: '',
    classroom: ''
  });

  const [formData, setFormData] = useState({
    instruction: '',
    startDate: '',
    endDate: '',
    notes: ''
  });

  const [imageFile, setImageFile] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy thông tin học sinh từ localStorage (danh sách students đã lưu)
  useEffect(() => {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const student = students.find(s => String(s.studentId) === String(selectedStudentId));
    if (student) {
      setStudentInfo({
        studentId: student.studentId,
        studentName: student.fullName,
        classroom: student.className
      });
    }
    setIsLoading(false);
  }, [selectedStudentId]);

  const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value
  });
};

const handleImageChange = (e) => {
  setImageFile(e.target.files[0] || null);
};

const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !studentInfo.studentId ||
    !formData.instruction ||
    !formData.startDate ||
    !formData.endDate
  ) {
    toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc');
    return;
  }

  if (!imageFile) {
    toast.error('Vui lòng chọn hình ảnh đơn thuốc!');
    return;
  }

  const duration =
    formData.startDate && formData.endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(formData.endDate) - new Date(formData.startDate)) /
              (1000 * 60 * 60 * 24) +
              1
          )
        )
      : 1;

  // Chuẩn bị dữ liệu theo API mới
  const requestData = {
    studentId: studentInfo.studentId,
    instruction: formData.instruction,
    duration,
    startDate: formData.startDate,
    endDate: formData.endDate,
    notes: formData.notes
  };

  const token = localStorage.getItem('token');

  setIsSubmitting(true);
  setSubmitError(null);
  try {
    await MedicineDeclarationService.createMedicineSubmission(
      { requestData, imageFile },
      token
    );

    setFormData({
      instruction: '',
      startDate: '',
      endDate: '',
      notes: ''
    });
    setImageFile(null);
    setSubmitSuccess(true);
    toast.success('Khai báo thuốc đã được gửi thành công!');
    setTimeout(() => setSubmitSuccess(false), 5000);
  } catch (err) {
    setSubmitError('Có lỗi xảy ra khi gửi khai báo. Vui lòng thử lại sau.');
    toast.error('Có lỗi xảy ra khi gửi khai báo. Vui lòng thử lại sau.');
  } finally {
    setIsSubmitting(false);
  }
};

  if (isLoading) {
    return (
      <div className="parent-page medicine-declaration-page">
        <div className="page-header">
          <h1>Khai Báo Thuốc</h1>
        </div>
        <div className="loading">Đang tải thông tin học sinh...</div>
      </div>
    );
  }

  return (
    <div className="parent-page medicine-declaration-page">
      <div className="page-header">
        <h1>Khai Báo Thuốc</h1>
        <button
          className="view-sent-medicine-btn"
          style={{
            float: 'right',
            marginTop: '-40px',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '8px 18px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
          onClick={() => navigate('/donthuocdagui')}
        >
          Xem Đơn Thuốc Đã Gửi
        </button>
      </div>

      {submitSuccess && (
        <div className="success-message">
          <p>Khai báo thuốc đã được gửi thành công! Nhân viên y tế sẽ xem xét và liên hệ nếu cần thêm thông tin.</p>
        </div>
      )}

      {submitError && (
        <div className="error-message">
          <p>{submitError}</p>
        </div>
      )}

      <div className="declaration-container">
        <div className="info-card">
          <div className="info-icon">
            <Info size={20} />
          </div>
          <div className="info-content">
            <h3>Hướng dẫn khai báo thuốc</h3>
            <ul>
              <li>Vui lòng mô tả tình trạng bệnh và hướng dẫn sử dụng thuốc</li>
              <li>Điền đầy đủ thông tin về thuốc cần sử dụng</li>
              <li>Nhân viên y tế sẽ kiểm tra và xử lý khai báo</li>
              <li>Mọi thông tin sẽ được bảo mật và chỉ sử dụng cho mục đích chăm sóc sức khỏe của học sinh</li>
            </ul>
          </div>
        </div>

        <form className="declaration-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <h2>Thông tin học sinh</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Tên học sinh</label>
              <input
                type="text"
                value={studentInfo.studentName}
                disabled
                className="disabled-input"
              />
            </div>
            <div className="form-group">
              <label>Lớp</label>
              <input
                type="text"
                value={studentInfo.classroom}
                disabled
                className="disabled-input"
              />
            </div>
          </div>

          <h2>Thông tin thuốc</h2>
          <div className="form-group">
            <label>Hướng dẫn sử dụng thuốc <span className="required">*</span></label>
            <textarea
              name="instruction"
              value={formData.instruction}
              onChange={handleInputChange}
              rows="2"
              placeholder="Hướng dẫn cụ thể về liều lượng, thời gian uống thuốc"
              required
              maxLength={255}
            ></textarea>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Ngày bắt đầu <span className="required">*</span></label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Ngày kết thúc <span className="required">*</span></label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Ghi chú thêm</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="2"
              maxLength={500}
              placeholder="Thông tin thêm mà nhân viên y tế cần biết"
            ></textarea>
          </div>
          <div className="form-group">
            <label>Hình ảnh đơn thuốc <span className="required">*</span></label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imageFile && (
              <div style={{ marginTop: 8 }}>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  style={{ maxWidth: 200, maxHeight: 120, borderRadius: 6, border: '1px solid #eee' }}
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : (
                <>
                  <Send size={16} />
                  Gửi Thuốc
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineDeclarations;