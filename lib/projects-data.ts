export interface ProjectTemplate {
  id: string;
  title: string;
  category: 'Autonomous Bot' | 'Smart Home / IoT' | 'Weather & Environment' | 'AI & Vision';
  targetGradeBand: 'Grade 3–5' | 'Grade 6–8' | 'Grade 9–10' | 'Grade 11–12';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  componentsUsed: string[];
  blockCode: {
    blocks: Array<{
      id: string;
      type: 'event' | 'action' | 'sensor' | 'logic' | 'iot';
      label: string;
      color: string;
      value?: string | number;
    }>;
  };
  generatedPython: string;
  generatedCpp: string;
  simulationType: 'obstacle-bot' | 'line-follower' | 'smart-home' | 'weather-station';
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'obstacle-avoider',
    title: 'Autonomous Obstacle Avoiding Rover',
    category: 'Autonomous Bot',
    targetGradeBand: 'Grade 6–8',
    difficulty: 'Intermediate',
    description: 'Build a smart rover that uses an HC-SR04 Ultrasonic sensor to detect obstacles ahead and automatically steer away using a Servo Motor & DC Motors.',
    componentsUsed: ['Arduino UNO R3', 'Ultrasonic Distance Sensor (HC-SR04)', 'Micro Servo Motor (SG90)', 'DC Gear Motors'],
    blockCode: {
      blocks: [
        { id: 'b1', type: 'event', label: 'When Robot Starts', color: 'bg-amber-500' },
        { id: 'b2', type: 'action', label: 'Set Motor Speed to 200 RPM', color: 'bg-blue-600', value: 200 },
        { id: 'b3', type: 'sensor', label: 'Measure Distance (Ultrasonic cm)', color: 'bg-emerald-600' },
        { id: 'b4', type: 'logic', label: 'If Distance < 20 cm', color: 'bg-purple-600', value: 20 },
        { id: 'b5', type: 'action', label: 'Turn Servo to 45° & Rotate Right', color: 'bg-blue-600', value: 45 },
        { id: 'b6', type: 'action', label: 'Else Drive Forward', color: 'bg-blue-600' }
      ]
    },
    generatedPython: `# Autonomous Obstacle Avoidance Rover - Python Simulation Code
import time
from kite_robotics import Arduino, Ultrasonic, Servo, MotorDriver

robot = Arduino(port='COM3')
sonar = Ultrasonic(trig=9, echo=10)
radar_servo = Servo(pin=6)
motors = MotorDriver(in1=2, in2=3, in3=4, in4=5)

print("🚀 Rover Initialized. Starting Obstacle Avoidance Loop...")

while True:
    dist = sonar.read_distance_cm()
    print(f"Front Radar Distance: {dist:.1f} cm")
    
    if dist < 20.0:
        print("⚠️ Obstacle Detected! Braking and scanning...")
        motors.stop()
        radar_servo.write(45)
        time.sleep(0.3)
        motors.turn_right(speed=180)
        time.sleep(0.5)
        radar_servo.write(90)
    else:
        motors.drive_forward(speed=200)
    
    time.sleep(0.05)`,
    generatedCpp: `// Autonomous Obstacle Avoiding Rover - Arduino C++ Firmware
#include <Servo.h>

const int TRIG_PIN = 9;
const int ECHO_PIN = 10;
const int ENA = 5;
const int IN1 = 2;
const int IN2 = 3;

Servo scanServo;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  scanServo.attach(6);
  scanServo.write(90); // Center position
}

long getDistanceCM() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2;
}

void loop() {
  long distance = getDistanceCM();
  Serial.print("Distance: ");
  Serial.println(distance);

  if (distance > 0 && distance < 20) {
    // Stop & Turn
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    scanServo.write(45);
    delay(400);
  } else {
    // Forward
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    scanServo.write(90);
  }
  delay(50);
}`,
    simulationType: 'obstacle-bot'
  },
  {
    id: 'line-follower',
    title: 'High-Speed Line Follower Robot',
    category: 'Autonomous Bot',
    targetGradeBand: 'Grade 6–8',
    difficulty: 'Intermediate',
    description: 'Program dual IR reflectance sensors to guide a robot along a black track on a white background with continuous steering adjustments.',
    componentsUsed: ['Arduino UNO R3', 'IR Line Tracking Sensor Pair', 'L298N Motor Driver', 'DC Gear Motors'],
    blockCode: {
      blocks: [
        { id: 'b1', type: 'event', label: 'When Track Mode Active', color: 'bg-amber-500' },
        { id: 'b2', type: 'sensor', label: 'Read Left IR Pin D2 & Right IR Pin D3', color: 'bg-emerald-600' },
        { id: 'b3', type: 'logic', label: 'If Left IR == BLACK and Right IR == WHITE', color: 'bg-purple-600' },
        { id: 'b4', type: 'action', label: 'Steer Left (Motor L: 50, Motor R: 200)', color: 'bg-blue-600' },
        { id: 'b5', type: 'logic', label: 'Else If Both IR == WHITE', color: 'bg-purple-600' },
        { id: 'b6', type: 'action', label: 'Drive Straight (Speed 220)', color: 'bg-blue-600' }
      ]
    },
    generatedPython: `# High-Speed Line Follower Robot - Python Simulation
from kite_robotics import Arduino, IRSensorArray, MotorDriver
import time

bot = Arduino(port='COM3')
ir_sensors = IRSensorArray(left_pin=2, right_pin=3)
motors = MotorDriver(left_pwm=5, right_pwm=6)

print("🏎️ Line Follower Initialized. Placed on Black Track.")

while True:
    left_state, right_state = ir_sensors.read_digital()
    
    if left_state == 1 and right_state == 0:
        # Curve left
        motors.set_speeds(left=60, right=210)
    elif left_state == 0 and right_state == 1:
        # Curve right
        motors.set_speeds(left=210, right=60)
    else:
        # Straight
        motors.set_speeds(left=200, right=200)
    
    time.sleep(0.02)`,
    generatedCpp: `// High-Speed Line Follower Robot - Arduino C++
const int LEFT_IR = 2;
const int RIGHT_IR = 3;
const int IN1 = 4;
const int IN2 = 5;
const int IN3 = 6;
const int IN4 = 7;

void setup() {
  pinMode(LEFT_IR, INPUT);
  pinMode(RIGHT_IR, INPUT);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
}

void loop() {
  int leftVal = digitalRead(LEFT_IR);
  int rightVal = digitalRead(RIGHT_IR);

  if (leftVal == HIGH && rightVal == LOW) {
    // Turn Left
    digitalWrite(IN1, LOW);
    digitalWrite(IN2, HIGH);
    digitalWrite(IN3, HIGH);
    digitalWrite(IN4, LOW);
  } else if (leftVal == LOW && rightVal == HIGH) {
    // Turn Right
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, LOW);
    digitalWrite(IN4, HIGH);
  } else {
    // Forward
    digitalWrite(IN1, HIGH);
    digitalWrite(IN2, LOW);
    digitalWrite(IN3, HIGH);
    digitalWrite(IN4, LOW);
  }
}`,
    simulationType: 'line-follower'
  },
  {
    id: 'smart-home-iot',
    title: 'ESP32 Smart Home IoT Dashboard',
    category: 'Smart Home / IoT',
    targetGradeBand: 'Grade 9–10',
    difficulty: 'Advanced',
    description: 'Connect an ESP32 board to cloud dashboard controls to turn on lights remotely, auto-activate motion lights with PIR, and send alerts.',
    componentsUsed: ['ESP32 IoT & Wi-Fi Board', 'PIR Motion Sensor', 'Relay Module', 'OLED Display'],
    blockCode: {
      blocks: [
        { id: 'b1', type: 'event', label: 'Connect ESP32 to Wi-Fi', color: 'bg-amber-500' },
        { id: 'b2', type: 'iot', label: 'Publish Telemetry to MQTT Cloud', color: 'bg-cyan-600' },
        { id: 'b3', type: 'sensor', label: 'Read PIR Motion Sensor GPIO 15', color: 'bg-emerald-600' },
        { id: 'b4', type: 'logic', label: 'If Motion Detected or Dashboard Switch ON', color: 'bg-purple-600' },
        { id: 'b5', type: 'action', label: 'Trigger Relay GPIO 2 (Turn Room Light ON)', color: 'bg-blue-600' }
      ]
    },
    generatedPython: `# ESP32 Smart Home Automation - MicroPython
import network
import ujson
from umqtt.simple import MQTTClient
from machine import Pin
import time

motion_pin = Pin(15, Pin.IN)
relay_pin = Pin(2, Pin.OUT)

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect('KiteSchool_WiFi', 'Pass1234')
    while not wlan.isconnected():
        time.sleep(0.5)
    print("🌐 ESP32 Connected! IP:", wlan.ifconfig()[0])

connect_wifi()
mqtt = MQTTClient("esp32_smarthome", "broker.hivemq.com")
mqtt.connect()

print("🏠 Smart Home Telemetry Active.")

while True:
    is_motion = motion_pin.value()
    relay_pin.value(is_motion)
    
    payload = ujson.dumps({"motion": is_motion, "light_status": "ON" if is_motion else "OFF"})
    mqtt.publish("kiterobotics/smarthome/telemetry", payload)
    time.sleep(1)`,
    generatedCpp: `// ESP32 Smart Home IoT Firmware
#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "KiteSchool_WiFi";
const char* password = "Password123";
const int MOTION_PIN = 15;
const int RELAY_PIN = 2;

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  pinMode(MOTION_PIN, INPUT);
  pinMode(RELAY_PIN, OUTPUT);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
  client.setServer("broker.hivemq.com", 1883);
}

void loop() {
  int motion = digitalRead(MOTION_PIN);
  if (motion == HIGH) {
    digitalWrite(RELAY_PIN, HIGH);
  } else {
    digitalWrite(RELAY_PIN, LOW);
  }
  delay(100);
}`,
    simulationType: 'smart-home'
  }
];
