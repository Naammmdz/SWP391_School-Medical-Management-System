import React, { useState } from 'react';
import './HealthCheck.css';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../components/ui/select';

const HealthCheck = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [healthData, setHealthData] = useState({
    height: '',
    weight: '',
    bmi: '',
    vision: '',
    hearing: '',
    bloodPressure: '',
    heartRate: '',
    notes: '',
    recommendations: ''
  });

  // Mock data - replace with API call
  const students = [
    { id: 1, name: 'Nguyễn Văn A', class: '10A1', dob: '2008-05-15' },
    { id: 2, name: 'Trần Thị B', class: '10A1', dob: '2008-08-20' },
    // Add more mock data as needed
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    // Here you would typically fetch the student's health records
    // For now using mock data
    setHealthData({
      height: '170',
      weight: '55',
      bmi: '19.03',
      vision: '10/10',
      hearing: 'Bình thường',
      bloodPressure: '120/80',
      heartRate: '75',
      notes: 'Sức khỏe tốt',
      recommendations: 'Duy trì chế độ ăn uống và tập luyện hiện tại'
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHealthData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBMI = () => {
    const height = parseFloat(healthData.height) / 100; // Convert cm to m
    const weight = parseFloat(healthData.weight);
    if (height && weight) {
      const bmi = (weight / (height * height)).toFixed(2);
      setHealthData(prev => ({
        ...prev,
        bmi
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Submitting health check data:', {
      studentId: selectedStudent?.id,
      ...healthData
    });
    alert('Đã lưu kết quả kiểm tra sức khỏe!');
  };

  return (
    <div className="health-check-container">
      <div className="search-section">
        <h2>Kiểm tra sức khỏe định kỳ</h2>
        <div className="search-box">
          <Input
            type="text"
            placeholder="Tìm kiếm học sinh theo tên hoặc lớp..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="student-list">
          {students
            .filter(student => 
              student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              student.class.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(student => (
              <div
                key={student.id}
                className={`student-item ${selectedStudent?.id === student.id ? 'selected' : ''}`}
                onClick={() => handleStudentSelect(student)}
              >
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <p>Lớp: {student.class}</p>
                  <p>Ngày sinh: {student.dob}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {selectedStudent && (
        <div className="health-check-form">
          <h3>Kết quả kiểm tra sức khỏe - {selectedStudent.name}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Chiều cao (cm)</label>
                <Input
                  type="number"
                  name="height"
                  value={healthData.height}
                  onChange={handleInputChange}
                  onBlur={calculateBMI}
                />
              </div>

              <div className="form-group">
                <label>Cân nặng (kg)</label>
                <Input
                  type="number"
                  name="weight"
                  value={healthData.weight}
                  onChange={handleInputChange}
                  onBlur={calculateBMI}
                />
              </div>

              <div className="form-group">
                <label>BMI</label>
                <Input
                  type="text"
                  value={healthData.bmi}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Thị lực</label>
                <Select
                  value={healthData.vision}
                  onValueChange={(value) => setHealthData(prev => ({ ...prev, vision: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thị lực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10/10">10/10</SelectItem>
                    <SelectItem value="9/10">9/10</SelectItem>
                    <SelectItem value="8/10">8/10</SelectItem>
                    <SelectItem value="7/10">7/10</SelectItem>
                    <SelectItem value="6/10">6/10</SelectItem>
                    <SelectItem value="5/10">5/10</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <label>Thính lực</label>
                <Select
                  value={healthData.hearing}
                  onValueChange={(value) => setHealthData(prev => ({ ...prev, hearing: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn thính lực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bình thường">Bình thường</SelectItem>
                    <SelectItem value="Giảm nhẹ">Giảm nhẹ</SelectItem>
                    <SelectItem value="Giảm trung bình">Giảm trung bình</SelectItem>
                    <SelectItem value="Giảm nặng">Giảm nặng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="form-group">
                <label>Huyết áp</label>
                <Input
                  type="text"
                  name="bloodPressure"
                  value={healthData.bloodPressure}
                  onChange={handleInputChange}
                  placeholder="VD: 120/80"
                />
              </div>

              <div className="form-group">
                <label>Nhịp tim (bpm)</label>
                <Input
                  type="number"
                  name="heartRate"
                  value={healthData.heartRate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Ghi chú</label>
              <Textarea
                name="notes"
                value={healthData.notes}
                onChange={handleInputChange}
                placeholder="Nhập ghi chú về tình trạng sức khỏe..."
              />
            </div>

            <div className="form-group full-width">
              <label>Khuyến nghị</label>
              <Textarea
                name="recommendations"
                value={healthData.recommendations}
                onChange={handleInputChange}
                placeholder="Nhập khuyến nghị cho học sinh..."
              />
            </div>

            <div className="form-actions">
              <Button type="submit" variant="primary">
                Lưu kết quả
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default HealthCheck;
