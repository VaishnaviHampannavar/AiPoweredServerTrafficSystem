window.addEventListener("DOMContentLoaded", function () {
    /** 📌 Get elements */
    const serverSpeedometerCanvas = document.getElementById("serverSpeedometer");
    const server2SpeedometerCanvas = document.getElementById("server2Speedometer");
    const userSpeedometerCanvas = document.getElementById("userSpeedometer");
    const trafficCanvas = document.getElementById("trafficChart");
    const requestsCanvas = document.getElementById("requestsChart");
    const aiPredictionCanvas = document.getElementById("aiPredictionChart");

    const serverStatus = document.getElementById("server-status");
    const server2Status = document.getElementById("server2-status");
    const userStatus = document.getElementById("user-status");
    const loadingMessage = document.getElementById("loading");

    if (!serverSpeedometerCanvas || !server2SpeedometerCanvas || !userSpeedometerCanvas || !trafficCanvas || !requestsCanvas || !aiPredictionCanvas) {
        console.error("One or more elements not found. Check IDs in HTML.");
        return;
    }

    /** 🔹 Initialize Speedometer (Server 1 Load) */
    const serverSpeedometerChart = new Chart(serverSpeedometerCanvas.getContext("2d"), {
        type: "doughnut",
        data: {
            labels: ["Usage", "Remaining"],
            datasets: [{
                data: [50, 50], // Initial values
                backgroundColor: ["#FF5733", "#E0E0E0"],
                borderWidth: 2
            }]
        },
        options: { responsive: true, cutout: "70%", plugins: { legend: { display: false } } }
    });

    /** 🔹 Initialize Speedometer (Server 2 Load) */
    const server2SpeedometerChart = new Chart(server2SpeedometerCanvas.getContext("2d"), {
        type: "doughnut",
        data: {
            labels: ["Usage", "Remaining"],
            datasets: [{
                data: [0, 100], // Initially idle
                backgroundColor: ["#28A745", "#E0E0E0"],
                borderWidth: 2
            }]
        },
        options: { responsive: true, cutout: "70%", plugins: { legend: { display: false } } }
    });

    /** 🔹 Initialize Speedometer (Active Users) */
    const userSpeedometerChart = new Chart(userSpeedometerCanvas.getContext("2d"), {
        type: "doughnut",
        data: {
            labels: ["Users Online", "Remaining"],
            datasets: [{
                data: [30, 70],
                backgroundColor: ["#007BFF", "#E0E0E0"],
                borderWidth: 2
            }]
        },
        options: { responsive: true, cutout: "70%", plugins: { legend: { display: false } } }
    });

    /** 🔹 Initialize Requests Per Second Chart */
    const requestsChart = new Chart(requestsCanvas.getContext("2d"), {
        type: "bar",
        data: { labels: [], datasets: [{ label: "Requests Per Second", data: [], backgroundColor: "#FFC107", borderWidth: 1 }] },
        options: { responsive: true, scales: { y: { min: 0, max: 100 } } }
    });

    /** 🔹 Initialize AI Traffic Prediction Chart */
    const aiPredictionChart = new Chart(aiPredictionCanvas.getContext("2d"), {
        type: "line",
        data: { labels: [], datasets: [{ label: "Predicted Traffic", data: [], borderColor: "#28A745", backgroundColor: "rgba(40, 167, 69, 0.2)", borderWidth: 2, tension: 0.3 }] },
        options: { responsive: true, scales: { y: { min: 0, max: 100 } } }
    });

    /** 🔹 Initialize Traffic Chart */
    const trafficChart = new Chart(trafficCanvas.getContext("2d"), {
        type: "line",
        data: { labels: [], datasets: [{ label: "Server Traffic", data: [], borderColor: "#007BFF", backgroundColor: "rgba(55, 9, 73, 0.2)", borderWidth: 3, tension: 0.3 }] },
        options: { responsive: true, scales: { y: { min: 0, max: 100 } } }
    });

    /** 🔹 Function to Update Speedometers */
    function updateSpeedometers(serverLoad, server2Load, activeUsers) {
        let serverUsage = Math.min(serverLoad, 100);
        let server2Usage = Math.min(server2Load, 100);
        let userUsage = Math.min(activeUsers, 100);

        serverSpeedometerChart.data.datasets[0].data = [serverUsage, 100 - serverUsage];
        server2SpeedometerChart.data.datasets[0].data = [server2Usage, 100 - server2Usage];
        userSpeedometerChart.data.datasets[0].data = [userUsage, 100 - userUsage];

        serverStatus.innerText = serverUsage < 40 ? "🟢 Server 1 is Free" : serverUsage < 80 ? "🟡 Server 1 is Moderate" : "🔴 Server 1 is Busy";
        server2Status.innerText = server2Usage > 0 ? `🟢 Server 2 Active (${server2Usage}%)` : "⚪ Server 2 Idle";
        userStatus.innerText = userUsage < 40 ? "🟢 Few Users Online" : userUsage < 80 ? "🟡 Moderate Users Online" : "🔴 High User Load";

        serverSpeedometerChart.update();
        server2SpeedometerChart.update();
        userSpeedometerChart.update();
    }

    /** 🔹 Fetch Data Simulation */
    function fetchData() {
        loadingMessage.style.display = "block";

        setTimeout(() => {
            loadingMessage.style.display = "none";

            setInterval(() => {
                let now = new Date().toLocaleTimeString();
                let newTraffic = Math.floor(Math.random() * 100);
                let serverLoad = Math.floor(Math.random() * 100);
                let activeUsers = Math.floor(Math.random() * 100);
                let newRequestsPerSecond = Math.floor(Math.random() * 100);
                let predictedTraffic = Math.floor(Math.random() * 100);
                let server2Load = 0;

                // 🔹 Auto-switch to Server 2 if Server 1 is overloaded
                if (serverLoad > 80 || predictedTraffic > 80) {
                    server2Load = Math.min(serverLoad - 80, 100);
                    serverLoad = 80;
                }

                // Update Traffic Chart
                trafficChart.data.labels.push(now);
                trafficChart.data.datasets[0].data.push(newTraffic);
                if (trafficChart.data.labels.length > 10) {
                    trafficChart.data.labels.shift();
                    trafficChart.data.datasets[0].data.shift();
                }
                trafficChart.update();

                // Update Speedometers
                updateSpeedometers(serverLoad, server2Load, activeUsers);

                // Update Requests Per Second Chart
                requestsChart.data.labels.push(now);
                requestsChart.data.datasets[0].data.push(newRequestsPerSecond);
                if (requestsChart.data.labels.length > 10) {
                    requestsChart.data.labels.shift();
                    requestsChart.data.datasets[0].data.shift();
                }
                requestsChart.update();

                // Update AI Traffic Prediction Chart
                aiPredictionChart.data.labels.push(now);
                aiPredictionChart.data.datasets[0].data.push(predictedTraffic);
                if (aiPredictionChart.data.labels.length > 10) {
                    aiPredictionChart.data.labels.shift();
                    aiPredictionChart.data.datasets[0].data.shift();
                }
                aiPredictionChart.update();

            }, 5000);
        }, 2000);
    }

    fetchData();
});