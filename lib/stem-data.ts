export interface StemComponent {
  id: string;
  name: string;
  category: 'Microcontroller' | 'Sensor' | 'Actuator' | 'Power & Passive' | 'Display & IoT';
  imageUrl: string;
  iconName: string;
  shortDesc: string;
  grades: {
    grade3_5: {
      title: string;
      explanation: string;
      funFact: string;
      realWorldAnalogy: string;
    };
    grade6_8: {
      title: string;
      explanation: string;
      inputOutput: string;
      circuitTip: string;
    };
    grade9_10: {
      title: string;
      explanation: string;
      specs: string[];
      pinout: { pin: string; function: string }[];
    };
    grade11_12: {
      title: string;
      explanation: string;
      ros2Protocol: string;
      codeSnippet: string;
    };
  };
  translations: {
    hi: { name: string; shortDesc: string; explanation: string };
    ta: { name: string; shortDesc: string; explanation: string };
    mr: { name: string; shortDesc: string; explanation: string };
    te: { name: string; shortDesc: string; explanation: string };
    bn: { name: string; shortDesc: string; explanation: string };
  };
  arOverlays: {
    pins: { x: number; y: number; label: string; desc: string }[];
    signalFlow: string;
    forceType: string;
  };
  defaultBlocklyProject: string;
}

