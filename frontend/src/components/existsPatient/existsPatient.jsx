import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const baseUrl = 'http://localhost:5000';

const ExistsPatient = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [patient, setPatient] = useState({});
  const [error, setError] = useState(null);
  
  const jmbg = location.state.jmbg;
  console.log(jmbg) 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/patients/${jmbg}`);
      
        setPatient(response.data.Patients[0]);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [jmbg]);

  if (error) {
    return (
      <div>
        <p>Došlo je do greške pri učitavanju podataka o pacijentu.</p>
      </div>
    );
  }

  const handleDelete = async (jmbg) => {
    await axios.delete(`${baseUrl}/patients/${jmbg}`);
    setPatient({});
    navigate("/")
  };
  
  return (
    <table>
      <thead>
        <tr>
          <th>Ime</th>
          <th>Prezime</th>
          <th>Vreme</th>
          <th>Telefon</th>
          <th>Email</th>
          <th>Tip pregleda</th>
          <th>Trajanje pregleda</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {patient && (
          <tr>
            <td>{patient.name}</td>
            <td>{patient.lastname}</td>
            <td>{patient.appointment_time}</td>
            <td>{patient.phone}</td>
            <td>{patient.email}</td>
            <td>{patient.typeterms}</td>
            <td>{patient.appointment_duration}</td>
            <td>
              <button onClick={() => handleDelete(patient.jmbg)}>Otkazi</button>
            </td>
          </tr>
        )}
      </tbody>
    </table>
   
  );
};

export default ExistsPatient;
