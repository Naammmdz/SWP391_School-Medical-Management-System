import React, { useState, useRef } from 'react';
import { Camera, Upload, Send, X, Image as ImageIcon, Info } from 'lucide-react';
import './ParentPages.css';

const MedicineDeclarations = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    classroom: '',
    condition: '',
    instructions: '',
    startDate: '',
    endDate: '',
    additionalNotes: '',
  });

  const [prescriptionImg, setPrescriptionImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  const fileInputRef = useRef(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.match('image.*')) {
      alert('Vui lòng chọn file hình ảnh');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file quá lớn. Vui lòng chọn file dưới 5MB');
      return;
    }
    
    setPrescriptionImg(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  const handleCaptureClick = () => {
    fileInputRef.current.click();
  };
  
  const removeImage = () => {
    setPrescriptionImg(null);
    setImgPreview(null);
    fileInputRef.current.value = "";
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!prescriptionImg) {
      alert('Vui lòng tải lên hình ảnh đơn thuốc');
      return;
    }
    
    if (!formData.studentName || !formData.classroom || !formData.condition) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Here we would upload the image and form data to the API
      // For now we'll just simulate a successful API call
      
      // Create FormData object to send both text and file data
      const submitData = new FormData();
      submitData.append('prescriptionImg', prescriptionImg);
      
      // Add all form fields to the FormData
      for (const key in formData) {
        submitData.append(key, formData[key]);
      }
      
      // API call would go here
      // const response = await fetch('api/medicine-declarations', {
      //   method: 'POST',
      //   body: submitData
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', formData);
      console.log('Image submitted:', prescriptionImg);
      
      // Reset form after successful submission
      setFormData({
        studentName: '',
        classroom: '',
        condition: '',
        instructions: '',
        startDate: '',
        endDate: '',
        additionalNotes: '',
      });
      setPrescriptionImg(null);
      setImgPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      setSubmitSuccess(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error submitting form:', err);
      setSubmitError('Có lỗi xảy ra khi gửi khai báo. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="parent-page medicine-declaration-page">
      <div className="page-header">
        <h1>Khai Báo Thuốc</h1>
      </div>
      
      {submitSuccess && (
        <div className="success-message">
          <p>Khai báo thuốc đã được gửi thành công! Nhà trường sẽ xem xét và liên hệ nếu cần thêm thông tin.</p>
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
              <li>Vui lòng điền đầy đủ thông tin học sinh và mô tả tình trạng bệnh</li>
              <li>Đính kèm hình ảnh đơn thuốc hoặc giấy chỉ định của bác sĩ</li>
              <li>Nhân viên y tế sẽ kiểm tra và xử lý khai báo</li>
              <li>Mọi thông tin sẽ được bảo mật và chỉ sử dụng cho mục đích chăm sóc sức khỏe của học sinh</li>
            </ul>
          </div>
        </div>
      
        <form className="declaration-form" onSubmit={handleSubmit}>
          <h2>Thông tin học sinh</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="studentName">Tên học sinh <span className="required">*</span></label>
              <input
                type="text"
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="classroom">Lớp <span className="required">*</span></label>
              <input
                type="text"
                id="classroom"
                name="classroom"
                value={formData.classroom}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <h2>Thông tin bệnh lý và thuốc</h2>
          <div className="form-group">
            <label htmlFor="condition">Mô tả tình trạng bệnh <span className="required">*</span></label>
            <textarea
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleInputChange}
              rows="3"
              placeholder="Mô tả chi tiết tình trạng bệnh của học sinh"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="instructions">Hướng dẫn sử dụng thuốc</label>
            <textarea
              id="instructions"
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              rows="2"
              placeholder="Vui lòng cung cấp hướng dẫn cụ thể về liều lượng và thời gian uống thuốc"
            ></textarea>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Ngày bắt đầu</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate">Ngày kết thúc</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="additionalNotes">Ghi chú thêm</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleInputChange}
              rows="2"
              placeholder="Thông tin thêm mà nhân viên y tế cần biết"
            ></textarea>
          </div>
          
          <div className="prescription-upload">
            <h2>Đơn thuốc <span className="required">*</span></h2>
            <p className="upload-description">Vui lòng tải lên hình ảnh đơn thuốc hoặc tài liệu y tế từ bác sĩ</p>
            
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              ref={fileInputRef}
              className="hidden-input"
            />
            
            {!imgPreview ? (
              <div className="upload-container">
                <div className="upload-prompt" onClick={handleCaptureClick}>
                  <div className="upload-icon-container">
                    <Upload size={32} className="upload-icon" />
                  </div>
                  <p>Kéo thả hình ảnh vào đây hoặc nhấn để tải lên</p>
                  <button type="button" className="upload-button">Chọn hình ảnh</button>
                </div>
                <button type="button" className="capture-button" onClick={handleCaptureClick}>
                  <Camera size={16} />
                  Chụp ảnh
                </button>
              </div>
            ) : (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img src={imgPreview} alt="Đơn thuốc" />
                  <button type="button" className="remove-image-btn" onClick={removeImage}>
                    <X size={16} />
                  </button>
                </div>
                <div className="image-info">
                  <div className="image-icon">
                    <ImageIcon size={16} />
                  </div>
                  <span className="image-name">{prescriptionImg.name}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="form-actions">
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi...' : (
                <>
                  <Send size={16} />
                  Gửi khai báo
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