export const STEM_COMPONENTS: StemComponent[] = [
  {
    id: 'arduino-uno',
    name: 'Arduino UNO R3',
    category: 'Microcontroller',
    imageUrl: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?q=80&w=600&auto=format&fit=crop',
    iconName: 'Cpu',
    shortDesc: 'The brain of your robot! Receives sensor signals and controls motors/LEDs.',
    grades: {
      grade3_5: {
        title: 'The Master Robot Brain',
        explanation: 'Imagine Arduino as the brain of a smart toy. It listens through eyes (sensors) and tells hands (motors) what to do!',
        funFact: 'Named after a bar in Ivrea, Italy where the inventors met!',
        realWorldAnalogy: 'Like your brain telling your foot to kick a ball when your eye sees it.'
      },
      grade6_8: {
        title: 'Programmable Microcontroller Board',
        explanation: 'Arduino UNO reads digital & analog input signals from sensors and sends output commands to motors, lights, and buzzers.',
        inputOutput: 'Input: 6 Analog pins (A0-A5), 14 Digital I/O pins (0-13) | Output: PWM signals & 5V/3.3V power.',
        circuitTip: 'Always connect GND to your breadboard ground rail first!'
      },
      grade9_10: {
        title: 'ATmega328P 8-bit AVR Microcontroller',
        explanation: 'Operating at 16 MHz with 32 KB Flash memory, 2 KB SRAM, and 1 KB EEPROM. Converts analog voltage (0-5V) to 10-bit digital readings (0-1023).',
        specs: ['Clock Speed: 16 MHz', 'Flash Memory: 32 KB', 'SRAM: 2 KB', 'Operating Voltage: 5V', 'ADC Resolution: 10-bit'],
        pinout: [
          { pin: 'Digital 0-1', function: 'RX/TX Serial Communication' },
          { pin: 'Digital 3,5,6,9,10,11', function: 'PWM (Pulse Width Modulation) Output' },
          { pin: 'Analog A0-A5', function: 'Analog-to-Digital Input (0-1023)' },
          { pin: '5V & GND', function: 'Regulated Power Supply' }
        ]
      },
      grade11_12: {
        title: 'Embedded Hardware & Serial Communication Node',
        explanation: 'Communicates via UART / SPI / I2C protocols. Can act as a hardware actuator driver node in ROS2 (Robot Operating System) micro-ROS topologies.',
        ros2Protocol: 'Publisher node on /sensor_scan (115200 baud UART) sending std_msgs/Int32 telemetry.',
        codeSnippet: 'void setup() {\n  Serial.begin(115200);\n  pinMode(13, OUTPUT);\n}\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(500);\n}'
      }
    },
    translations: {
      hi: {
        name: 'ऑर्डिनो यूएनओ (Arduino UNO)',
        shortDesc: 'आपके रोबोट का दिमाग! सेंसर संकेत पढ़ता है और मोटर को चलाता है।',
        explanation: 'ऑर्डिनो एक छोटा कंप्यूटर बोर्ड है जो कोड के अनुसार सेंसर और मोटर को नियंत्रित करता है।'
      },
      ta: {
        name: 'ஆர்டுயினோ யூனோ (Arduino UNO)',
        shortDesc: 'உங்கள் ரோபோவின் மூளை! சென்சார் சிக்னல்களை படித்து மோட்டார்களை இயக்குகிறது.',
        explanation: 'இது கட்டளைகளுக்கு ஏற்ப செயல்படும் ஒரு சிறிய கணினி பலகையாகும்.'
      },
      mr: {
        name: 'आर्डीनो युएनओ (Arduino UNO)',
        shortDesc: 'तुमच्या रोबोटचा मेंदू! सेन्सरचे सिग्नल वाचतो आणि मोटर चालवतो.',
        explanation: 'आर्डीनो बोर्ड प्रोग्रामनुसार सर्व घटक नियंत्रित करतो.'
      },
      te: {
        name: 'ఆర్డుయినో యుఎన్ఓ (Arduino UNO)',
        shortDesc: 'మీ రోబోట్ యొక్క మెదడు! సెన్సార్ సిగ్నల్స్ ని చదివి మోటార్లను నియంత్రిస్తుంది.',
        explanation: 'ఇది కంప్యూటర్ సూచనల ప్రకారం పని చేసే మైక్రోకంట్రోలర్.'
      },
      bn: {
        name: 'আরডুইনো ইউএনও (Arduino UNO)',
        shortDesc: 'আপনার রোবোটের মস্তিষ্ক! সেন্সরের সিগন্যাল গ্রহণ করে মোটর চালায়।',
        explanation: 'এটি কোডিং অনুযায়ী সেন্সর ও লাইট নিয়ন্ত্রণ করার প্রসেসর।'
      }
    },
    arOverlays: {
      pins: [
        { x: 30, y: 20, label: 'USB Port', desc: 'Code upload & power from computer' },
        { x: 75, y: 25, label: 'Digital I/O Pins', desc: 'Pins 0-13 for LEDs, Sensors & Motors' },
        { x: 70, y: 75, label: 'Analog Pins A0-A5', desc: 'Reads sensor voltages (0-5V)' },
        { x: 45, y: 80, label: 'Power Pins (5V/GND)', desc: 'Supplies electric current to circuits' }
      ],
      signalFlow: 'Serial USB -> ATmega328P Processor -> Output Pins (LED / Servo)',
      forceType: 'Electrical Potential & Digital Logic Signals'
    },
    defaultBlocklyProject: 'obstacle-avoider'
  },
  {
    id: 'ultrasonic-sensor',
    name: 'Ultrasonic Distance Sensor (HC-SR04)',
    category: 'Sensor',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop',
    iconName: 'Radar',
    shortDesc: 'Uses sound waves like a bat to measure distance to obstacles!',
    grades: {
      grade3_5: {
        title: 'Bat Eyes Sensor!',
        explanation: 'Just like bats navigate in the dark using echolocation, this sensor sends out sound waves that hit an object and bounce back.',
        funFact: 'The sound frequency (40kHz) is too high for humans to hear!',
        realWorldAnalogy: 'Shouting into a valley and listening for the echo.'
      },
      grade6_8: {
        title: 'Echolocation Distance Sensor',
        explanation: 'Trig pin sends a 10 microsecond HIGH pulse of ultrasonic sound. Echo pin stays HIGH for the exact duration it takes for the echo to return.',
        inputOutput: 'Input: 5V Power & Trig pulse | Output: Echo pulse width (Microseconds).',
        circuitTip: 'Distance in cm = (Echo Time in microseconds / 2) / 29.1'
      },
      grade9_10: {
        title: 'Acoustic Time-of-Flight Sensor',
        explanation: 'Calculates obstacle range from 2cm to 400cm with 3mm accuracy using speed of sound in air (~343 m/s).',
        specs: ['Trigger Input: 10µs TTL pulse', 'Echo Output: TTL signal proportional to distance', 'Frequency: 40 kHz', 'Measuring Angle: 15 degrees'],
        pinout: [
          { pin: 'VCC', function: '5V Power Supply' },
          { pin: 'Trig', function: 'Trigger input pulse' },
          { pin: 'Echo', function: 'Echo return duration signal' },
          { pin: 'GND', function: 'Ground Connection' }
        ]
      },
      grade11_12: {
        title: 'Time-of-Flight (ToF) Ultrasonic Rangefinder',
        explanation: 'Underlies obstacle detection nodes in autonomous mobile robotics. Distance formula: d = (v * t) / 2 where v = 331.4 + (0.6 * temp_C) m/s.',
        ros2Protocol: 'Publishes sensor_msgs/msg/Range on topic /ultrasonic/range.',
        codeSnippet: 'digitalWrite(trigPin, LOW);\ndelayMicroseconds(2);\ndigitalWrite(trigPin, HIGH);\ndelayMicroseconds(10);\ndigitalWrite(trigPin, LOW);\nlong duration = pulseIn(echoPin, HIGH);\nfloat distance = duration * 0.034 / 2;'
      }
    },
    translations: {
      hi: {
        name: 'अल्ट्रासोनिक सेंसर (HC-SR04)',
        shortDesc: 'चमगादड़ की तरह ध्वनि तरंगों से दूरी नापता है!',
        explanation: 'यह सेंसर अल्ट्रासोनिक साउंड वेव भेजकर रुकावट की दूरी पता करता है।'
      },
      ta: {
        name: 'அல்ட்ராசோனிக் சென்சார் (HC-SR04)',
        shortDesc: 'வௌவால்கள் போல ஒலி அலைகளைப் பயன்படுத்தி தூரத்தைக் கணக்கிடுகிறது!',
        explanation: 'ஒலி அலை எதிரொலிக்கும் நேரத்தைக் கொண்டு தூரம் அளவிடப்படுகிறது.'
      },
      mr: {
        name: 'अल्ट्रासॉनिक सेन्सर (HC-SR04)',
        shortDesc: 'ध्वनी लहरी वापरून अंतर मोजणारा सेन्सर!',
        explanation: 'हा सेन्सर आवाजाच्या लाटा पाठवून अडथळ्याचे अंतर शोधतो.'
      },
      te: {
        name: 'అల్ట్రాసోనిక్ సెన్సార్ (HC-SR04)',
        shortDesc: 'గబ్బిలం లాగా శబ్ద తరంగాల ద్వారా దూరాన్ని కొలుస్తుంది!',
        explanation: 'శబ్దము వెళ్ళి తిరిగి వచ్చే సమయాన్ని బట్టి దూరాన్ని లెక్కిస్తుంది.'
      },
      bn: {
        name: 'আল্ট্রাসোনিক সেন্সর (HC-SR04)',
        shortDesc: 'বাদুড়ের মতো শব্দের তরঙ্গ ব্যবহার করে দূরত্ব পরিমাপ করে!',
        explanation: 'সাউন্ড ওয়েভ পাঠিয়ে বস্তুর দূরত্ব নির্ণয় করার সেন্সর।'
      }
    },
    arOverlays: {
      pins: [
        { x: 30, y: 80, label: 'VCC (5V)', desc: 'Power supply input' },
        { x: 45, y: 80, label: 'Trig', desc: 'Sends ultrasonic sound blast' },
        { x: 60, y: 80, label: 'Echo', desc: 'Listens for returning sound echo' },
        { x: 75, y: 80, label: 'GND', desc: 'Ground pin' }
      ],
      signalFlow: 'Trig Pin -> Sound Wave Out (40kHz) -> Hits Object -> Echo Pin Receives Pulse',
      forceType: 'Acoustic Pressure Wave & Echo Timing'
    },
    defaultBlocklyProject: 'obstacle-avoider'
  },
  {
    id: 'esp32-wifi',
    name: 'ESP32 IoT & Wi-Fi Board',
    category: 'Microcontroller',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
    iconName: 'Wifi',
    shortDesc: 'Dual-core wireless microcontroller with Wi-Fi & Bluetooth built-in!',
    grades: {
      grade3_5: {
        title: 'Internet Smart Board',
        explanation: 'Connects your robot directly to the internet! You can control lights from a phone anywhere in the world.',
        funFact: 'It can talk to smart home speakers like Alexa!',
        realWorldAnalogy: 'Like giving your robot its own smartphone.'
      },
      grade6_8: {
        title: 'Wireless IoT Microcontroller',
        explanation: 'ESP32 has built-in Wi-Fi and Bluetooth BLE. It can host local web servers and send sensor data to the cloud.',
        inputOutput: 'Inputs/Outputs: 36 GPIO pins with touch sensitivity, Capacitive Sensors, and DAC outputs.',
        circuitTip: 'Operates at 3.3V logic level — do not feed 5V directly to GPIO pins!'
      },
      grade9_10: {
        title: 'Xtensa Dual-Core 32-bit LX6 Microcontroller',
        explanation: 'Runs at up to 240 MHz with 520 KB SRAM. Supports MQTT protocols for IoT cloud telemetry.',
        specs: ['Processor: Dual-core 240 MHz', 'SRAM: 520 KB', 'Connectivity: Wi-Fi 802.11 b/g/n & Bluetooth 4.2 BLE', 'Logic Level: 3.3V'],
        pinout: [
          { pin: 'GPIO 2', function: 'Onboard LED & PWM pin' },
          { pin: 'GPIO 21 (SDA) / 22 (SCL)', function: 'I2C Bus for displays and IMUs' },
          { pin: 'GPIO 34-39', function: 'Input-only analog pins' },
          { pin: '3V3 & GND', function: '3.3V Regulated Power' }
        ]
      },
      grade11_12: {
        title: 'FreeRTOS Dual-Core IoT & WebServer Node',
        explanation: 'Runs FreeRTOS tasks concurrently across Core 0 (Wi-Fi/Bluetooth stack) and Core 1 (Sensor polling & control logic).',
        ros2Protocol: 'Acts as micro-ROS client node publishing over Wi-Fi UDP socket to ROS2 Master.',
        codeSnippet: '#include <WiFi.h>\nvoid setup() {\n  WiFi.begin("HomeWiFi", "SecretPass");\n  while (WiFi.status() != WL_CONNECTED) delay(500);\n  Serial.println(WiFi.localIP());\n}'
      }
    },
    translations: {
      hi: {
        name: 'ईएसपी32 वाई-फाई बोर्ड (ESP32)',
        shortDesc: 'इनबिल्ट वाई-फाई और ब्लूटूथ वाला स्मार्ट आईओटी बोर्ड!',
        explanation: 'यह बोर्ड रोबोट को इंटरनेट से जोड़ता है और मोबाइल ऐप से कंट्रोल करता है।'
      },
      ta: {
        name: 'ஈஎஸ்பி32 வைஃபை போர்டு (ESP32)',
        shortDesc: 'வைஃபை மற்றும் ப்ளூடூத் வசதியுடன் கூடிய நவீன ஐஓடி போர்டு!',
        explanation: 'இணையத்தின் மூலம் சாதனங்களை இயக்க இது உதவுகிறது.'
      },
      mr: {
        name: 'ईएसपी३२ वाय-फाय बोर्ड (ESP32)',
        shortDesc: 'वाय-फाय आणि ब्लूटूथ असलेला स्मार्ट आयओटी मायक्रोकंट्रोलर!',
        explanation: 'हा बोर्ड इंटरनेटद्वारे उपकरणांना जोडतो.'
      },
      te: {
        name: 'ఈఎస్పీ32 వైఫై బోర్డ్ (ESP32)',
        shortDesc: 'వైఫై మరియు బ్లూటూత్ కలిగిన స్మార్ట్ ఐఓటి బోర్డ్!',
        explanation: 'ఇంటర్నెట్ ద్వారా రోబోలను నియంత్రించడానికి ఉపయోగపడుతుంది.'
      },
      bn: {
        name: 'ইএসপি৩২ ওয়াই-ফাই বোর্ড (ESP32)',
        shortDesc: 'ওয়াই-ফাই এবং ব্লুটুথ সহ স্মার্ট আইওটি মাইক্রোকন্ট্রোলার!',
        explanation: 'ইন্টারনেটের মাধ্যমে রোবট বা স্মার্ট হোম ডিভাইস নিয়ন্ত্রণ করে।'
      }
    },
    arOverlays: {
      pins: [
        { x: 20, y: 30, label: 'Wi-Fi Antenna', desc: '2.4GHz wireless communication' },
        { x: 80, y: 40, label: 'GPIO Pins', desc: '3.3V Digital & Analog I/O' },
        { x: 30, y: 70, label: 'EN / BOOT Buttons', desc: 'Reset & Flash firmware controls' },
        { x: 50, y: 85, label: 'Micro USB Port', desc: 'Serial programming & power input' }
      ],
      signalFlow: 'Cloud MQTT Server <-> Wi-Fi Antenna -> Dual-Core CPU -> GPIO Relays',
      forceType: 'Radio Frequency EM Waves & Digital Logic'
    },
    defaultBlocklyProject: 'smart-home-iot'
  },
  {
    id: 'servo-motor',
    name: 'Micro Servo Motor (SG90)',
    category: 'Actuator',
    imageUrl: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?q=80&w=600&auto=format&fit=crop',
    iconName: 'RotateCw',
    shortDesc: 'Precision motor that turns to an exact angle between 0° and 180°!',
    grades: {
      grade3_5: {
        title: 'Robotic Arm Joint',
        explanation: 'Unlike regular motors that spin continuously, a servo motor rotates to the exact position you choose — like a robotic elbow!',
        funFact: 'Used in steering remote control cars and moving robot fingers!',
        realWorldAnalogy: 'Your steering wheel pointing wheels in an exact direction.'
      },
      grade6_8: {
        title: 'PWM Position Controlled Motor',
        explanation: 'Translates Pulse Width Modulation (PWM) signal timing into rotational position between 0 and 180 degrees.',
        inputOutput: 'Control signal: 50Hz PWM pulse width (1ms = 0°, 1.5ms = 90°, 2ms = 180°).',
        circuitTip: 'Brown/Black wire = GND, Red wire = 5V, Orange/Yellow wire = PWM Signal pin!'
      },
      grade9_10: {
        title: 'Closed-Loop Servomechanism',
        explanation: 'Contains a DC motor, potentiometer position sensor, gear set, and internal feedback control circuit.',
        specs: ['Operating Voltage: 4.8V - 6.0V', 'Torque: 1.8 kg-cm', 'Speed: 0.1 sec / 60 degrees', 'Rotation Angle: 0° to 180°'],
        pinout: [
          { pin: 'Orange Wire', function: 'PWM Signal Input (Pin 9 or 10)' },
          { pin: 'Red Wire', function: 'VCC 5V Power' },
          { pin: 'Brown Wire', function: 'Ground (GND)' }
        ]
      },
      grade11_12: {
        title: 'Angular Position Control & Kinematic Joint',
        explanation: 'Form the active degrees-of-freedom (DoF) in robotic arms and pan-tilt camera gimbals governed by Inverse Kinematics (IK).',
        ros2Protocol: 'Subscribes to std_msgs/Float64 angle command target on /joint_states.',
        codeSnippet: '#include <Servo.h>\nServo myServo;\nvoid setup() {\n  myServo.attach(9);\n}\nvoid loop() {\n  myServo.write(90);\n  delay(1000);\n}'
      }
    },
    translations: {
      hi: {
        name: 'सर्वो मोटर (SG90)',
        shortDesc: 'सटीक कोण (0° से 180°) पर मुड़ने वाली रोबोटिक मोटर!',
        explanation: 'सर्वो मोटर को निश्चित कोण पर घुमाया जा सकता है, जैसे रोबोट का हाथ।'
      },
      ta: {
        name: 'செர்வோ மோட்டார் (SG90)',
        shortDesc: 'துல்லியமான கோணத்தில் (0° - 180°) திரும்பக்கூடிய மோட்டார்!',
        explanation: 'ரோபோடிக் கைகள் மற்றும் கதவுகளைத் திறக்க இது பயன்படுகிறது.'
      },
      mr: {
        name: 'सर्व्हो मोटर (SG90)',
        shortDesc: 'निश्चित कोनात (0° ते 180°) फिरणारी मोटर!',
        explanation: 'रोबोटच्या अवयवांना हलवण्यासाठी सर्व्हो मोटर वापरली जाते.'
      },
      te: {
        name: 'సెర్వో మోటార్ (SG90)',
        shortDesc: 'ఖచ్చితమైన కోణంలో (0° - 180°) తిరిగే మోటార్!',
        explanation: 'రోబోట్ చేతులు మరియు తలుపులు తిప్పడానికి ఇది ఉపయోగపడుతుంది.'
      },
      bn: {
        name: 'সার্ভো মোটর (SG90)',
        shortDesc: 'নির্ভরযোগ্য কোণে (0° থেকে 180°) ঘোরার মোটর!',
        explanation: 'রোবটের হাত বা যৌথ সংযোগ নির্দিষ্ট কোণে নাড়ানোর জন্য ব্যবহৃত হয়।'
      }
    },
    arOverlays: {
      pins: [
        { x: 35, y: 70, label: 'Signal (Orange)', desc: 'PWM control pulse from Arduino' },
        { x: 50, y: 70, label: 'VCC 5V (Red)', desc: 'Power supply line' },
        { x: 65, y: 70, label: 'GND (Brown)', desc: 'Common ground line' }
      ],
      signalFlow: 'PWM Pulse (1-2ms) -> Internal Potentiometer Check -> DC Motor Gear Turn',
      forceType: 'Rotational Torque (1.8 kg-cm) & Closed-loop Feedback'
    },
    defaultBlocklyProject: 'obstacle-avoider'
  },
  {
    id: 'line-follower-sensor',
    name: 'IR Line Tracking Sensor Pair',
    category: 'Sensor',
    imageUrl: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=600&auto=format&fit=crop',
    iconName: 'GitCommit',
    shortDesc: 'Detects black and white surfaces so robots can follow drawn paths!',
    grades: {
      grade3_5: {
        title: 'Track Follower Eyes',
        explanation: 'It shines invisible infrared light down onto the floor. White surfaces reflect light back, while black lines absorb light!',
        funFact: 'Black t-shirts absorb light on sunny days just like black lines do!',
        realWorldAnalogy: 'Like following a painted line on a highway.'
      },
      grade6_8: {
        title: 'IR Reflectance Sensor',
        explanation: 'Uses an IR LED transmitter and Photodiode receiver pair. Outputs LOW on white surfaces and HIGH on black surfaces.',
        inputOutput: 'Output: Digital HIGH/LOW or Analog reflection voltage.',
        circuitTip: 'Use the onboard potentiometer blue dial to calibrate sensitivity for your track!'
      },
      grade9_10: {
        title: 'Phototransistor Reflectivity Sensor',
        explanation: 'Compares reflection intensity against an onboard LM393 voltage comparator IC.',
        specs: ['Operating Voltage: 3.3V - 5V', 'Detection Range: 2cm to 30cm', 'Comparator IC: LM393', 'Output Type: Digital Switch (0/1)'],
        pinout: [
          { pin: 'VCC', function: '3.3V-5V Power' },
          { pin: 'GND', function: 'Ground' },
          { pin: 'OUT', function: 'Digital output signal to Arduino pin' }
        ]
      },
      grade11_12: {
        title: 'Differential Reflectance Array & PID Line Tracking',
        explanation: 'Multiple IR pairs create an error signal for PID (Proportional-Integral-Derivative) differential steering algorithms.',
        ros2Protocol: 'Provides feedback for trajectory tracking control loop on /line_follower/error.',
        codeSnippet: 'int leftIR = digitalRead(2);\nint rightIR = digitalRead(3);\nif(leftIR == LOW && rightIR == HIGH) {\n  turnLeft();\n}'
      }
    },
    translations: {
      hi: {
        name: 'आईआर लाइन ट्रैकिंग सेंसर (IR Sensor)',
        shortDesc: 'काली और सफेद सतह पहचानकर लाइन के ऊपर चलने में मदद करता है!',
        explanation: 'इंफ्रारेड रोशनी से काली रेखा को पहचानकर रोबोट ट्रैक पर चलता है।'
      },
      ta: {
        name: 'ஐஆர் லைன் டிராக்கிங் சென்சார் (IR Sensor)',
        shortDesc: 'கருப்பு மற்றும் வெள்ளை மேற்பரப்பை கண்டறிந்து வழித்துணையாக செயல்படுகிறது!',
        explanation: 'ரோபோ பாதையை விட்டு விலகாமல் செல்ல இது உதவுகிறது.'
      },
      mr: {
        name: 'आयआर लाइन ट्रॅकिंग सेन्सर (IR Sensor)',
        shortDesc: 'काळ्या आणि पांढऱ्या रंगातील फरक ओळखून ट्रॅकवर चालण्यास मदत करतो!',
        explanation: 'इन्फ्रारेड किरणांचा वापर करून रेषा शोधणारा सेन्सर.'
      },
      te: {
        name: 'ఐఆర్ లైన్ ట్రాకింగ్ సెన్సార్ (IR Sensor)',
        shortDesc: 'నలుపు మరియు తెలుపు ఉపరితలాలను గుర్తించి బాటలో నడిపిస్తుంది!',
        explanation: 'ఇన్‌ఫ్రారెడ్ కాంతి ద్వారా లైన్ ట్రాక్ చేసే సెన్సార్.'
      },
      bn: {
        name: 'আইআর লাইন ট্র্যাকিং সেন্সর (IR Sensor)',
        shortDesc: 'কালো ও সাদা পৃষ্ঠ চিনতে পেরে লাইন অনুসরণ করে রোবটকে চালায়!',
        explanation: 'ইনফ্রারেড আলো প্রতিফলনের মাধ্যমে লাইনের উপর রোবট চালায়।'
      }
    },
    arOverlays: {
      pins: [
        { x: 30, y: 75, label: 'VCC (5V)', desc: 'Power supply input' },
        { x: 50, y: 75, label: 'GND', desc: 'Ground line' },
        { x: 70, y: 75, label: 'OUT', desc: 'Reflectance state signal (0 or 1)' }
      ],
      signalFlow: 'IR Emitter LED -> Floor Reflection -> Photodiode Sensor -> LM393 IC -> Arduino Pin',
      forceType: 'Infrared Optical Reflectance'
    },
    defaultBlocklyProject: 'line-follower'
  }
];
