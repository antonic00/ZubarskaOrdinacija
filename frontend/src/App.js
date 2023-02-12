import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DentistPage from './components/dentistPage/dentistPage';
import HomePage from './components/home/home';
import NavBar from './components/navBar/navBar';
import PatientPage from './components/patientPage/patientPage';
import ExistsPatient from './components/existsPatient/existsPatient';


const App = () => {
  return (
    
    <BrowserRouter>
    <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />}/> 
        <Route path="/pacijent" element={<PatientPage />} />
        <Route path="/zubar" element={<DentistPage />} />
        <Route path="/pacijent/:jmbg" element={<ExistsPatient />} />
      </Routes>      
    </BrowserRouter>
  );
};

export default App;
