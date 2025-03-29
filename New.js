import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
    const [userInput, setUserInput] = useState([]);
    const [predictedDisease, setPredictedDisease] = useState('');
    const [error, setError] = useState('');

    // Handle user input change (array of symptoms)
    const handleInputChange = (e) => {
        const input = e.target.value.split(',').map(item => item.trim()); // Assuming user inputs symptoms as a comma-separated string
        setUserInput(input);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userInput.length === 0) {
            setError("Please enter at least one symptom.");
            setPredictedDisease('');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/predict', {
                input: userInput,  // Sending the array of symptoms
            });

            if (response.data.predicted_disease) {
                setPredictedDisease(response.data.predicted_disease);
                setError('');
            } else if (response.data.error) {
                setError(response.data.error);
                setPredictedDisease('');
            }
        } catch (err) {
            setError('There was an error with the prediction request.');
            setPredictedDisease('');
        }
    };

    return (
        <div>
            <h1>Health Prediction</h1>

            {/* Input field to enter symptoms as a comma-separated list */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Enter Symptoms (comma separated):</label>
                    <input
                        type="text"
                        value={userInput.join(', ')} // Display as a comma-separated string
                        onChange={handleInputChange}
                        placeholder="Enter symptoms, e.g. fever, headache"
                    />
                </div>
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
