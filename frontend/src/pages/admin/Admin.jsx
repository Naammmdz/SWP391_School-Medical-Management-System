import React from 'react';
import { Users, GraduationCap, Stethoscope, Syringe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';
import DashboardPage from '../dashboardPage/DashboardPage';

const Admin = () => {
  const navigate = useNavigate();

  const managementCards = [
    {
      title: "Quản lý người dùng",
      description: "Quản lý thông tin, phân quyền và trạng thái người dùng.",
      icon: <Users size={32} />,
      action: () => navigate('/admin/danhsachnguoidung'),
      className: "card-users"
    },
    {
      title: "Quản lý học sinh",
      description: "Quản lý thông tin học sinh, lớp học và phụ huynh.",
      icon: <GraduationCap size={32} />,
      action: () => navigate('/danhsachhocsinh'),
      className: "card-students"
    },
    {
      title: "Quản lý kiểm tra định kỳ",
      description: "Quản lý các đợt và kết quả kiểm tra sức khỏe định kỳ.",
      icon: <Stethoscope size={32} />,
      action: () => navigate('/danhsachkiemtradinhky'),
      className: "card-health-check"
    },
    {
      title: "Quản lý tiêm chủng",
      description: "Quản lý các chiến dịch và kết quả tiêm chủng.",
      icon: <Syringe size={32} />,
      action: () => navigate('/quanlytiemchung'),
      className: "card-vaccination"
    }
  ];

  return (
      <>
        <DashboardPage />
        <div className="admin-page" style={{marginLeft: '8.33%'}}>
          <header className="admin-header">
            <h1>Bảng điều khiển quản trị</h1>
          </header>

          <main className="management-sections">
            {managementCards.map((card, index) => (
                <div key={index} className={`management-card ${card.className}`} onClick={card.action}>
                  <div className="card-icon">
                    {card.icon}
                  </div>
                  <div className="card-content">
                    <h2>{card.title}</h2>
                    <p>{card.description}</p>
                  </div>
                </div>
            ))}
          </main>
        </div>
      </>
  );
};

export default Admin;