import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home/homePage/HomePage';
import Login from './pages/auth/login/Login';
import Layout from './components/Layout';

import MedicalEvents from './pages/medical/MedicalEvent/MedicalEvents';
import MedicineDeclarations from './pages/health/MedicineDeclaration/MedicineDeclarations';
import MedicineList from './pages/health/MedicineDeclaration/MedicineList';
import MedicalEventList from './pages/medical/MedicalEvent/MedicalEventList';
import MedicalEventStudent from './pages/medical/MedicalEvent/MedicalEventStudent';
import MedicineLog from './pages/health/MedicineDeclaration/MedicineLog';
import Pharmaceutical from './pages/medical/Pharmaceutical/Pharmaceutical'; 

import CreateVaccinationCampaign from './pages/health/Vaccination/CreateVaccinationCampaign';
import VaccinationManagement from './pages/health/Vaccination/VaccinationManagement';
import VaccinationNotifications from './pages/health/Vaccination/VaccinationNotifications';
import UpdateVaccination from './pages/health/Vaccination/UpdateVaccination';
import VaccinationResult from './pages/health/Vaccination/VaccinationResult';
import VaccinationStudentResult from './pages/health/Vaccination/VaccinationStudentResult';

import Admin from './pages/admin/Admin';
import MedicalSupplies from './pages/medical/MedicalSupplies/MedicalSupplies';
import NursePrescription from './pages/nurse/NursePrescription';
import HealthRecord from './pages/health/HealthRecord/HealthRecord';
import DashboardPage from './pages/dashboardPage/DashboardPage';

import { ParentMainPage } from './pages/parent';
import NursePages from './pages/nurse/NursePages';
import Blog from './pages/home/Blog/Blog';
import UpdateUser from './pages/user/UpdateUser';
import UpdatePassword from './pages/user/UpdatePassword';
import CreateStudent from './pages/student/CreateStudent';
import CreateUser from './pages/user/CreateUser';
import UpdateUserByAdmin from './pages/user/UpdateUserByAdmin';
import UserList from './pages/user/UserList';
import BlockUser from './pages/user/BlockUser';

import UpdateStudent from './pages/student/UpdateStudent';
import StudentList from './pages/student/StudentList';

import HealthCheckList from './pages/health/HealthCheck/HealthCheckList';
import UpdateHealthCheck from './pages/health/HealthCheck/UpdateHealthCheck';
import HealthCheck from './pages/health/HealthCheck/HealthCheck';
import CreateHealthCheck from './pages/health/HealthCheck/CreateHealthCheck';

import HealthCheckResult from './pages/health/HealthCheck/HealthCheckResult';
import HealthCheckResultStudent from './pages/health/HealthCheck/HealthCheckResultStudent';
import UpdateHealthCheckResult from './pages/health/HealthCheck/UpdateHealthCheckResult';
import ImportInventory from './pages/medical/Inventory/ImportInventory';
import InventoryList from './pages/medical/Inventory/InventoryList';

import ParentPages from './pages/parent/ParentPages';
import PrincipalDashboard from './pages/principal/dashboard/PrincipalDashboard';

