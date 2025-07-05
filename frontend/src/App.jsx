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

// import ParentPages from './pages/parent/ParentPages';
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
      <Route path="/sukienyte" element={<Layout showSidebar><MedicalEvents /></Layout>} />
      <Route path="/danhsachsukienyte" element={<Layout showSidebar><MedicalEventList /></Layout>} />
      <Route path="/sukienytehocsinh" element={<Layout showSidebar><MedicalEventStudent /></Layout>} />
      <Route path="/khaibaothuoc" element={<Layout showSidebar><MedicineDeclarations /></Layout>} />
      <Route path="/donthuocdagui" element={<Layout showSidebar><MedicineList /></Layout>} />
      <Route path="/quanlythuoc" element={<Layout showSidebar><Pharmaceutical /></Layout>} />
      
      <Route path="/quanlytiemchung" element={<Layout showSidebar><VaccinationManagement /></Layout>} />
      <Route path="/thongbaotiemchung" element={<Layout showSidebar><VaccinationNotifications /></Layout>} />
      <Route path="/taosukientiemchung" element={<Layout showSidebar><CreateVaccinationCampaign /></Layout>} />
      <Route path="/capnhatthongtintiemchung" element={<Layout showSidebar><UpdateVaccination /></Layout>} />
      <Route path="/capnhattiemchung" element={<Layout showSidebar><UpdateVaccination /></Layout>} />
      <Route path="/ketquatiemchung" element={<Layout showSidebar><VaccinationResult /></Layout>} />
      <Route path="/ketquatiemchunghocsinh" element={<Layout showSidebar><VaccinationStudentResult /></Layout>} />
      
      <Route path="/donthuoc" element={<Layout showSidebar><NursePrescription /></Layout>} />
      <Route path="/chouongthuoc" element={<Layout showSidebar><MedicineLog /></Layout>} />
      <Route path="/thongke" element={<Layout showSidebar><DashboardPage /></Layout>} />

      <Route path="/kiemtradinhky" element={<Layout showSidebar><CreateHealthCheck /></Layout>} />
      <Route path="/danhsachkiemtradinhky" element={<Layout showSidebar><HealthCheckList /></Layout>} />
      <Route path="/capnhatkiemtradinhky" element={<Layout showSidebar><UpdateHealthCheck /></Layout>} />
      <Route path="/kiemtradinhkyhocsinh" element={<Layout showSidebar><HealthCheck /></Layout>} />
      <Route path="/ketquakiemtradinhky" element={<Layout showSidebar><HealthCheckResult /></Layout>} />
      <Route path="/ketquakiemtradinhkyhocsinh" element={<Layout showSidebar><HealthCheckResultStudent /></Layout>} />
      <Route path="/capnhatketquakiemtra" element={<Layout showSidebar><UpdateHealthCheckResult /></Layout>} />

      <Route path="/capnhatthongtin" element={<Layout showSidebar><UpdateUser /></Layout>} />
      <Route path="/doimatkhau" element={<Layout showSidebar><UpdatePassword /></Layout>} />
      <Route path="/taomoinguoidung" element={<Layout showSidebar><CreateUser /></Layout>} />
      <Route path="/capnhatnguoidung/:userId" element={<Layout showSidebar><UpdateUserByAdmin /></Layout>} />
      <Route path="/danhsachnguoidung" element={<Layout showSidebar><UserList /></Layout>} />
      <Route path="/khoanguoidung/:userId" element={<Layout showSidebar><BlockUser /></Layout>} />
      
      <Route path="/taomoihocsinh" element={<Layout showSidebar><CreateStudent /></Layout>} />
      <Route path="/danhsachhocsinh" element={<Layout showSidebar><StudentList /></Layout>} />
      <Route path="/capnhathocsinh/:studentId" element={<Layout showSidebar><UpdateStudent /></Layout>} />

      <Route path="/themvattu" element={<Layout showSidebar><ImportInventory/> </Layout>} />
      <Route path="/quanlyvattuyte" element={<Layout showSidebar><InventoryList/></Layout>} />
      
     
      
      <Route path="/nurse" element={<ProtectedRoute element={<Layout showSidebar><NursePages /></Layout>} requiredRole="ROLE_NURSE" />} />
      <Route path='/admin' element={<ProtectedRoute element={<Layout showSidebar><Admin /></Layout>} requiredRole="ROLE_ADMIN" />} />
      <Route path="/parent" element={<ProtectedRoute element={<Layout showSidebar><ParentPages /></Layout>} requiredRole="ROLE_PARENT" />} />
      
      {/* Default route */}
    </Routes>
  );
}

export default App;