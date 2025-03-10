# AI Traffic Prediction Model

# Step 1: Install Required Libraries
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

# Step 2: Load and Preprocess Traffic Data
data = pd.read_csv("structured_logs.csv")

# Define features (time of request, request rate)
X = data[['hour_of_day', 'requests_per_second']]
y = data['high_traffic']  # 1 = High traffic, 0 = Normal traffic

# Step 3: Split Data for Training and Testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Train AI Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Step 5: Save the Trained AI Model
joblib.dump(model, "traffic_model.pkl")
print("✅ AI Model Trained & Saved!")

# Step 6: Function to Predict Traffic Levels
def predict_traffic(hour, requests_per_second):
    model = joblib.load("traffic_model.pkl")
    prediction = model.predict([[hour, requests_per_second]])
    return "High Traffic" if prediction[0] == 1 else "Normal Traffic"

# Step 7: Test Prediction
if _name_ == "_main_":
    test_hour = 14  # Example input (2 PM)
    test_requests = 1200  # Example traffic load
    result = predict_traffic(test_hour, test_requests)
    print(f"Predicted Traffic Status: {result}")