import React from 'react';
import './form.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const Form = () => {
   const [disch , setdisch] = useState('');
   const [feel , setfeel] = useState('');
   const [pain , setpain] = useState('');
   const navigate = useNavigate();

   const handleDischargeChange = (e) => {
        setdisch(e.target.value);
   }

   const handleFeelingsAndUrgeChange = (e) => {
        setfeel(e.target.value);
   }

   const handlePainAndInfectionChange = (e) => {
        setpain(e.target.value);
   }

   const handleSubmit = () => {


           const formData = {
              disch,
              feel,
              pain,
            };
          if (!disch || !feel || !pain) {
              alert('Please fill in all the fields');
              return;
        }

        navigate('/newnextpage', { state: formData });
   }


  return (
    <div>
        <div className='headerdiv'>
            <FontAwesomeIcon icon={faHeartbeat} id='imageicon' />
            <header id='headerform'>HealthGPT</header>
         </div>
        <div id='container'>
            <main id='main'>

                <div className="inputs">
                    <label>Discharge: </label>
                    <select className="inputs" value={disch} onChange={handleDischargeChange}>
                      <option value="">Select an option</option>
                      <option value="stooling">Stooling</option>
                      <option value="Frequent Urination">Frequent Urination</option>
                      <option value="Painful Urination">Painful Urination</option>
                      <option value="Yellow,green discharge">Yellow, Green Discharge</option>
                    </select>
                  </div>
                  <div className="inputs">
                    <label>Feelings and Urge: </label>
                    <select className="inputs" value={feel} onChange={handleFeelingsAndUrgeChange}>
                      <option value="">Select an option</option>
                      <option value="Fever">Fever</option>
                      <option value="Hunger">Hunger</option>
                      <option value="Tired">Tired</option>
                      <option value="Urge to urinate">Urge to urinate</option>
                    </select>
                  </div>
                  <div className="inputs">
                    <label>Pain and Infection: </label>
                    <select className="inputs" value={pain} onChange={handlePainAndInfectionChange}>
                      <option value="">Select an option</option>
                      <option value="Abdominal Pain">Abdominal Pain</option>
                      <option value="Anal Itching and Pain">Anal Itching and Pain</option>
                      <option value="Blurred Vision">Blurred Vision</option>
                      <option value="Frequent Infection">Frequent Infection</option>
                      <option value="Headache">Headache</option>
                      <option value="Muscle Aches">Muscle Aches</option>
                      <option value="Swollen genitals">Swollen Genitals</option>
                    </select>
                  </div>
                   <div className="Appbuttons">
                    <button id='App_cancel' onClick={() => {navigate('/')}}>Back</button>
                    <button id='App_submit' onClick={handleSubmit}>Next</button>
                   </div>
            </main>
        </div>
    </div>
  )
}

export default Form;
