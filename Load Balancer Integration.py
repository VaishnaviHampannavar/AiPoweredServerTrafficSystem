# AI + Load Balancer Integration

import joblib
import os
import time

# Load AI Model
model = joblib.load("traffic_model.pkl")

def predict_traffic(hour, requests_per_second):
    probability = model.predict_proba([[hour, requests_per_second]])[:, 1]  # Get probability of high traffic
    return "High Traffic" if probability > 0.6 else "Normal Traffic", probability[0]

# Monitor Traffic and Adjust Load Balancer
def adjust_load_balancer(hour, requests_per_second):
    traffic_status, probability = predict_traffic(hour, requests_per_second)
    print(f"Predicted Traffic Status: {traffic_status} (Confidence: {probability:.2f})")
    
    if traffic_status == "High Traffic":
        print("⚠️ High traffic detected! Adding more servers...")
        os.system("echo 'server 192.168.1.104;' >> /etc/nginx/nginx.conf")  # Example of adding a server
    else:
        print("✅ Traffic is normal. No action needed.")

    # Restart NGINX to apply changes
    os.system("sudo systemctl restart nginx")

# Simulated Traffic Data (Replace with Real-time Monitoring)
for hour in range(24):  # Simulate 24 hours
    requests_per_second = int(input(f"Enter simulated requests at hour {hour}: "))
    adjust_load_balancer(hour, requests_per_second)
    time.sleep(2)  # Wait before next simulation