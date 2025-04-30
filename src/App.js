import React, { useEffect, useState } from 'react';
import './App.css'; 
function App() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('https://falldetection.me/api/status')
      .then(res => res.json())
      .then(data => {
        console.log('API response:', data);
        setStatus(data.message); 
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setStatus('Failed to connect');
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Fall Detection Dashboard</h1>
        <p>Status from backend:</p>
        <p>{status || 'Loading...'}</p>
      </header>
    </div>
  );
}

export default App;
