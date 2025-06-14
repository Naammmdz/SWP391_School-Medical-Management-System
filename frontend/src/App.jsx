import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home/homePage/HomePage';
import Login from './pages/auth/login/Login';
import Header from './components/Header';
import Footer from './components/Footer';

import MedicalEvents from './pages/medical/MedicalEvent/MedicalEvents';
import MedicineDeclarations from './pages/health/MedicineDeclaration/MedicineDeclarations';
import Pharmaceutical from './pages/medical/Pharmaceutical/Pharmaceutical'; 
import VaccinationManagement from './pages/health/Vaccination/VaccinationManagement';
import VaccinationNotifications from './pages/health/Vaccination/VaccinationNotifications';
import Admin from './pages/admin/Admin';
import MedicalSupplies from './pages/medical/MedicalSupplies/MedicalSupplies';
import NursePrescription from './pages/nurse/NursePrescription';
import HealthRecord from './pages/health/HealthRecord/HealthRecord';
import DashboardPage from './pages/dashboardPage/DashboardPage';
import HealthCheck from './pages/health/HealthCheck/HealthCheck';
import ParentPages from './pages/parent/ParentPages';
import NursePages from './pages/nurse/NursePages';
import Blog from './pages/home/Blog/Blog';
import UpdateUser from './pages/user/UpdateUser';
import UpdatePassword from './pages/user/UpdatePassword';
import CreateStudent from './pages/student/CreateStudent';
import CreateUser from './pages/user/CreateUser';
import UpdateUserByAdmin from './pages/user/UpdateUserByAdmin';
import UserList from './pages/user/UserList';
import BlockUser from './pages/user/BlockUser';
import StudentList from './pages/student/StudentList';
import UpdateStudent from './pages/student/UpdateStudent';

// Component ProtectedRoute
const ProtectedRoute = ({ element, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!user && !!localStorage.getItem('token');
  const hasRequiredRole = user && user.userRole === requiredRole;

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
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hososuckhoe" element={<HealthRecord />} />
        <Route path="/sukienyte" element={<MedicalEvents/>}/>
        <Route path="/khaibaothuoc" element={<MedicineDeclarations/>}/>
        <Route path="/quanlythuoc" element={<Pharmaceutical/>}/>
        <Route path="/quanlytiemchung" element={<VaccinationManagement/>}/>
        <Route path="/thongbaotiemchung" element={<VaccinationNotifications/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/donthuoc" element={<NursePrescription/>}/>
        <Route path="/thongke" element={<DashboardPage/>}/>
        <Route path="/kiemtradinhky" element={<HealthCheck/>}/>
        <Route path="/capnhatthongtin" element={<UpdateUser/>}/>
        <Route path="/doimatkhau" element={<UpdatePassword/>}/>
        <Route path="/taomoihocsinh" element={<CreateStudent/>}/>
        <Route path="/taomoinguoidung" element={<CreateUser/>}/>
        <Route path="/capnhatnguoidung/:userId" element={<UpdateUserByAdmin/>}/>
        <Route path="/danhsachnguoidung" element={<UserList/>}/>
        <Route path="/khoanguoidung/:userId" element={<BlockUser />} />
        <Route path="/danhsachhocsinh" element={<StudentList/>}/>
        <Route path="/capnhathocsinh/:studentId" element={<UpdateStudent/>}/>


        <Route path="/parent" element={<ProtectedRoute element={<ParentPages/>} requiredRole="ROLE_PARENT" />} />
        <Route path="/nurse" element={<ProtectedRoute element={<NursePages/>} requiredRole="ROLE_NURSE" />} />
        <Route path='/admin' element={<ProtectedRoute element={<Admin/>} requiredRole="ROLE_ADMIN" />} />
      

        <Route path='/blog' element={<Blog/>}/>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
