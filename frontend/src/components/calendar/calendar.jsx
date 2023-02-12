import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "./Calendar.css"

const baseUrl = 'http://localhost:5000';


const AppointmentsCalendar = () => {
  const [dailyAppointments, setDailyAppointments] = useState([]);
  const [weeklyAppointments, setWeeklyAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    axios 
      .get(`${baseUrl}/patients/daily`)
      .then((response) => {
        setDailyAppointments(response.data["Daily Appointments"]);
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .get(`${baseUrl}/patients/weekly`)
      .then((response) => {
        setWeeklyAppointments(response.data["Weekly Appointments"]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };


  return (
    <div>
      <Calendar onChange={handleDateChange} value={selectedDate}/>
      <h2>Dnevni pregledi</h2>
      <ul>
        {dailyAppointments.map((appointment) => (
          <li key={appointment.jmbg}>
            {appointment.name} {appointment.lastname} - {appointment.typeterms}
          </li>
        ))}
      </ul>
      <h2>Nedeljni pregledi</h2>
      <ul>
        {weeklyAppointments.map((appointment) => (
          <li key={appointment.jmbg}>
            {appointment.name} {appointment.lastname} - {appointment.typeterms} : {appointment.appointment_time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentsCalendar;
