#include <LiquidCrystal.h>
#include <WiFi.h>
#include <HTTPClient.h>

/* ================= LCD ================= */
// RS, E, D4, D5, D6, D7
LiquidCrystal lcd(8, 9, 10, 11, 12, 13);

/* ================= WIFI ================= */
const char* ssid = "Wokwi-GUEST";
const char* password = "";
const char* serverUrl = "http://host.wokwi.internal:5000/api/iot/data";

/* ================= TIME ================= */
unsigned long lastUpdate = 0;
unsigned long lastScreenSwitch = 0;
const unsigned long UPDATE_INTERVAL = 1000;
const unsigned long SCREEN_INTERVAL = 3000;

/* ================= DATA ================= */
float rawHeartRate = 72.0;
float avgHeartRate = 72.0;
int steps = 0;
float calories = 0.0;

/* ================= UI ================= */
int screenIndex = 0;

/* ================= BUSINESS LOGIC ================= */

float smoothHeartRate(float current) {
  const float alpha = 0.2;
  avgHeartRate = alpha * current + (1 - alpha) * avgHeartRate;
  return avgHeartRate;
}

void updateStepsAndCalories() {
  int newSteps = random(0, 4);
  steps += newSteps;

  float caloriesPerStep = 0.04 + (avgHeartRate - 60) * 0.001;
  calories += newSteps * caloriesPerStep;
}

void updateData() {
  rawHeartRate = random(60, 95);
  smoothHeartRate(rawHeartRate);
  updateStepsAndCalories();
}

/* ================= SERVER COMMUNICATION ================= */

void sendDataToServer() {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  String body =
    "{\"heartRate\":" + String(avgHeartRate, 1) +
    ",\"steps\":" + String(steps) +
    ",\"calories\":" + String(calories, 1) + "}";

  int code = http.POST(body);

  Serial.print("POST status: ");
  Serial.println(code);
  Serial.println(body);

  http.end();
}

/* ================= DISPLAY ================= */

void renderScreen() {
  lcd.clear();

  if (screenIndex == 0) {
    lcd.setCursor(0, 0);
    lcd.print("HR:");
    lcd.print((int)avgHeartRate);
    lcd.print(" bpm");

    lcd.setCursor(0, 1);
    lcd.print("Steps:");
    lcd.print(steps);
  }

  if (screenIndex == 1) {
    lcd.setCursor(0, 0);
    lcd.print("Calories:");

    lcd.setCursor(0, 1);
    lcd.print(calories, 1);
    lcd.print(" kcal");
  }
}

/* ================= SETUP ================= */

void setup() {
  Serial.begin(115200);

  lcd.begin(16, 2);
  lcd.print("Connecting WiFi");

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(300);
    Serial.print(".");
  }

  lcd.clear();
  lcd.print("Fitness Client");
  lcd.setCursor(0, 1);
  lcd.print("Started");
  delay(1500);

  renderScreen();
}

/* ================= LOOP ================= */

void loop() {
  unsigned long now = millis();

  if (now - lastUpdate >= UPDATE_INTERVAL) {
    lastUpdate = now;
    updateData();
    sendDataToServer();
  }

  if (now - lastScreenSwitch >= SCREEN_INTERVAL) {
    lastScreenSwitch = now;
    screenIndex = (screenIndex + 1) % 2;
    renderScreen();
  }
}
