import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

   const handleSubmit = () => {
          navigate('/app');
   }
  return (
    <div className="welcome-container">
      <div className="welcome-message">
        <h1>Welcome to HealthGPT</h1>
        <p>Your health companion for better well-being</p>
      </div>
      <div className="button-container">
        <button className="welcome-button" onClick={handleSubmit}>
          Check Diease
        </button>
      </div>
    </div>
  )
}

export default Home;
