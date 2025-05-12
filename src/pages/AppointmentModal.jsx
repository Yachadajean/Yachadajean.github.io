import React, { useState } from 'react';
import './AppointmentModal.css';

export default function AppointmentModal({ date, onClose, onSave, appointments }) {
  const [input, setInput] = useState({
    doctor: '',
    time: '',
    notes: ''
  });

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(input);
    setInput({ doctor: '', time: '', notes: '' });
  };

  return (
    <div className="appointment-panel">
      <div className="appointment-header">
        <h2>Appointments for {date.toDateString()}</h2>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>

      <ul className="appointment-list">
        {appointments.map((appt, index) => (
          <li key={index}>
            <strong>{appt.time}</strong> with Dr. {appt.doctor}<br />
            <em>{appt.notes}</em>
          </li>
        ))}
      </ul>

      <input type="text" name="doctor" placeholder="Doctor Name" onChange={handleChange} />
      <input type="time" name="time" onChange={handleChange} />
      <textarea name="notes" placeholder="Notes" onChange={handleChange}></textarea>
      <button onClick={handleSubmit}>Save</button>
    </div>
  );
}
