import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { useEffect } from "react";

const baseUrl = "http://localhost:5000";

const HomePage = () => {
  const [inputJmbgPatient, setInputJmbgPatient] = useState("");
  const [patientList, setPatientList] = useState([]);
  const [inputJmbg, setInputJmbg] = useState("");
  const [dentistList, setDentistList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${baseUrl}/dentists`);
      const { Dentists } = response.data;
      setDentistList(Dentists);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`${baseUrl}/patients`);
      const { Patients } = response.data;
      setPatientList(Patients);
    };
    fetchData();
  }, []);

  const handlePacientClick = () => {
    navigate("/pacijent");
  };

  const matchCheck = () => {
    const result = dentistList.filter((dentist) => {
      return dentist.jmbg.toString() === inputJmbg.toString();
    });

    if (result.length === 0) {
      alert("Dentist with this jmbg doesn't exist!");
      return false;
    }
    return true;
  };

  const handleDentistClick = () => {
    const dentistExists = matchCheck();
    if (dentistExists) {
      navigate("/zubar");
    }
  };

  const matchCheckPatients = () => {
    const result = patientList.filter((patient) => {
      return patient.jmbg.toString() === inputJmbgPatient.toString();
    });

    if (result.length === 0) {
      alert("Patient with this jmbg doesn't exist!");
      return false;
    }
    return true;
  };

  const handleExistPacientClick = () => {
    const patientExists = matchCheckPatients();
    if (patientExists) {
      navigate(`/pacijent/${inputJmbgPatient}`, {
        state: { jmbg: inputJmbgPatient },
      });
    }
  };

  return (
    <div className="container">
      <h1>Dobrodošli u zubarsku ordinaciju</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputJmbgPatient}
          onChange={(e) => setInputJmbgPatient(e.target.value)}
          placeholder="Unesite jmbg ako ste zakazani"
        />
        <button onClick={handleExistPacientClick}>Zakazani pacijent</button>
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputJmbg}
          onChange={(e) => setInputJmbg(e.target.value)}
          placeholder="Unesite jmbg zubara"
        />
        <button onClick={handleDentistClick}>Zubar</button>
      </div>
      <button className="new-patient-button" onClick={handlePacientClick}>
        Novi Pacijent
      </button>
    </div>
  );
};

export default HomePage;
