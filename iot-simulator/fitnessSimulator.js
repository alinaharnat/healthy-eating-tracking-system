import axios from "axios";

const API_URL = "http://localhost:5000/api/iot-measurements";
const TOKEN = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NGM1NTAzMDRjNjU1YTllM2YwODg5YyIsInJvbGUiOiJjbGllbnQiLCJpYXQiOjE3NjY3Nzg0MjAsImV4cCI6MTc2NzM4MzIyMH0.W1L1NS-gWf_l3wRfiYQJ8sQu6-p5BzQPtVV8ycqIHK0`;

let avgPulse = 72;
let steps = 0;
let calories = 0;

function smoothPulse(value) {
  const alpha = 0.2;
  avgPulse = alpha * value + (1 - alpha) * avgPulse;
  return avgPulse;
}

function generateData() {
  const rawPulse = Math.floor(Math.random() * (95 - 60 + 1)) + 60;
  const pulse = smoothPulse(rawPulse);

  const newSteps = Math.floor(Math.random() * 4);
  steps += newSteps;

  calories += newSteps * (0.04 + (pulse - 60) * 0.001);

  return {
    pulse: Math.round(pulse),
    steps,
    weight: calories.toFixed(1),
  };
}

async function sendData() {
  const data = generateData();

  try {
    const res = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    console.log("Sent:", data);
  } catch (err) {
    console.error("Send error:", err.message);
  }
}

setInterval(sendData, 3000);
