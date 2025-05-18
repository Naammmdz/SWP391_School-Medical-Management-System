import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homePage/HomePage';
import Login from './login/Login';
import Header from './components/Header';
import Footer from './components/Footer';
import HealthRecord from './pages/parents/HealthRecord';
import MedicalEvents from './pages/nurse/MedicalEvents';
import MedicineDeclarations from './pages/parents/MedicineDeclarations';
function App() {
  return (
   
      <>
      
      <Header />
       
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hososuckhoe" element={<HealthRecord />} />
          <Route path="/sukienyte" element={<MedicalEvents/>}/>
          <Route path="/khaibaothuoc" element={<MedicineDeclarations/>}/>
          <Route path="/login" element={<Login />} />
        </Routes>
      
      <Footer />
      </>
      
  
  );
}

export default App;
