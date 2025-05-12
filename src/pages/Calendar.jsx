import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css'; 
import AppointmentModal from './AppointmentModal';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const handleMonthChange = (action) => {
    const newDate = new Date(selectedDate);
    if (action === 'prev') newDate.setMonth(newDate.getMonth() - 1);
    else if (action === 'next') newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const handleMonthSelect = (event) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(parseInt(event.target.value));
    setSelectedDate(newDate);
    setShowMonthPicker(false);
  };

  const dateKey = selectedDate.toISOString().split('T')[0];

  return (
    <div className="page-container">
      <header className="page-header"> 
          <div className="calendar-month-selector">
            <button className="arrow-button" onClick={() => handleMonthChange('prev')}>&#8592;</button>
            <span className="month-label clickable" onClick={() => setShowMonthPicker(!showMonthPicker)}>
              {selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}
            </span>
            <button className="arrow-button" onClick={() => handleMonthChange('next')}>&#8594;</button>

            {showMonthPicker && (
              <select className="month-dropdown" value={selectedDate.getMonth()} onChange={handleMonthSelect}>
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index} value={index}>
                    {new Date(0, index).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
            )}
          </div>
        </header>


        <div className="calendar-body">
  <div className="calendar-wrapper">
    <div className="calendar-centerer">
      <Calendar
        onClickDay={handleDateClick}
        value={selectedDate}
        locale="en-US"
        navigationLabel={null}
        nextLabel={null}
        prevLabel={null}
        showNavigation={false}
      />
    </div>

    {/* Show appointment panel inside white box */}
    {modalOpen && (
      <AppointmentModal
        date={selectedDate}
        onClose={() => setModalOpen(false)}
        onSave={(data) => setAppointments(dateKey, data)}
        appointments={appointments[dateKey] || []}
      />
    )}
  </div>
</div>

    </div>
  );
}
