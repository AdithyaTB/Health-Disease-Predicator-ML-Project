import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
    const [userInput, setUserInput] = useState({
        symptom1: '',
        symptom2: '',
        symptom3: '',
        symptom4: '',
        symptom5: '',
        symptom6: '',
    });

    const [predictedDisease, setPredictedDisease] = useState('');
    const [error, setError] = useState('');

    // Handles the input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInput((prevInput) => ({
            ...prevInput,
            [name]: value,
        }));
    };

    // Submitting the form data to Flask API and handling response
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sending the input data to the Flask backend via POST
            const response = await axios.post('http://localhost:5000/predict', {
                input: Object.values(userInput),  // Array of user inputs
            });

            // Check the response from Flask API
            if (response.data.predicted_disease) {
                // If disease prediction is received, display it
                setPredictedDisease(response.data.predicted_disease);
                setError('');
            } else if (response.data.error) {
                // If there's an error in the response
                setError(response.data.error);
                setPredictedDisease('');
            }
        } catch (err) {
            // In case of network or API error
            setError('There was an error with the prediction request.');
            setPredictedDisease('');
        }
    };

    return (
        <div>
            <h1>Health Prediction</h1>

            <form onSubmit={handleSubmit}>
                {/* Example Input fields for user symptoms */}
                <div>
                    <label>Symptom 1:</label>
                    <input
                        type="text"
                        name="symptom1"
                        value={userInput.symptom1}
                        onChange={handleInputChange}
                        placeholder="Enter first symptom"
                    />
                </div>
                <div>
                    <label>Symptom 2:</label>
                    <input
                        type="text"
                        name="symptom2"
                        value={userInput.symptom2}
                        onChange={handleInputChange}
                        placeholder="Enter second symptom"
                    />
                </div>
                <div>
                    <label>Symptom 3:</label>
                    <input
                        type="text"
                        name="symptom3"
                        value={userInput.symptom3}
                        onChange={handleInputChange}
                        placeholder="Enter third symptom"
                    />
                </div>
                {/* Add more symptoms if required */}

                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>

            {/* Display the predicted disease or error message */}
            {predictedDisease && <h2>Predicted Disease: {predictedDisease}</h2>}
            {error && <h2 style={{ color: 'red' }}>Error: {error}</h2>}
        </div>
    );
};

export default Form;
