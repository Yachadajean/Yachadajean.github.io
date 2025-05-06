import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(to bottom right, rgb(180, 245, 201), #e1bee7)',
      minHeight: '96vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        margin: '20px',
        padding: '40px',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '90%',  // Use percentage width
        maxWidth: '1200px'  // Maximum width
      }}>
        <h2 style={{ marginBottom: '20px', textAlign: 'center', fontSize: '30px', color: '#5d5d5d' }}>Calendar</h2>
        <div style={{ 
          width: '100%',
          maxWidth: '1000px',  // Larger max width
          margin: '0 auto'
        }}>
          <Calendar
            onChange={setDate}
            value={date}
            className="custom-calendar"
          />
        </div>
        <p style={{ 
          marginTop: '30px', 
          textAlign: 'center', 
          fontSize: '16px',
          paddingTop: '10px',
          color: '#5d5d5d'
        }}>
          <strong>Selected Date:</strong> {date.toDateString()}
        </p>
      </div>

      {/* Add custom styles for the calendar */}
      <style>{`
        .custom-calendar {
          background: transparent !important;
          border: none !important;
          width: 100% !important;
          max-width: 1000px !important;
        }
        .custom-calendar .react-calendar__viewContainer {
          width: 100% !important;
        }
        .custom-calendar .react-calendar__navigation button {
          color: #6b46c1 !important;
          font-size: 18px !important;
          padding: 15px 10px !important;
        }
        .custom-calendar .react-calendar__month-view__weekdays {
          color: #6b46c1 !important;
          font-size: 16px !important;
        }
        .custom-calendar .react-calendar__month-view__days {
          gap: 8px !important;
        }
        .custom-calendar .react-calendar__tile {
          color: #5d5d5d !important;
          padding: 20px 10px !important;
          font-size: 16px !important;
          height: 60px !important;
        }
        .custom-calendar .react-calendar__tile--now {
          background: rgba(183, 148, 244, 0.7) !important;
          color: white !important;
        }
        .custom-calendar .react-calendar__tile--active {
          background: #6b46c1 !important;
          color: white !important;
        }
        .custom-calendar .react-calendar__tile:enabled:hover {
          background: rgb(241, 232, 255) !important;
        }
      `}</style>
    </div>
  );
}