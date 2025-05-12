// ./pages/SizeContainer.js
import React from 'react';
import './SizeContainer.css'; 

const SizeContainer = ({ children }) => {
  return (
    <div className="size-container">
      {children}
    </div>
  );
};

export default SizeContainer;

