import pandas as pd
import numpy as np
import pickle
import difflib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

file_path = "Diseases_dataset2.csv"
df = pd.read_csv(file_path)

label_encoders = {}
for column in df.columns:
    le = LabelEncoder()
    df[column] = le.fit_transform(df[column])
    label_encoders[column] = le

X = df.drop(columns=['Disease'])
y = df['Disease']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model Accuracy: {accuracy:.2f}")

with open("health_model.pkl", "wb") as model_file:
    pickle.dump(model, model_file)
with open("label_encoders.pkl", "wb") as encoder_file:
    pickle.dump(label_encoders, encoder_file)

def get_closest_match(input_value, valid_options):
    closest_matches = difflib.get_close_matches(input_value, valid_options, n=1, cutoff=0.6)
    return closest_matches[0] if closest_matches else None

def predict_disease(user_input):
    try:
        with open("health_model.pkl", "rb") as model_file:
            model = pickle.load(model_file)
        with open("label_encoders.pkl", "rb") as encoder_file:
            label_encoders = pickle.load(encoder_file)

        encoded_input = []
        for col, value in zip(X.columns, user_input):
            valid_options = label_encoders[col].classes_
            if value in valid_options:
                encoded_value = label_encoders[col].transform([value])[0]
            else:
                closest_match = get_closest_match(value, valid_options)
                if closest_match:
                    print(f"\n⚠️ Did you mean '{closest_match}' instead of '{value}'? Using '{closest_match}'...")
                    encoded_value = label_encoders[col].transform([closest_match])[0]
                else:
                    print(f"\n❌ Invalid Input: '{value}' is not a recognized symptom for '{col}'.")
                    print("🔄 Please check the spelling or choose from the available options.")
                    return "Invalid Input"
            encoded_input.append(encoded_value)

        encoded_input = np.array(encoded_input).reshape(1, -1)
        predicted_class = model.predict(encoded_input)[0]
        disease_name = label_encoders['Disease'].inverse_transform([predicted_class])[0]

        return f"\n✅ Predicted Disease: **{disease_name}**"

    except Exception as e:
        return f"\n⚠️ Error in Prediction: {str(e)}"

def get_user_input():
    user_input = []
    print("\nStep 1: Enter Initial Symptoms")
    for col in X.columns[:3]:
        value = input(f"Enter {col} (options: {', '.join(label_encoders[col].classes_)}): ")
        user_input.append(value)

    print("\nStep 2: Enter Additional Symptoms")
    for col in X.columns[3:]:
        value = input(f"Enter {col} (options: {', '.join(label_encoders[col].classes_)}): ")
        user_input.append(value)

    return user_input

if __name__ == "__main__":
    user_input = get_user_input()
    result = predict_disease(user_input)
    print(result)