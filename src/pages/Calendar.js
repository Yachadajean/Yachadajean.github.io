import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(to bottom right, #e0f7fa, #e1bee7)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        margin: '20px',
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: 'fit-content'
      }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Appointment Calendar</h2>
        <Calendar
          onChange={setDate}
          value={date}
        />
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          <strong>Selected Date:</strong> {date.toDateString()}
        </p>
      </div>
    </div>
  );
}