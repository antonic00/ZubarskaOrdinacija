import React from 'react'
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppointmentsCalendar from '../calendar/calendar';
import "./DentistPage.css"


const baseUrl="http://localhost:5000"

const DentistPage = () => {

    const [patientList, setPatientList] = useState([]);
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate("/pacijent")
    }

    const handleDelete = async (patient) => {
        await axios.delete(`${baseUrl}/patients/${patient.jmbg}`);
        const filteredPatients = patientList.filter(p => p.jmbg !== patient.jmbg);
        setPatientList(filteredPatients);
    }


    useEffect(() => {
        const fetchData = async () => {
          const response = await axios.get(`${baseUrl}/patients`);
          const {Patients} = response.data;
          setPatientList(Patients);
        };
        fetchData();
      }, []);


  return (
    <div>
        <div>
        <h1>Zubar</h1>
            <AppointmentsCalendar />
        </div>
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
            {patientList.map((patient, index) => (
                <tr key={index}>
                    <td>{patient.name}</td>
                    <td>{patient.lastname}</td>
                    <td>{patient.appointment_time}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.email}</td>
                    <td>{patient.typeterms}</td>
                    <td>{patient.appointment_duration}</td>
                    <td><button onClick={() => handleDelete(patient)}>Otkazi</button></td>
                </tr>
            ))}
        </tbody>
    </table>
    <div><button onClick={handleSubmit} className='appointment_button'>Zakazi pregled</button></div>
    </div>
    

  )
}

export default DentistPage