import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Search, XCircle } from 'lucide-react';
import Header from '../../../components/Header';

import './HealthRecord.css';
import HealthRecordService from '../../../services/HealthRecordService';
import studentService from '../../../services/StudentService';

const HealthRecord = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const accessToken = localStorage.getItem('token');
  const isNurseOrAdmin =
    user &&
    user.userRole &&
    (user.userRole === 'ROLE_ADMIN' || user.userRole === 'ROLE_NURSE');
  const isParent = user && user.userRole === 'ROLE_PARENT';

  // Nếu là học sinh thì lấy studentId từ user
  const studentId = user && user.studentId ? user.studentId : null;

  // State cho danh sách hồ sơ (nurse/admin)
  const [healthRecords, setHealthRecords] = useState([]);
  // State cho 1 hồ sơ (student/parent)
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

  // Search states for Nurse/Admin
  const [searchFullName, setSearchFullName] = useState('');
  const [searchClassName, setSearchClassName] = useState('');
  const [availableClasses, setAvailableClasses] = useState([]);

  // Lấy id học sinh đã chọn từ localStorage (dành cho phụ huynh)
  const selectedStudentId = isParent ? localStorage.getItem('selectedStudentId') : null;

  // Fetch all health records for the table display (unfiltered)
  const fetchAllHealthRecords = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await HealthRecordService.getAllHealthRecord(config);
      setHealthRecords(res.data || []);
    } catch (err) {
      console.error("Error fetching all health records:", err);
      setError('Không thể tải danh sách hồ sơ sức khỏe!');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  const fetchFilteredHealthRecords = useCallback(async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const body = {};
      if (filters.fullName) body.name = filters.fullName;
      if (filters.className) body.className = filters.className;
      const res = await studentService.filterHealthRecord(body, config);
      setHealthRecords(res.data || []);
    } catch (err) {
      console.error("Error fetching filtered health records:", err);
      setError('Không thể tải danh sách hồ sơ sức khỏe!');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken]);

  // Fetch all classes for the dropdown independently
  const fetchAllClasses = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await HealthRecordService.getAllHealthRecord(config); 
      const classes = new Set(res.data.map(record => record.studentClass).filter(Boolean));
      setAvailableClasses(Array.from(classes));
    } catch (err) {
      console.error("Error fetching all classes:", err);
    }
  }, [accessToken]);

  useEffect(() => {
    if (isNurseOrAdmin) {
      fetchAllHealthRecords();
      fetchAllClasses();
    } else if (isParent) {
      // Nếu chưa chọn học sinh thì không fetch hồ sơ
      if (!selectedStudentId) {
        setIsLoading(false);
        setError('Vui lòng chọn học sinh để xem hồ sơ sức khỏe!');
        reset();
        return;
      }
      setIsLoading(true);
      HealthRecordService.getHealthRecordByStudentId(selectedStudentId, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
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
          setError('Không thể tải hồ sơ sức khỏe của học sinh!');
          reset();
        });
    } else if (studentId) {
      HealthRecordService.getHealthRecordByStudentId(studentId, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => {
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
    } else {
      setError('Không tìm thấy thông tin học sinh!');
      setIsLoading(false);
    }
  }, [
    reset,
    isNurseOrAdmin,
    isParent,
    studentId,
    accessToken,
    formSubmitted,
    fetchAllHealthRecords,
    fetchAllClasses,
    selectedStudentId
  ]);

  // Xử lý submit cho học sinh/phụ huynh
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      let idToUpdate = studentId;
      if (isParent) {
        idToUpdate = selectedStudentId;
      }
      await HealthRecordService.updateHealthRecord(
        idToUpdate,
        data,
        {   headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setUpdateSuccess(true);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 1500);
    } catch (err) {
      setError('Có lỗi xảy ra khi lưu hồ sơ. Vui lòng thử lại sau.');
    }
    setIsLoading(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchFullName || searchClassName) {
      fetchFilteredHealthRecords({ fullName: searchFullName, className: searchClassName });
    } else {
      fetchAllHealthRecords();
    }
  };

  const handleClearSearch = () => {
    setSearchFullName('');
    setSearchClassName('');
    fetchAllHealthRecords();
  };

  if (isLoading && (!isNurseOrAdmin || (isNurseOrAdmin && healthRecords.length === 0 && !error))) {
    return <div>Đang tải...</div>;
  }
  return (
    <div className="health-record-page">
      <Header />
      <div className="container">
        <h1 className="page-title">
          {isNurseOrAdmin
            ? 'Danh Sách Hồ Sơ Sức Khỏe Học Sinh'
            : isParent
              ? 'Hồ Sơ Sức Khỏe '
              : 'Hồ Sơ Sức Khỏe Học Sinh'}
        </h1>
        {error && <div className="text-danger mb-2">{error}</div>}

        {/* Y tá/admin xem danh sách */}
        {isNurseOrAdmin ? (
          <>
            <div className="search-form-container">
              <form onSubmit={handleSearchSubmit} className="health-record-search-form">
                <div className="form-group">
                  <label htmlFor="searchFullName">Tìm theo tên học sinh:</label>
                  <input
                    type="text"
                    id="searchFullName"
                    value={searchFullName}
                    onChange={(e) => setSearchFullName(e.target.value)}
                    placeholder="Nhập tên học sinh"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="searchClassName">Chọn lớp:</label>
                  <select
                    id="searchClassName"
                    value={searchClassName}
                    onChange={(e) => setSearchClassName(e.target.value)}
                  >
                    <option value="">Tất cả các lớp</option>
                    {availableClasses.map(className => (
                      <option key={className} value={className}>
                        {className}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="search-buttons">
                  <button type="submit" className="search-btn">
                    <Search size={16} />
                    Tìm kiếm
                  </button>
                  {(searchFullName || searchClassName) && (
                    <button type="button" className="clear-search-btn" onClick={handleClearSearch}>
                      <XCircle size={16} />
                      Xóa tìm kiếm
                    </button>
                  )}
                </div>
              </form>
            </div>

            {isLoading ? (
              <div>Đang tải...</div>
            ) : (healthRecords.length === 0 && (searchFullName || searchClassName)) ? (
              <div className="no-results">Không tìm thấy hồ sơ sức khỏe nào phù hợp với điều kiện tìm kiếm.</div>
            ) : healthRecords.length === 0 ? (
              <div className="no-results">Chưa có hồ sơ sức khỏe nào trong hệ thống.</div>
            ) : (
              <table className="table health-record-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ và tên</th>
                    <th>Lớp</th>
                    <th>Giới tính</th>
                    <th>Dị ứng</th>
                    <th>Bệnh mãn tính</th>
                    <th>Lịch sử điều trị</th>
                    <th>Thị lực</th>
                    <th>Thính lực</th>
                    <th>Nhóm máu</th>
                    <th>Cân nặng (kg)</th>
                    <th>Chiều cao (cm)</th>
                    <th>Ghi chú</th>
                    <th>Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {healthRecords.map((record, idx) => (
                    <tr key={record.profileId || idx}>
                      <td>{idx + 1}</td>
                      <td>{record.studentName}</td>
                      <td>{record.studentClass}</td>
                      <td>{record.studentGender}</td>
                      <td>{record.allergies}</td>
                      <td>{record.chronicDiseases}</td>
                      <td>{record.treatmentHistory}</td>
                      <td>{record.eyesight}</td>
                      <td>{record.hearing}</td>
                      <td>{record.bloodType}</td>
                      <td>{record.weight}</td>
                      <td>{record.height}</td>
                      <td>{record.notes}</td>
                      <td>
                        {/* Có thể thêm nút cập nhật ở đây nếu muốn */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        ) : isParent ? (
          <>
            {/* Không còn dropdown chọn học sinh ở đây nữa */}
            {selectedStudentId ? (
              <>
                {formSubmitted && (
                  <div className="success-message">
                    <h2>Thông tin đã được gửi thành công!</h2>
                  </div>
                )}
                {updateSuccess && (
                  <div className="success-message">
                    <h2>Cập nhật hồ sơ thành công!</h2>
                  </div>
                )}
                <form onSubmit={handleSubmit(onSubmit)} className="health-record-form">
                  <div className="form-container">
                    <div className="student-info-column">
                      <div className="info-card">
                        <h3>Thông tin học sinh</h3>
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
                      </div>
                    </div>

                    <div className="health-info-column">
                      <div className="info-card">
                        <h3>Thông tin sức khỏe</h3>
                        <div className="health-info-grid">
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
                        </div>
                        <div className="form-group notes-section">
                          <label>Ghi chú</label>
                          <textarea className="form-control" {...register("notes")} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                      {isLoading ? 'Đang lưu...' : 'Cập nhật hồ sơ'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-danger mb-2">
                Vui lòng chọn học sinh ở trang chính để xem hồ sơ sức khỏe!
              </div>
            )}
          </>
        ) : (
          // Phụ huynh xem và cập nhật hồ sơ của con mình
          <>
            {formSubmitted && (
              <div className="success-message">
                <h2>Thông tin đã được gửi thành công!</h2>
              </div>
            )}
            {updateSuccess && (
              <div className="success-message">
                <h2>Cập nhật hồ sơ thành công!</h2>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="health-record-form">
              <div className="form-container">
                <div className="student-info-card">
                  <div className="info-card">
                    <h3>Thông tin học sinh</h3>
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
                  </div>
                </div>

                <div className="health-info-column">
                  <div className="info-card">
                    <h3>Thông tin sức khỏe</h3>
                    <div className="health-info-grid">
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
                    </div>
                    <div className="form-group notes-section">
                      <label>Ghi chú</label>
                      <textarea className="form-control" {...register("notes")} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Đang lưu...' : 'Cập nhật hồ sơ'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default HealthRecord;