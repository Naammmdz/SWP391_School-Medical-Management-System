import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import './HealthRecord.css';


const HealthRecord = () => {
  const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
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

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Mock data - sẽ được thay thế bằng API call sau này
  const mockStudentData = {
    studentInfo: {
      fullName: 'Nguyễn Văn A',
      studentId: 'HS001',
      dateOfBirth: '2010-05-15',
      class: '10A1',
      gender: 'Nam'
    },
    allergies: [
      { allergen: 'Hải sản', severity: 'Nặng' },
      { allergen: 'Phấn hoa', severity: 'Nhẹ' }
    ],
    chronicConditions: [
      { condition: 'Hen suyễn', medications: 'Ventolin' }
    ],
    physicalInfo: {
      height: '165',
      weight: '50',
      bloodType: 'A',
      vision: 'Bình thường',
      hearing: 'Bình thường'
    },
    vaccinations: [
      { name: 'COVID-19', date: '2023-01-15' },
      { name: 'Cúm', date: '2023-03-20' }
    ]
  };

  // Fetch student data when component mounts
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Comment out actual API call for now
        /*
        const response = await fetch('/api/student/health-record', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }

        const data = await response.json();
        */
        
        // Use mock data instead
        const data = mockStudentData;
        
        // Reset form with fetched data
        reset({
          studentInfo: {
            fullName: data.studentInfo.fullName || '',
            studentId: data.studentInfo.studentId || '',
            dateOfBirth: data.studentInfo.dateOfBirth || '',
            class: data.studentInfo.class || '',
            gender: data.studentInfo.gender || '',
          },
          allergies: data.allergies?.length > 0 ? data.allergies : [{ allergen: '', severity: '' }],
          chronicConditions: data.chronicConditions?.length > 0 ? data.chronicConditions : [{ condition: '', medications: '' }],
          physicalInfo: {
            height: data.physicalInfo?.height || '',
            weight: data.physicalInfo?.weight || '',
            bloodType: data.physicalInfo?.bloodType || '',
            vision: data.physicalInfo?.vision || '',
            hearing: data.physicalInfo?.hearing || ''
          },
          vaccinations: data.vaccinations?.length > 0 ? data.vaccinations : [{ name: '', date: '' }]
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Không thể tải thông tin học sinh. Vui lòng thử lại sau.');
        setIsLoading(false);
      }
    }, 1000); // Simulate 1 second loading time
  }, [reset]);

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

  const onSubmit = async (data) => {
    try {
      // Comment out actual API call for now
      /*
      const response = await fetch('/api/student/health-record', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to save health record');
      }
      */
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Submitted data:', data);
      setFormSubmitted(true);
    } catch (err) {
      console.error('Error saving health record:', err);
      alert('Có lỗi xảy ra khi lưu hồ sơ. Vui lòng thử lại sau.');
    }
  };

  if (isLoading) {
    return (
      <div className="health-record-page">
        <Header />
        <div className="container">
          <div className="loading">Đang tải thông tin học sinh...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="health-record-page">
        <Header />
        <div className="container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Thử lại</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="health-record-page">
      <Header />
      
      <div className="container">
        <h1 className="page-title">Hồ Sơ Sức Khỏe Học Sinh</h1>
        
        {formSubmitted ? (
          <div className="success-message">
            <h2>Thông tin đã được gửi thành công!</h2>
            <p>Cảm ơn bạn đã cung cấp thông tin sức khỏe của học sinh.</p>
            <button className="btn btn-primary" onClick={() => setFormSubmitted(false)}>Cập nhật hồ sơ</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="health-record-form">
            {/* Thông tin học sinh */}
            <h2 className="section-title">Thông tin học sinh</h2>
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input 
                type="text" 
                id="fullName" 
                className="form-control"
                {...register("studentInfo.fullName")}
                disabled
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="studentId">Mã học sinh</label>
                <input 
                  type="text" 
                  id="studentId" 
                  className="form-control"
                  {...register("studentInfo.studentId")}
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateOfBirth">Ngày sinh</label>
                <input 
                  type="date" 
                  id="dateOfBirth" 
                  className="form-control"
                  {...register("studentInfo.dateOfBirth")}
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="class">Lớp</label>
                <input 
                  type="text" 
                  id="class" 
                  className="form-control"
                  {...register("studentInfo.class")}
                  disabled
                />
              </div>
            </div>
            <div className="form-group">
              <label>Giới tính</label>
              <input 
                type="text" 
                className="form-control"
                {...register("studentInfo.gender")}
                disabled
              />
            </div>

            {/* Dị ứng */}
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

            {/* Bệnh mãn tính */}
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

            {/* Thông tin thể chất */}
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

            {/* Tiêm chủng */}
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