import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/home/homePage/HomePage';
import Login from './pages/auth/login/Login';
import Header from './components/Header';
import Footer from './components/Footer';

import MedicalEvents from './pages/medical/MedicalEvent/MedicalEvents';
import MedicineDeclarations from './pages/health/MedicineDeclaration/MedicineDeclarations';
import Pharmaceutical from './pages/medical/Pharmaceutical/Pharmaceutical'; 

import CreateVaccinationCampaign from './pages/health/Vaccination/CreateVaccinationCampaign';
import VaccinationManagement from './pages/health/Vaccination/VaccinationManagement';
import VaccinationNotifications from './pages/health/Vaccination/VaccinationNotifications';

import Admin from './pages/admin/Admin';
import MedicalSupplies from './pages/medical/MedicalSupplies/MedicalSupplies';
import NursePrescription from './pages/nurse/NursePrescription';
import HealthRecord from './pages/health/HealthRecord/HealthRecord';
import DashboardPage from './pages/dashboardPage/DashboardPage';

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

import UpdateStudent from './pages/student/UpdateStudent';
import StudentList from './pages/student/StudentList';

import HealthCheckList from './pages/health/HealthCheck/HealthCheckList';
import UpdateHealthCheck from './pages/health/HealthCheck/UpdateHealthCheck';
import HealthCheck from './pages/health/HealthCheck/HealthCheck';
import CreateHealthCheck from './pages/health/HealthCheck/CreateHealthCheck';


import HealthCheckResult from './pages/health/HealthCheck/HealthCheckResult';
import HealthCheckResultStudent from './pages/health/HealthCheck/HealthCheckResultStudent';
import UpdateHealthCheckResult from './pages/health/HealthCheck/UpdateHealthCheckResult';
import UpdateVaccination from './pages/health/Vaccination/UpdateVaccination';
import VaccinationResult from './pages/health/Vaccination/VaccinationResult';
import VaccinationStudentResult from './pages/health/Vaccination/VaccinationStudentResult';
import MedicineList from './pages/health/MedicineDeclaration/MedicineList';
import MedicineLog from './pages/health/MedicineDeclaration/MedicineLog';

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
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/hososuckhoe" element={<HealthRecord />} />
        <Route path="/sukienyte" element={<MedicalEvents/>}/>

        <Route path="/khaibaothuoc" element={<MedicineDeclarations/>}/>
        <Route path="/donthuoc" element={<NursePrescription/>}/>
        <Route path="/donthuocdagui" element={<MedicineList/>}/>
        <Route path="/chouongthuoc" element={<MedicineLog/>}/>


        <Route path="/quanlythuoc" element={<Pharmaceutical/>}/>

        
        <Route path="/quanlytiemchung" element={<VaccinationManagement/>}/>
        <Route path="/thongbaotiemchung" element={<VaccinationNotifications/>}/>
        <Route path ="/taosukientiemchung" element={<CreateVaccinationCampaign/>} />
        <Route path="/capnhatthongtintiemchung" element={<UpdateVaccination/>} />
        <Route path= "/ketquatiemchung" element={<VaccinationResult/>} />
        <Route path ="/ketquatiemchunghocsinh" element= {<VaccinationStudentResult/>} />

        <Route path="/login" element={<Login />} />

        


        <Route path="/thongke" element={<DashboardPage/>}/>

        <Route path="/kiemtradinhky" element={<CreateHealthCheck/>}/>
        <Route path="/danhsachkiemtradinhky" element={<HealthCheckList />} />
        <Route path="/capnhatkiemtradinhky" element={<UpdateHealthCheck />} />
        <Route path="/kiemtradinhkyhocsinh" element={<HealthCheck />} />
        <Route path="/ketquakiemtradinhky" element={<HealthCheckResult />} />
        <Route path="/ketquakiemtradinhkyhocsinh" element={<HealthCheckResultStudent />} />
        <Route path ="/capnhatketquakiemtra" element={<UpdateHealthCheckResult/>} />

        <Route path="/capnhatthongtin" element={<UpdateUser/>}/>
        <Route path="/doimatkhau" element={<UpdatePassword/>}/>
        <Route path="/admin/taomoinguoidung" element={<CreateUser/>} requiredRole="ROLE_ADMIN" />
        <Route path="/admin/capnhatnguoidung/:userId" element={<UpdateUserByAdmin/>} requiredRole="ROLE_ADMIN" />
        <Route path="/admin/danhsachnguoidung" element={<UserList/>} />
        <Route path="/admin/khoanguoidung/:userId" element={<BlockUser />} requiredRole="ROLE_ADMIN" />
         
        
      
        <Route path="/taomoihocsinh" element={<CreateStudent/>} requiredRole="ROLE_ADMIN" />
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