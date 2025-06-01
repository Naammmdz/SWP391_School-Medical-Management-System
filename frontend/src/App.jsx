import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        <Route path="/parent" element={<ParentPages/>}/>
        <Route path="/nurse" element={<NursePages/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/blog' element={<Blog/>}/>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