// Component ProtectedRoute
const ProtectedRoute = ({ element, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!user && !!localStorage.getItem('token');
  // Hỗ trợ requiredRole là string hoặc mảng
  const hasRequiredRole = Array.isArray(requiredRole)
    ? requiredRole.includes(user?.userRole)
    : user && user.userRole === requiredRole;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return element;
};

function App() {
  return (
    <Routes>
      {/* Public routes - không cần sidebar */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path='/blog' element={<Layout><Blog /></Layout>} />

      {/* Protected routes - có sidebar */}
      <Route path="/hososuckhoe" element={<Layout showSidebar><HealthRecord /></Layout>} />
      <Route path="/sukienyte" element={<ProtectedRoute element={<Layout showSidebar><MedicalEvents /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PRINCIPAL']} />} />
      <Route path="/danhsachsukienyte" element={<Layout showSidebar><MedicalEventList /></Layout>} />
      <Route path="/sukienytehocsinh" element={<Layout showSidebar><MedicalEventStudent /></Layout>} />
      <Route path="/khaibaothuoc" element={<Layout showSidebar><MedicineDeclarations /></Layout>} />
      <Route path="/donthuocdagui" element={<Layout showSidebar><MedicineList /></Layout>} />
      <Route path="/quanlythuoc" element={<Layout showSidebar><Pharmaceutical /></Layout>} />

      {/* Parent routes - sử dụng UI riêng, không có sidebar */}
      <Route path="/parent" element={<ProtectedRoute element={<Layout><ParentMainPage /></Layout>} requiredRole="ROLE_PARENT" />} />

      
      {/* Parent-specific routes without sidebar */}
      <Route path="/parent/hososuckhoe" element={<ProtectedRoute element={<Layout><HealthRecord /></Layout>} requiredRole="ROLE_PARENT" />} />
      <Route path="/parent/khaibaothuoc" element={<ProtectedRoute element={<Layout><MedicineDeclarations /></Layout>} requiredRole="ROLE_PARENT" />} />
      <Route path="/parent/sukienytehocsinh" element={<ProtectedRoute element={<Layout><MedicalEventStudent /></Layout>} requiredRole="ROLE_PARENT" />} />
      <Route path="/parent/donthuocdagui" element={<ProtectedRoute element={<Layout><MedicineList /></Layout>} requiredRole="ROLE_PARENT" />} />
      <Route path="/parent/thongbaotiemchung" element={<ProtectedRoute element={<Layout><VaccinationNotifications /></Layout>} requiredRole="ROLE_PARENT" />} />
      <Route path="/parent/ketquakiemtradinhkyhocsinh" element={<ProtectedRoute element={<Layout><HealthCheckResultStudent /></Layout>} requiredRole="ROLE_PARENT" />} />
      <Route path="/parent/ketquatiemchunghocsinh" element={<ProtectedRoute element={<Layout><VaccinationStudentResult /></Layout>} requiredRole="ROLE_PARENT" />} />
      <Route path="/parent/kiemtradinhkyhocsinh" element={<ProtectedRoute element={<Layout><HealthCheck /></Layout>} requiredRole="ROLE_PARENT" />} />

      {/* Protected routes - có sidebar (Admin/Nurse only) */}
    
      <Route path="/quanlytiemchung" element={<ProtectedRoute element={<Layout showSidebar><VaccinationManagement /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PRINCIPAL']} />} />
      {/* <Route path="/thongbaotiemchung" element={<ProtectedRoute element={<Layout showSidebar><VaccinationNotifications /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE']} />} /> */}
      <Route path="/taosukientiemchung" element={<ProtectedRoute element={<Layout showSidebar><CreateVaccinationCampaign /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE']} />} />
      <Route path="/capnhatthongtintiemchung" element={<ProtectedRoute element={<Layout showSidebar><UpdateVaccination /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE']} />} />
      <Route path="/capnhattiemchung" element={<ProtectedRoute element={<Layout showSidebar><UpdateVaccination /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE']} />} />
      <Route path="/ketquatiemchung" element={<ProtectedRoute element={<Layout showSidebar><VaccinationResult /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PRINCIPAL']} />} />
      <Route path="/ketquatiemchunghocsinh" element={<ProtectedRoute element={<Layout showSidebar><VaccinationStudentResult /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PRINCIPAL']} />} />
      
      <Route path="/donthuoc" element={<ProtectedRoute element={<Layout showSidebar><NursePrescription /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PRINCIPAL']} />} />
      <Route path="/chouongthuoc" element={<ProtectedRoute element={<Layout showSidebar><MedicineLog /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PRINCIPAL']} />} />
      <Route path="/thongke" element={<ProtectedRoute element={<Layout showSidebar><DashboardPage /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PRINCIPAL']} />} />

      <Route path="/kiemtradinhky" element={<ProtectedRoute element={<Layout showSidebar><CreateHealthCheck /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE']} />} />
      <Route path="/danhsachkiemtradinhky" element={<ProtectedRoute element={<Layout showSidebar><HealthCheckList /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PRINCIPAL']} />} />
      <Route path="/capnhatkiemtradinhky" element={<ProtectedRoute element={<Layout showSidebar><UpdateHealthCheck /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE']} />} />
      <Route path="/kiemtradinhkyhocsinh" element={<ProtectedRoute element={<Layout showSidebar><HealthCheck /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE']} />} />
      <Route path="/ketquakiemtradinhky" element={<ProtectedRoute element={<Layout showSidebar><HealthCheckResult /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PRINCIPAL']} />} />
      <Route path="/ketquakiemtradinhkyhocsinh" element={<ProtectedRoute element={<Layout showSidebar><HealthCheckResultStudent /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE']} />} />
      <Route path="/capnhatketquakiemtra" element={<ProtectedRoute element={<Layout showSidebar><UpdateHealthCheckResult /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE']} />} />

      <Route path="/capnhatthongtin" element={<ProtectedRoute element={<Layout showSidebar><UpdateUser /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PRINCIPAL']} />} />
      <Route path="/doimatkhau" element={<ProtectedRoute element={<Layout showSidebar><UpdatePassword /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PRINCIPAL']} />} />
      <Route path="/taomoinguoidung" element={<ProtectedRoute element={<Layout showSidebar><CreateUser /></Layout>} requiredRole="ROLE_ADMIN" />} />
      <Route path="/capnhatnguoidung/:userId" element={<ProtectedRoute element={<Layout showSidebar><UpdateUserByAdmin /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_PRINCIPAL']} />} />
      <Route path="/danhsachnguoidung" element={<ProtectedRoute element={<Layout showSidebar><UserList /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_PRINCIPAL']} />} />
      <Route path="/khoanguoidung/:userId" element={<ProtectedRoute element={<Layout showSidebar><BlockUser /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_PRINCIPAL']} />} />
      
      <Route path="/taomoihocsinh" element={<ProtectedRoute element={<Layout showSidebar><CreateStudent /></Layout>} requiredRole="ROLE_ADMIN" />} />
      <Route path="/danhsachhocsinh" element={<ProtectedRoute element={<Layout showSidebar><StudentList /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PRINCIPAL']} />} />
      <Route path="/capnhathocsinh/:studentId" element={<ProtectedRoute element={<Layout showSidebar><UpdateStudent /></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_PRINCIPAL']} />} />

      <Route path="/themvattu" element={<ProtectedRoute element={<Layout showSidebar><ImportInventory/> </Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE']} />} />
      <Route path="/quanlyvattuyte" element={<ProtectedRoute element={<Layout showSidebar><Pharmaceutical/></Layout>} requiredRole={['ROLE_ADMIN', 'ROLE_NURSE', 'ROLE_PRINCIPAL']} />} />
      
     
      
      <Route path="/nurse" element={<ProtectedRoute element={<Layout showSidebar><NursePages /></Layout>} requiredRole="ROLE_NURSE" />} />
      <Route path='/admin' element={<ProtectedRoute element={<Layout showSidebar><Admin /></Layout>} requiredRole="ROLE_ADMIN" />} />
      <Route path="/parent" element={<ProtectedRoute element={<Layout showSidebar><ParentPages /></Layout>} requiredRole="ROLE_PARENT" />} />
      <Route path="/principal" element={<ProtectedRoute element={<Layout showSidebar><PrincipalDashboard /></Layout>} requiredRole="ROLE_PRINCIPAL" />} />
      
      {/* Default route */}
    </Routes>
  );
}

export default App;