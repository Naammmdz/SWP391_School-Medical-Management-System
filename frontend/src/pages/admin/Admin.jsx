import React from 'react';
import { Users, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import DashboardPage from '../dashboardPage/DashboardPage';

const Admin = () => {
  const navigate = useNavigate();

  // Navigation functions
  const navigateToUserManagement = () => {
    navigate('/danhsachnguoidung');
  };

  const navigateToStudentManagement = () => {
    navigate('/danhsachhocsinh');
  };

  return (
    <>
      <DashboardPage />
      <div className="admin-page">
        <div className="admin-header">
          <h1>Quản lý hệ thống</h1>
        </div>
        
        <div className="management-sections">
          <div className="management-card" onClick={navigateToUserManagement}>
            <div className="card-icon">
              <Users size={32} />
            </div>
            <div className="card-content">
              <h2>Quản lý người dùng</h2>
              <p>Quản lý thông tin người dùng, phân quyền và trạng thái hoạt động</p>
            </div>
          </div>

          <div className="management-card" onClick={navigateToStudentManagement}>
            <div className="card-icon">
              <GraduationCap size={32} />
            </div>
            <div className="card-content">
              <h2>Quản lý học sinh</h2>
              <p>Quản lý thông tin học sinh, lớp học và phụ huynh</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;