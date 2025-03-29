from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import difflib

app = Flask(__name__)
CORS(app)  # This is necessary for allowing requests from a different origin (React frontend)

# Load the trained model and label encoders
with open("health_model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

with open("label_encoders.pkl", "rb") as encoder_file:
    label_encoders = pickle.load(encoder_file)

# Function to find the closest match for the input value (in case of typo or unrecognized input)
def get_closest_match(input_value, valid_options):
    closest_matches = difflib.get_close_matches(input_value, valid_options, n=1, cutoff=0.6)
    return closest_matches[0] if closest_matches else None

# API endpoint to handle prediction request
@app.route('/predict', methods=['POST'])
def predict_disease():
    try:
        user_input = request.json['input']  # The frontend will send the symptoms as JSON input
        encoded_input = []

        # Encode the user input based on the label encoders
        for col, value in zip(model.feature_names_in_, user_input):
            valid_options = label_encoders[col].classes_
            if value in valid_options:
                encoded_value = label_encoders[col].transform([value])[0]
            else:
                closest_match = get_closest_match(value, valid_options)
                if closest_match:
                    print(f"\n⚠️ Did you mean '{closest_match}' instead of '{value}'? Using '{closest_match}'...")
                    encoded_value = label_encoders[col].transform([closest_match])[0]
                else:
                    return jsonify({"error": f"Invalid Input: '{value}' is not a recognized symptom for '{col}'."}), 400
            encoded_input.append(encoded_value)

        encoded_input = np.array(encoded_input).reshape(1, -1)
        predicted_class = model.predict(encoded_input)[0]
        disease_name = label_encoders['Disease'].inverse_transform([predicted_class])[0]

        return jsonify({"predicted_disease": disease_name})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
