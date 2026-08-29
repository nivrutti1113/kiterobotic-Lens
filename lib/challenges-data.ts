// Interactive STEM Debugging Quests & AST Evaluation Criteria

export interface STEMQuest {
  id: string;
  title: string;
  category: 'Debugging' | 'Logic Calibration' | 'Sensor Integration' | 'Safety';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpPoints: number;
  description: string;
  buggedCode: string;
  expectedBehavior: string;
  solutionHint: string;
  targetParams: {
    requiredPin?: number;
    minSpeed?: number;
    maxSpeed?: number;
    minDelayMs?: number;
    requiredKeyword?: string;
  };
}

export const STEM_QUESTS: STEMQuest[] = [
  {
    id: 'quest-1',
    title: 'Quest 1: The Broken Rover Delay',
    category: 'Debugging',
    difficulty: 'Beginner',
    xpPoints: 150,
    description: 'The Obstacle Rover crashes because the loop executes continuously without giving the ultrasonic sensor time to settle!',
    buggedCode: `# Bugged Obstacle Rover Loop\nwhile True:\n    dist = board.ultrasonic_read(trig=9, echo=10)\n    if dist < 20:\n        board.set_motors(left=0, right=0)`,
    expectedBehavior: 'Add a non-blocking delay of at least 50ms (time.sleep(0.05)) inside the while loop.',
    solutionHint: 'Include time.sleep(0.05) or delay(50) at the end of your loop.',
    targetParams: {
      minDelayMs: 50,
      requiredKeyword: 'time.sleep'
    }
  },
  {
    id: 'quest-2',
    title: 'Quest 2: Calibrate Sonar Threshold',
    category: 'Logic Calibration',
    difficulty: 'Intermediate',
    xpPoints: 200,
    description: 'The rover currently stops at 5cm, which is too close and causes high-speed collisions. Calibrate the threshold to 25cm!',
    buggedCode: `if dist < 5:\n    board.set_motors(left=0, right=0)`,
    expectedBehavior: 'Update condition to trigger braking when dist < 25.',
    solutionHint: 'Change 5 to 25 in the condition statement.',
    targetParams: {
      requiredKeyword: 'dist < 25'
    }
  },
  {
    id: 'quest-3',
    title: 'Quest 3: PWM Motor Speed Tuning',
    category: 'Logic Calibration',
    difficulty: 'Intermediate',
    xpPoints: 250,
    description: 'The motor driver is currently set to full 255 RPM, causing battery drainage. Tune speed down to 180 RPM for optimal efficiency.',
    buggedCode: `board.set_motor_speed(speed=255)`,
    expectedBehavior: 'Set motor speed parameter to 180.',
    solutionHint: 'Pass speed=180 into the set_motor_speed function.',
    targetParams: {
      minSpeed: 100,
      maxSpeed: 200,
      requiredKeyword: 'speed=180'
    }
  },
  {
    id: 'quest-4',
    title: 'Quest 4: Servo Scan Radar Pin Fix',
    category: 'Sensor Integration',
    difficulty: 'Advanced',
    xpPoints: 300,
    description: 'The servo radar is incorrectly attached to Digital Pin 2 (non-PWM). Move servo control to PWM Digital Pin 6!',
    buggedCode: `scanServo.attach(2); // Error: Pin 2 is non-PWM!`,
    expectedBehavior: 'Attach servo to PWM Pin 6 (scanServo.attach(6)).',
    solutionHint: 'Replace 2 with 6 in the servo attach method.',
    targetParams: {
      requiredPin: 6,
      requiredKeyword: 'attach(6)'
    }
  },
  {
    id: 'quest-5',
    title: 'Quest 5: Short Circuit Prevention',
    category: 'Safety',
    difficulty: 'Advanced',
    xpPoints: 350,
    description: 'A student connected 12V battery power directly into the 3.3V OLED display pin! Fix the circuit connection to 3.3V rail.',
    buggedCode: `connect_oled(power_rail="12V_BATTERY")`,
    expectedBehavior: 'Change power rail to 3.3V (power_rail="3.3V").',
    solutionHint: 'Pass power_rail="3.3V" to prevent OLED IC burnout.',
    targetParams: {
      requiredKeyword: '3.3V'
    }
  }
];
