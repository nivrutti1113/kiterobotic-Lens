// Circuit Wiring Mapping Engine for Multi-Component Breadboard Assemblies
// Relational pin mapping database for microcontrollers, sensors, actuators, displays, and relays.

export interface PinMapping {
  pinName: string;
  pinType: 'VCC' | 'GND' | 'DIGITAL' | 'ANALOG' | 'PWM' | 'I2C_SDA' | 'I2C_SCL' | 'SPI';
  targetPin: string;
  wireColor: string; // Hex color code for wire SVG
  voltage: '5V' | '3.3V' | 'GND' | 'SIGNAL';
}

export interface HardwareCircuitConfig {
  componentId: string;
  componentName: string;
  category: string;
  image: string;
  description: string;
  wireConnections: PinMapping[];
  safetyTips: string[];
}

export const CIRCUIT_DATABASE: Record<string, HardwareCircuitConfig> = {
  'ultrasonic-hcsr04': {
    componentId: 'ultrasonic-hcsr04',
    componentName: 'HC-SR04 Ultrasonic Distance Sensor',
    category: 'Sensor',
    image: '/components/ultrasonic.png',
    description: 'Measures distances 2cm–400cm using 40kHz ultrasonic sound waves.',
    wireConnections: [
      { pinName: 'VCC', pinType: 'VCC', targetPin: 'Arduino 5V Power Pin', wireColor: '#ef4444', voltage: '5V' },
      { pinName: 'Trig', pinType: 'DIGITAL', targetPin: 'Arduino Digital Pin 9 (Trig)', wireColor: '#38bdf8', voltage: 'SIGNAL' },
      { pinName: 'Echo', pinType: 'DIGITAL', targetPin: 'Arduino Digital Pin 10 (Echo)', wireColor: '#f59e0b', voltage: 'SIGNAL' },
      { pinName: 'GND', pinType: 'GND', targetPin: 'Arduino Ground Pin (GND)', wireColor: '#1e293b', voltage: 'GND' },
    ],
    safetyTips: [
      'Operating Voltage is strictly 5V DC.',
      'Connect GND before applying power to prevent electrostatic damage.'
    ]
  },
  'servo-sg90': {
    componentId: 'servo-sg90',
    componentName: 'SG90 Micro Servo Motor (9g)',
    category: 'Actuator',
    image: '/components/servo.png',
    description: 'Provides 0° to 180° precise rotational position control via PWM pulse timing.',
    wireConnections: [
      { pinName: 'Red (VCC)', pinType: 'VCC', targetPin: 'Arduino 5V Power Pin', wireColor: '#ef4444', voltage: '5V' },
      { pinName: 'Brown (GND)', pinType: 'GND', targetPin: 'Arduino Ground Pin (GND)', wireColor: '#1e293b', voltage: 'GND' },
      { pinName: 'Orange (PWM)', pinType: 'PWM', targetPin: 'Arduino PWM Pin ~6', wireColor: '#a855f7', voltage: 'SIGNAL' },
    ],
    safetyTips: [
      'Do not force the servo horn past its 0°–180° mechanical stops manually.',
      'High-torque motor load requires smooth decoupling capacitors.'
    ]
  },
  'oled-ssd1306': {
    componentId: 'oled-ssd1306',
    componentName: '0.96" I2C OLED Display (SSD1306)',
    category: 'Display & IoT',
    image: '/components/oled.png',
    description: '128x64 pixel monochrome graphics display using 2-wire I2C communication.',
    wireConnections: [
      { pinName: 'VCC', pinType: 'VCC', targetPin: 'Arduino 3.3V / 5V Pin', wireColor: '#ef4444', voltage: '3.3V' },
      { pinName: 'GND', pinType: 'GND', targetPin: 'Arduino Ground Pin (GND)', wireColor: '#1e293b', voltage: 'GND' },
      { pinName: 'SCL', pinType: 'I2C_SCL', targetPin: 'Arduino Pin A5 (SCL)', wireColor: '#eab308', voltage: 'SIGNAL' },
      { pinName: 'SDA', pinType: 'I2C_SDA', targetPin: 'Arduino Pin A4 (SDA)', wireColor: '#22c55e', voltage: 'SIGNAL' },
    ],
    safetyTips: [
      'Default I2C address is 0x3C (or 0x3D).',
      'Operating logic level is 3.3V safe.'
    ]
  },
  'ir-line-sensor': {
    componentId: 'ir-line-sensor',
    componentName: 'Dual TCRT5000 IR Line Tracker Module',
    category: 'Sensor',
    image: '/components/ir_sensor.png',
    description: 'Infrared transmitter & phototransistor pair detecting black lines on white surfaces.',
    wireConnections: [
      { pinName: 'VCC', pinType: 'VCC', targetPin: 'Arduino 5V Power Pin', wireColor: '#ef4444', voltage: '5V' },
      { pinName: 'GND', pinType: 'GND', targetPin: 'Arduino Ground Pin (GND)', wireColor: '#1e293b', voltage: 'GND' },
      { pinName: 'OUT_LEFT', pinType: 'DIGITAL', targetPin: 'Arduino Digital Pin 2', wireColor: '#38bdf8', voltage: 'SIGNAL' },
      { pinName: 'OUT_RIGHT', pinType: 'DIGITAL', targetPin: 'Arduino Digital Pin 3', wireColor: '#10b981', voltage: 'SIGNAL' },
    ],
    safetyTips: [
      'Use onboard potentiometer to calibrate infrared sensitivity based on ambient lighting.'
    ]
  },
  'l298n-motor-driver': {
    componentId: 'l298n-motor-driver',
    componentName: 'L298N Dual H-Bridge DC Motor Driver',
    category: 'Actuator',
    image: '/components/l298n.png',
    description: 'Drives two DC motors with bidirectional speed and direction control up to 2A per channel.',
    wireConnections: [
      { pinName: '12V Power', pinType: 'VCC', targetPin: 'External Battery Positive (+9V)', wireColor: '#ef4444', voltage: '5V' },
      { pinName: 'GND', pinType: 'GND', targetPin: 'Arduino & Battery Common GND', wireColor: '#1e293b', voltage: 'GND' },
      { pinName: 'IN1', pinType: 'DIGITAL', targetPin: 'Arduino Digital Pin 4', wireColor: '#38bdf8', voltage: 'SIGNAL' },
      { pinName: 'IN2', pinType: 'DIGITAL', targetPin: 'Arduino Digital Pin 5', wireColor: '#a855f7', voltage: 'SIGNAL' },
      { pinName: 'ENA (PWM)', pinType: 'PWM', targetPin: 'Arduino PWM Pin ~3', wireColor: '#f59e0b', voltage: 'SIGNAL' },
    ],
    safetyTips: [
      'Always connect Arduino GND and Motor Power GND together to form a common ground loop!'
    ]
  }
};
