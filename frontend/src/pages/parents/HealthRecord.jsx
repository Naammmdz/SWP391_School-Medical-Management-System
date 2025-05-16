import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import './HealthRecord.css';

const HealthRecord = () => {
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      studentInfo: {
        fullName: '',
        studentId: '',
        dateOfBirth: '',
        class: '',
        gender: '',
      },
      allergies: [{ allergen: '', severity: '' }],
      chronicConditions: [{ condition: '', medications: '' }],
      physicalInfo: {
        height: '',
        weight: '',
        bloodType: '',
        vision: '',
        hearing: ''
      },
      vaccinations: [{ name: '', date: '' }]
    }
  });

  const { 
    fields: allergyFields, 
    append: appendAllergy, 
    remove: removeAllergy 
  } = useFieldArray({
    control,
    name: "allergies"
  });

  const { 
    fields: conditionFields, 
    append: appendCondition, 
    remove: removeCondition 
  } = useFieldArray({
    control,
    name: "chronicConditions"
  });

  const { 
    fields: vaccinationFields, 
    append: appendVaccination, 
    remove: removeVaccination 
  } = useFieldArray({
    control,
    name: "vaccinations"
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const onSubmit = (data) => {
    console.log(data);
    // Mô phỏng gọi API
    setTimeout(() => {
      setFormSubmitted(true);
    }, 1000);
  };

  return (
    <div className="health-record-page">
      <Header />
      
      <div className="container">
        <h1 className="page-title">Hồ Sơ Sức Khỏe Học Sinh</h1>
        
        {formSubmitted ? (
          <div className="success-message">
            <h2>Thông tin đã được gửi thành công!</h2>
            <p>Cảm ơn bạn đã cung cấp thông tin sức khỏe của học sinh.</p>
            <button className="btn btn-primary" onClick={() => setFormSubmitted(false)}>Tạo hồ sơ mới</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="health-record-form">
            <div className="form-tabs">
              <button 
                type="button" 
                className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                Thông tin cơ bản
              </button>
              <button 
                type="button" 
                className={`tab-button ${activeTab === 'allergies' ? 'active' : ''}`}
                onClick={() => setActiveTab('allergies')}
              >
                Dị ứng
              </button>
              <button 
                type="button" 
                className={`tab-button ${activeTab === 'chronic' ? 'active' : ''}`}
                onClick={() => setActiveTab('chronic')}
              >
                Bệnh mãn tính
              </button>
              <button 
                type="button" 
                className={`tab-button ${activeTab === 'physical' ? 'active' : ''}`}
                onClick={() => setActiveTab('physical')}
              >
                Thể chất
              </button>
              <button 
                type="button" 
                className={`tab-button ${activeTab === 'vaccinations' ? 'active' : ''}`}
                onClick={() => setActiveTab('vaccinations')}
              >
                Tiêm chủng
              </button>
            </div>

            {/* Thông tin cơ bản */}
            <div className={`tab-content ${activeTab === 'basic' ? 'active' : ''}`}>
              <h2 className="section-title">Thông tin học sinh</h2>
              
              <div className="form-group">
                <label htmlFor="fullName">Họ và tên <span className="required">*</span></label>
                <input 
                  type="text" 
                  id="fullName" 
                  className={`form-control ${errors.studentInfo?.fullName ? 'invalid' : ''}`}
                  {...register("studentInfo.fullName", { required: true })}
                />
                {errors.studentInfo?.fullName && <span className="error-message">Vui lòng nhập họ tên học sinh</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="studentId">Mã học sinh <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="studentId" 
                    className={`form-control ${errors.studentInfo?.studentId ? 'invalid' : ''}`}
                    {...register("studentInfo.studentId", { required: true })}
                  />
                  {errors.studentInfo?.studentId && <span className="error-message">Vui lòng nhập mã học sinh</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="dateOfBirth">Ngày sinh <span className="required">*</span></label>
                  <input 
                    type="date" 
                    id="dateOfBirth" 
                    className={`form-control ${errors.studentInfo?.dateOfBirth ? 'invalid' : ''}`}
                    {...register("studentInfo.dateOfBirth", { required: true })}
                  />
                  {errors.studentInfo?.dateOfBirth && <span className="error-message">Vui lòng nhập ngày sinh</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="class">Lớp <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="class" 
                    className={`form-control ${errors.studentInfo?.class ? 'invalid' : ''}`}
                    {...register("studentInfo.class", { required: true })}
                  />
                  {errors.studentInfo?.class && <span className="error-message">Vui lòng nhập lớp</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Giới tính <span className="required">*</span></label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      value="Nam" 
                      {...register("studentInfo.gender", { required: true })}
                    />
                    Nam
                  </label>
                  <label className="radio-label">
                    <input 
                      type="radio" 
                      value="Nữ" 
                      {...register("studentInfo.gender", { required: true })}
                    />
                    Nữ
                  </label>
                </div>
                {errors.studentInfo?.gender && <span className="error-message">Vui lòng chọn giới tính</span>}
              </div>
            </div>

            {/* Dị ứng */}
            <div className={`tab-content ${activeTab === 'allergies' ? 'active' : ''}`}>
              <h2 className="section-title">Thông tin dị ứng</h2>
              
              {allergyFields.map((field, index) => (
                <div key={field.id} className="repeatable-section">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`allergies[${index}].allergen`}>Tác nhân gây dị ứng</label>
                      <input 
                        type="text" 
                        id={`allergies[${index}].allergen`} 
                        className="form-control"
                        placeholder="Ví dụ: Hải sản, phấn hoa..."
                        {...register(`allergies.${index}.allergen`)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`allergies[${index}].severity`}>Mức độ nghiêm trọng</label>
                      <select 
                        id={`allergies[${index}].severity`} 
                        className="form-control"
                        {...register(`allergies.${index}.severity`)}
                      >
                        <option value="">-- Chọn mức độ --</option>
                        <option value="Nhẹ">Nhẹ</option>
                        <option value="Trung bình">Trung bình</option>
                        <option value="Nặng">Nặng</option>
                      </select>
                    </div>
                  </div>
                  
                  {allergyFields.length > 1 && (
                    <button 
                      type="button" 
                      className="btn btn-remove"
                      onClick={() => removeAllergy(index)}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}
              
              <button 
                type="button" 
                className="btn btn-add"
                onClick={() => appendAllergy({ allergen: '', severity: '' })}
              >
                Thêm dị ứng khác
              </button>
            </div>

            {/* Bệnh mãn tính */}
            <div className={`tab-content ${activeTab === 'chronic' ? 'active' : ''}`}>
              <h2 className="section-title">Thông tin bệnh mãn tính</h2>
              
              {conditionFields.map((field, index) => (
                <div key={field.id} className="repeatable-section">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`chronicConditions[${index}].condition`}>Tên bệnh</label>
                      <input 
                        type="text" 
                        id={`chronicConditions[${index}].condition`} 
                        className="form-control"
                        placeholder="Ví dụ: Hen suyễn, tiểu đường..."
                        {...register(`chronicConditions.${index}.condition`)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`chronicConditions[${index}].medications`}>Thuốc đang sử dụng</label>
                      <input 
                        type="text" 
                        id={`chronicConditions[${index}].medications`} 
                        className="form-control"
                        placeholder="Các loại thuốc đang dùng..."
                        {...register(`chronicConditions.${index}.medications`)}
                      />
                    </div>
                  </div>
                  
                  {conditionFields.length > 1 && (
                    <button 
                      type="button" 
                      className="btn btn-remove"
                      onClick={() => removeCondition(index)}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}
              
              <button 
                type="button" 
                className="btn btn-add"
                onClick={() => appendCondition({ condition: '', medications: '' })}
              >
                Thêm bệnh mãn tính khác
              </button>
            </div>

            {/* Thông tin thể chất */}
            <div className={`tab-content ${activeTab === 'physical' ? 'active' : ''}`}>
              <h2 className="section-title">Thông tin thể chất</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="height">Chiều cao (cm)</label>
                  <input 
                    type="number" 
                    id="height" 
                    className="form-control"
                    placeholder="Ví dụ: 145"
                    {...register("physicalInfo.height")}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Cân nặng (kg)</label>
                  <input 
                    type="number" 
                    id="weight" 
                    className="form-control"
                    placeholder="Ví dụ: 40"
                    step="0.1"
                    {...register("physicalInfo.weight")}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bloodType">Nhóm máu</label>
                  <select 
                    id="bloodType" 
                    className="form-control"
                    {...register("physicalInfo.bloodType")}
                  >
                    <option value="">-- Chọn nhóm máu --</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="O">O</option>
                    <option value="AB">AB</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="vision">Thị lực</label>
                  <select 
                    id="vision" 
                    className="form-control"
                    {...register("physicalInfo.vision")}
                  >
                    <option value="">-- Chọn tình trạng --</option>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Cận thị nhẹ">Cận thị nhẹ</option>
                    <option value="Cận thị nặng">Cận thị nặng</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="hearing">Thính lực</label>
                  <select 
                    id="hearing" 
                    className="form-control"
                    {...register("physicalInfo.hearing")}
                  >
                    <option value="">-- Chọn tình trạng --</option>
                    <option value="Bình thường">Bình thường</option>
                    <option value="Giảm nhẹ">Giảm nhẹ</option>
                    <option value="Giảm nặng">Giảm nặng</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tiêm chủng */}
            <div className={`tab-content ${activeTab === 'vaccinations' ? 'active' : ''}`}>
              <h2 className="section-title">Thông tin tiêm chủng</h2>
              
              {vaccinationFields.map((field, index) => (
                <div key={field.id} className="repeatable-section">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`vaccinations[${index}].name`}>Tên vắc xin</label>
                      <input 
                        type="text" 
                        id={`vaccinations[${index}].name`} 
                        className="form-control"
                        placeholder="Ví dụ: MMR, BCG, COVID-19..."
                        {...register(`vaccinations.${index}.name`)}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor={`vaccinations[${index}].date`}>Ngày tiêm</label>
                      <input 
                        type="date" 
                        id={`vaccinations[${index}].date`} 
                        className="form-control"
                        {...register(`vaccinations.${index}.date`)}
                      />
                    </div>
                  </div>
                  
                  {vaccinationFields.length > 1 && (
                    <button 
                      type="button" 
                      className="btn btn-remove"
                      onClick={() => removeVaccination(index)}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              ))}
              
              <button 
                type="button" 
                className="btn btn-add"
                onClick={() => appendVaccination({ name: '', date: '' })}
              >
                Thêm tiêm chủng khác
              </button>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary">Hủy</button>
              <button type="submit" className="btn btn-primary">Lưu hồ sơ</button>
            </div>
          </form>
        )}
      </div>
      
    
    </div>
  );
};

export default HealthRecord; 