import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './PatientPage.css';


const baseUrl="http://localhost:5000"

const PatientPage = () => {

  const navigate = useNavigate();

  const [appointment, setAppointment] = useState({
    jmbg: "",
    name: "",
    lastname: "",
    phone: "",
    email: "",
    appointment_time : "",
    appointment_duration: "",
    typeterms: ""
  });

  const[patientList, setPatientList] = useState([]);
  
  const handleChange = e => {
    setAppointment({
      ...appointment,
      [e.target.name]: e.target.value
    });
    
    if (e.target.name === "appointment_time") {
      setAppointment({
        ...appointment,
        appointment_time: `${e.target.value.slice(0, 10)} ${e.target.value.slice(11, 16)}`
      });
    }
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    try{
      
      const response=await axios.post(`${baseUrl}/make_appointment`, appointment)
      setPatientList([...patientList, response.data]);
      
      navigate("/");
      
    }catch(err){
      console.error(err.message);
    }
};

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="jmbg">JMBG pacijenta:</label>
        <input
          type="text"
          id="jmbg"
          name="jmbg"
          value={appointment.jmbg}
          onChange={handleChange}
          required
          placeholder="Unesite svoj jmbg (13 cifara)"
        />
      </div>
      <div>
        <label htmlFor="name">Ime pacijenta:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={appointment.name}
          onChange={handleChange}
          required
          placeholder="Unesite ime"
        />
      </div>
      <div>
        <label htmlFor="lastname">Prezime pacijenta:</label>
        <input
          type="text"
          id="lastname"
          name="lastname"
          value={appointment.lastname}
          onChange={handleChange}
          required
          placeholder="Unesite prezime"
        />
      </div>
      <div>
        <label htmlFor="phone">Kontakt pacijenta:</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={appointment.phone}
          onChange={handleChange}
          required
          placeholder="Unesite broj telefona"
        />
      </div>
      <div>
        <label htmlFor="email">Email pacijenta:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={appointment.email}
          onChange={handleChange}
          required
          placeholder="Unesite vas email"
        />
      </div>
      <div>
  <label htmlFor="appointment_time">Datum i vreme termina:</label>
  <input
    type="datetime-local"
    id="appointment_time"
    name="appointment_time"
    value={appointment.appointment_time}
    onChange={handleChange}
    required
  />
      </div>
        <div>
          <label htmlFor="appointment_duration">Dužina termina (u minutima):</label>
          <input
            type="number"
            id="appointment_duration"
            name="appointment_duration"
            value={appointment.appointment_duration}
            onChange={handleChange}
            required
            placeholder="Unesite duzinu terminu (30 ili 60 min)"
        />
      </div>
      <div>
        <label htmlFor="typeterms">Tip pregleda:</label>
        <input
          type="text"
          id="typeterms"
          name="typeterms"
          value={appointment.typeterms}
          onChange={handleChange}
          required
          placeholder="Unesite tip pregleda"
        />
      </div>
      <button type="submit">Zakaži termin</button>
    </form>
  );
};

export default PatientPage;
