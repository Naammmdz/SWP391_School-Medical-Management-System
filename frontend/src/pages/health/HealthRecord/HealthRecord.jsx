import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import './HealthRecord.css';
import HealthRecordService from '../../../services/HealthRecordService';

const HealthRecord = () => {
  // Lấy studentId thực tế, ví dụ từ localStorage hoặc useParams
  const studentId = '11'; // Thay bằng cách lấy studentId thực tế

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    defaultValues: {
      studentName: '',
      studentClass: '',
      allergies: '',
      chronicDiseases: '',
      treatmentHistory: '',
      eyesight: '',
      hearing: '',
      bloodType: '',
      weight: '',
      height: '',
      notes: ''
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [hasRecord, setHasRecord] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    HealthRecordService.getHealthRecordByStudentId(studentId)
      .then(res => {
        if (res.data && Object.keys(res.data).length > 0) {
          setHasRecord(true);
          reset({
            studentName: res.data.studentName || '',
            studentClass: res.data.studentClass || '',
            allergies: res.data.allergies || '',
            chronicDiseases: res.data.chronicDiseases || '',
            treatmentHistory: res.data.treatmentHistory || '',
            eyesight: res.data.eyesight || '',
            hearing: res.data.hearing || '',
            bloodType: res.data.bloodType || '',
            weight: res.data.weight || '',
            height: res.data.height || '',
            notes: res.data.notes || ''
          });
        } else {
          setHasRecord(false);
          reset();
        }
        setIsLoading(false);
      })
      .catch(() => {
        setHasRecord(false);
        setIsLoading(false);
        reset();
      });
  }, [reset, studentId, formSubmitted]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      if (hasRecord) {
        await HealthRecordService.updateHealthRecord(studentId, data);
        setUpdateSuccess(true);
      } else {
        await HealthRecordService.createHealthRecord(studentId, data);
        setFormSubmitted(true);
      }
     
      setTimeout(() => {
        setFormSubmitted(false);
        setUpdateSuccess(false);
      } ,1500);
    } catch (err) {
      setError('Có lỗi xảy ra khi lưu hồ sơ. Vui lòng thử lại sau.');
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="health-record-page">
      
      <div className="container">
        <h1 className="page-title">Hồ Sơ Sức Khỏe Học Sinh</h1>
        {formSubmitted && (
          <div className="success-message">
            <h2>Thông tin đã được gửi thành công!</h2>
          </div>
        )}
        {
          updateSuccess && (
            <div className='success-message'>
              <h2>Cập nhật hồ sơ thành công!</h2>
              </div>
          )
        }
        <form onSubmit={handleSubmit(onSubmit)} className="health-record-form">
          <div className="form-group">
            <label>Họ và tên</label>
            <input type="text" className="form-control" {...register("studentName", { required: true })} />
            {errors.studentName && <span className="text-danger">Vui lòng nhập họ tên</span>}
          </div>
          <div className="form-group">
            <label>Lớp</label>
            <input type="text" className="form-control" {...register("studentClass", { required: true })} />
            {errors.studentClass && <span className="text-danger">Vui lòng nhập lớp</span>}
          </div>
          <div className="form-group">
            <label>Dị ứng</label>
            <input type="text" className="form-control" {...register("allergies")} />
          </div>
          <div className="form-group">
            <label>Bệnh mãn tính</label>
            <input type="text" className="form-control" {...register("chronicDiseases")} />
          </div>
          <div className="form-group">
            <label>Lịch sử điều trị</label>
            <input type="text" className="form-control" {...register("treatmentHistory")} />
          </div>
          <div className="form-group">
            <label>Thị lực</label>
            <input type="text" className="form-control" {...register("eyesight")} />
          </div>
          <div className="form-group">
            <label>Thính lực</label>
            <input type="text" className="form-control" {...register("hearing")} />
          </div>
          <div className="form-group">
            <label>Nhóm máu</label>
            <input type="text" className="form-control" {...register("bloodType")} />
          </div>
          <div className="form-group">
            <label>Cân nặng (kg)</label>
            <input type="number" step="0.1" className="form-control" {...register("weight")} />
          </div>
          <div className="form-group">
            <label>Chiều cao (cm)</label>
            <input type="number" step="0.1" className="form-control" {...register("height")} />
          </div>
          <div className="form-group">
            <label>Ghi chú</label>
            <textarea className="form-control" {...register("notes")} />
          </div>
          {error && <div className="text-danger mb-2">{error}</div>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : hasRecord ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ'}
            </button>
          </div>
        </form>
      </div>
     
    </div>
  );
};

export default HealthRecord;