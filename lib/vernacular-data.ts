// Vernacular STEM In-Depth Audio Glossary & 2-Minute Masterclass Scripts in 6 Languages
// Covers ALL 10 STEM Hardware Components aligned with NEP 2020 & Atal Tinkering Labs (ATL)

export interface VernacularTerm {
  componentId: string;
  englishTerm: string;
  category: string;
  shortSummary: string;
  translations: Record<
    'en' | 'hi' | 'ta' | 'mr' | 'te' | 'bn',
    {
      term: string;
      shortDesc: string;
      inDepthScript: string; // Comprehensive 2-Minute In-Depth Masterclass Script
    }
  >;
}

export const VERNACULAR_DICTIONARY: VernacularTerm[] = [
  {
    componentId: 'arduino-uno',
    englishTerm: 'Arduino UNO R3 Microcontroller',
    category: 'Hardware Core',
    shortSummary: 'The master robot brain based on ATmega328P executing digital/analog I/O code loops.',
    translations: {
      en: {
        term: 'Arduino UNO R3 Microcontroller',
        shortDesc: 'The master robot brain based on ATmega328P executing digital/analog I/O code loops.',
        inDepthScript: 'Welcome to the 2-Minute Masterclass on the Arduino UNO R3! The Arduino UNO is the world’s most popular open-source microcontroller board. At its core is the ATmega328P 8-bit processor operating at 16 megahertz. Think of it as the central brain of your robot. It features 14 Digital Input and Output pins, numbered 0 to 13. Pins 3, 5, 6, 9, 10, and 11 support Pulse Width Modulation for precise motor speed control. It also features 6 Analog Input pins, A0 through A5, which read continuous sensor voltages between 0 and 5 Volts. To wire the board safely, connect VCC to 5 Volts and GND to common Ground. Never apply more than 5 Volts directly to the digital pins, or you risk burning the ATmega chip. In Kinetic Canvas, you can program Arduino using visual blocks or C++ setup and loop code. Arduino is used globally in smart agriculture, automated rovers, home automation, and industrial robotics!'
      },
      hi: {
        term: 'माइक्रोकंट्रोलर (अर्डुइनो यूनो R3)',
        shortDesc: 'यह रोबोट का मुख्य दिमाग है जो आपके द्वारा लिखे गए कोड निर्देशों को निष्पादित करता है।',
        inDepthScript: 'अर्डुइनो यूनो R3 के 2-मिनट मास्टरक्लास में आपका स्वागत है! अर्डुइनो यूनो रोबोटिक्स का सबसे मुख्य दिमाग है। इसमें ATmega328P माइक्रोप्रोसेसर लगा होता है जो 16 मेगाहर्ट्ज की गति पर काम करता है। इसमें 14 डिजिटल पिन होते हैं, जिनमें से पिन 3, 5, 6, 9, 10 और 11 पल्स विड्थ मॉड्यूलेशन द्वारा मोटर की गति को नियंत्रित करते हैं। इसमें 6 एनालॉग इनपुट पिन A0 से A5 भी होते हैं जो सेंसर के वोल्टेज को मापते हैं। बोर्ड को पावर देने के लिए 5 वोल्ट VCC और ग्राउंड GND पिन का उपयोग करें। डिजिटल पिन पर 5 वोल्ट से अधिक सप्लाई न दें ताकि चिप सुरक्षित रहे। Kinetic Canvas में आप इसे विजुअल ब्लॉक या C++ कोड द्वारा प्रोग्राम कर सकते हैं। इसका उपयोग स्मार्ट खेती, ऑटोमैटिक रोवर और होम ऑटोमेशन में किया जाता है!'
      },
      ta: {
        term: 'அர்டுயினோ யூனோ R3 நுண்கட்டுப்படுத்தி',
        shortDesc: 'இது ரோபோட்டின் முதன்மை மூளையாகும், இது உங்கள் குறியீட்டு வழிமுறைகளை செயல்படுத்துகிறது.',
        inDepthScript: 'அர்டுயினோ யூனோ R3 பற்றிய 2 நிமிட விரிவான பாடத்திற்கு வரவேற்கிறோம்! அர்டுயினோ யூனோ என்பது ரோபோட்டிக்ஸ் துறையில் மிகவும் பிரபலமான நுண்கட்டுப்படுத்தி பலகையாகும். இதன் மையத்தில் ATmega328P செயலி 16 மெகாஹெர்ட்ஸ் வேகத்தில் இயங்குகிறது. இதில் 14 டிஜிட்டல் ஊசிகள் உள்ளன. இதில் உள்ள 6 அனலாக் ஊசிகள் A0 முதல் A5 வரை சென்சார் மின்னழுத்தத்தை அளவிடுகின்றன. பலகைக்கு 5 வோல்ட் VCC மற்றும் GND ஊசிகளை சரியாக இணைக்கவும். Kinetic Canvas மூலம் நீங்கள் காட்சி தொகுதிகள் அல்லது C++ குறியீடு கொண்டு இதை எளிதாக நிரலாக்கலாம். இது தானியங்கி ரோபர்கள் மற்றும் ஸ்மார்ட் வீடுகளில் பயன்படுத்தப்படுகிறது!'
      },
      mr: {
        term: 'अर्डुइनो युनो R3 मायक्रोकंट्रोलर',
        shortDesc: 'हे रोबोटचे मुख्य मेंदू आहे जे तुमच्या कोड सूचना अंमलात आणते.',
        inDepthScript: 'अर्डुइनो युनो R3 च्या २-मिनिटांच्या सखोल धड्यात आपले स्वागत आहे! अर्डुइनो युनो हे रोबोटिक्सचे मुख्य मेंदू आहे. यामध्ये ATmega328P मायक्रोप्रोसेसर १६ मेगाहर्ट्झ वेगाने कार्य करतो. यामध्ये १४ डिजिटल पिन आणि ६ ॲनालॉग पिन A0 ते A5 आहेत. पिन ३, ५, ६, ९, १० आणि ११ मोटारचा वेग नियंत्रित करण्यासाठी वापरल्या जातात. बोर्डला पॉवर देण्यासाठी ५ व्होल्ट VCC आणि GND वापरा. Kinetic Canvas मध्ये तुम्ही व्हिज्युअल ब्लॉक किंवा C++ द्वारे कोड लिहू शकता. याचा वापर शेती तंत्रज्ञान आणि ऑटोमेशनमध्ये मोठ्या प्रमाणात होतो!'
      },
      te: {
        term: 'అర్డుయినో యూనో R3 మైక్రోకంట్రోలర్',
        shortDesc: 'ఇది రోబోట్ యొక్క ప్రధాన మెదడు, ఇది మీ కోడ్ సూచనలను అమలు చేస్తుంది.',
        inDepthScript: 'అర్డుయినో యూనో R3 యొక్క 2-నిమిషాల సమగ్ర పాఠానికి స్వాగతం! అర్డుయినో యూనో రోబోటిక్స్ యొక్క ప్రధాన మెదడు. ఇందులో ATmega328P మైక్రోప్రాసెసర్ 16 మెగాహెర్ట్జ్ వేగంతో పనిచేస్తుంది. ఇందులో 14 డిజిటల్ పిన్లు మరియు 6 అనాలాగ్ పిన్లు A0 నుండి A5 వరకు ఉంటాయి. బోర్డుకు విద్యుత్ ఇవ్వడానికి 5 వోల్ట్ల VCC మరియు GND పిన్లను వాడండి. Kinetic Canvas ద్వారా మీరు విజువల్ బ్లాక్స్ లేదా C++ కోడ్‌తో దీనిని ప్రోగ్రామ్ చేయవచ్చు!'
      },
      bn: {
        term: 'আর্ডুইনো ইউনো R3 মাইক্রোকন্ট্রোলার',
        shortDesc: 'এটি রোবটের মূল মস্তিষ্ক যা আপনার লেখা কোড নির্দেশাবলী সম্পাদন করে।',
        inDepthScript: 'আর্ডুইনো ইউনো R3-এর ২-মিনিটের সবিস্তার পাঠে আপনাকে স্বাগতম! আর্ডুইনো ইউনো হল রোবোটিক্সের মূল মস্তিষ্ক। এর কেন্দ্রে রয়েছে ATmega328P প্রসেসর যা ১৬ মেগাহার্টজ গতিতে কাজ করে। এতে ১৪টি ডিজিটাল পিন এবং ৬টি অ্যানালগ পিন A0 থেকে A5 রয়েছে। বোর্ড চালুর জন্য ৫ ভোল্ট VCC এবং GND পিন ব্যবহার করুন। Kinetic Canvas-এ আপনি ভিজ্যুয়াল ব্লক বা C++ কোডের মাধ্যমে এটি প্রোগ্রাম করতে পারেন!'
      }
    }
  },
  {
    componentId: 'ultrasonic-hcsr04',
    englishTerm: 'HC-SR04 Ultrasonic Distance Sensor',
    category: 'Sensory Input',
    shortSummary: 'Measures distances 2cm–400cm using 40kHz ultrasonic echolocation sound pulses.',
    translations: {
      en: {
        term: 'HC-SR04 Ultrasonic Distance Sensor',
        shortDesc: 'Measures distances 2cm–400cm using 40kHz ultrasonic echolocation sound pulses.',
        inDepthScript: 'Welcome to the 2-Minute Masterclass on the HC-SR04 Ultrasonic Distance Sensor! This sensor operates using echolocation, just like bats. It emits a high-frequency 40 kilohertz ultrasonic sound wave from its Transmitter cone. When the sound pulse hits an obstacle, it bounces back and is received by the Receiver cone. The sensor calculates distance using the speed of sound, which is 340 meters per second. The HC-SR04 has 4 pins: VCC connects to 5 Volts DC, GND connects to Ground, Trig receives a 10-microsecond high pulse to trigger the sound wave, and Echo stays HIGH for the duration of time it took for the sound wave to travel back. The formula to calculate distance in centimeters is duration multiplied by 0.034 divided by 2. In Kinetic Canvas, you can use ultrasonic reading blocks to build obstacle avoidance rovers, automatic water level monitors, and parking radar systems!'
      },
      hi: {
        term: 'अल्ट्रासोनिक दूरी सेंसर (HC-SR04)',
        shortDesc: 'यह 40kHz ध्वनि तरंगें भेजकर 2 सेमी से 400 सेमी तक की दूरी मापता है।',
        inDepthScript: 'HC-SR04 अल्ट्रासोनिक दूरी सेंसर के मास्टरक्लास में आपका स्वागत है! यह सेंसर चमगादड़ की तरह ध्वनि तरंगों का उपयोग करके दूरी मापता है। इसका ट्रांसमीटर 40 किलोहर्ट्ज़ की ध्वनि तरंग छोड़ता है, जो बाधा से टकराकर वापस आती है और रिसीवर द्वारा पकड़ी जाती है। इसमें 4 पिन होते हैं: VCC 5V पावर के लिए, GND ग्राउंड के लिए, Trig ध्वनि तरंग शुरू करने के लिए, और Echo ध्वनि वापस आने का समय मापने के लिए। Kinetic Canvas में आप इसका उपयोग ऑब्स्टैकल अवॉइडेंस रोबोट और ऑटोमैटिक पार्किंग सिस्टम बनाने के लिए कर सकते हैं!'
      },
      ta: {
        term: 'HC-SR04 அல்ட்ராசோனிக் தூர சென்சார்',
        shortDesc: 'இது 40kHz ஒலி அலைகளை அனுப்பி 2செ.மீ முதல் 400செ.மீ வரையிலான தூரத்தை அளவிடுகிறது.',
        inDepthScript: 'HC-SR04 அல்ட்ராசோனிக் சென்சார் பற்றிய விரிவான பாடத்திற்கு வரவேற்கிறோம்! இந்த சென்சார் வௌவால்களைப் போல ஒலி அலைகளைப் பயன்படுத்தி தூரத்தைக் கணக்கிடுகிறது. இது 40 கிலோஹெர்ட்ஸ் ஒலி அலையை வெளிப்படுத்துகிறது. இதில் VCC, GND, Trig மற்றும் Echo என 4 ஊசிகள் உள்ளன. Trig ஊசி அலையைத் தொடங்குகிறது, Echo ஊசி அலையின் நேரத்தை அளவிடுகிறது. இதைக்கொண்டு தானியங்கி ரோபோக்களை எளிதாக உருவாக்கலாம்!'
      },
      mr: {
        term: 'HC-SR04 अल्ट्रासोनिक डिस्टन्स सेन्सर',
        shortDesc: 'हे ध्वनी लहरी पाठवून २ सेमी ते ४०० सेमी मधील अंतर मोजते.',
        inDepthScript: 'HC-SR04 अल्ट्रासोनिक सेन्सरच्या धड्यात आपले स्वागत आहे! हा सेन्सर ध्वनी लहरींचा वापर करून अंतर मोजतो. ट्रान्समिटर ४० किलोहर्ट्झचा आवाज सोडतो आणि रिसीवर तो परत पकडतो. यामध्ये VCC, GND, Trig आणि Echo हे ४ पिन असतात. Kinetic Canvas मध्ये याचा वापर अडथळे टाळणारे रोबोट बनवण्यासाठी होतो!'
      },
      te: {
        term: 'HC-SR04 అల్ట్రాసోనిక్ డిస్టెన్స్ సెన్సార్',
        shortDesc: 'ఇది ధ్వని తరంగాలను పంపి 2సెం.మీ నుండి 400సెం.మీ దూరాన్ని కొలుస్తుంది.',
        inDepthScript: 'HC-SR04 అల్ట్రాసోనిక్ సెన్సార్ పాఠానికి స్వాగతం! ఈ సెన్సార్ ధ్వని తరంగాల ద్వారా దూరాన్ని కొలుస్తుంది. ఇందులో VCC, GND, Trig మరియు Echo అనే 4 పిన్లు ఉంటాయి. రోబోటిక్స్ మరియు ఆటోమేటిక్ పార్కింగ్ సిస్టమ్స్‌లో ఇది చాలా కీలకమైనది!'
      },
      bn: {
        term: 'HC-SR04 আল্ট্রাসনিক ডিস্টেন্স সেন্সর',
        shortDesc: 'এটি শব্দ তরঙ্গ পাঠিয়ে ২ সেমি থেকে ৪০০ সেমি দূরত্ব পরিমাপ করে।',
        inDepthScript: 'HC-SR04 আল্ট্রাসনিক সেন্সরের পাঠে স্বাগতম! এই সেন্সরটি শব্দ তরঙ্গের সাহায্যে বাধা পরিমাপ করে। এতে VCC, GND, Trig এবং Echo ৪টি পিন থাকে। Kinetic Canvas-এ বাধা এড়ানো রোবট তৈরিতে এটি অত্যন্ত ব্যবহৃত হয়!'
      }
    }
  },
  {
    componentId: 'servo-sg90',
    englishTerm: 'SG90 Micro Servo Motor',
    category: 'Actuation',
    shortSummary: 'Rotates 0° to 180° with high precision using PWM square wave pulse timing control.',
    translations: {
      en: {
        term: 'SG90 Micro Servo Motor (9g)',
        shortDesc: 'Rotates 0° to 180° with high precision using PWM square wave pulse timing control.',
        inDepthScript: 'Welcome to the Masterclass on the SG90 Micro Servo Motor! The SG90 is a lightweight 9-gram motor that provides exact angular position control between 0 and 180 degrees. Inside the casing is a small DC motor, a gearbox for high torque, and a potentiometer feedback circuit. It is controlled using Pulse Width Modulation at a 50 Hertz refresh rate. A pulse width of 1 millisecond turns the horn to 0 degrees, 1.5 milliseconds centers it at 90 degrees, and 2 milliseconds rotates it to 180 degrees. The servo has 3 wires: Red connects to 5 Volts power, Brown connects to Ground, and Orange connects to a PWM-enabled digital pin like Pin 6. Never force the servo horn past its 180-degree physical stop to avoid stripping the internal plastic gears. Servo motors are essential for steering robotic vehicles, moving radar scanners, and controlling robotic arms!'
      },
      hi: {
        term: 'SG90 माइक्रो सर्वो मोटर (9g)',
        shortDesc: 'यह PWM पल्स टाइमिंग द्वारा 0 से 180 डिग्री तक सटीक कोण पर घूमती है।',
        inDepthScript: 'SG90 सर्वो मोटर के 2-मिनट मास्टरक्लास में आपका स्वागत है! यह 9 ग्राम की मोटर 0 से 180 डिग्री तक सटीक कोण पर घूमती है। इसके अंदर गियरबॉक्स और सर्किट लगा होता है। इसमें 3 तार होते हैं: लाल तार 5V पावर के लिए, भूरा तार ग्राउंड के लिए, और नारंगी तार PWM सिग्नल पिन 6 के लिए। Kinetic Canvas में सर्वो ब्लॉक का उपयोग करके आप रोबोटिक आर्म, राडार स्कैनर और स्टेयरिंग कंट्रोल बना सकते हैं!'
      },
      ta: {
        term: 'SG90 மைக்ரோ செர்வோ மோட்டார்',
        shortDesc: 'இது PWM சிக்னல் மூலம் 0 முதல் 180 டிகிரி வரை துல்லியமாக சுழலும்.',
        inDepthScript: 'SG90 செர்வோ மோட்டார் பற்றிய பாடத்திற்கு வரவேற்கிறோம்! இது 0 முதல் 180 டிகிரி வரை துல்லியமாக சுழலும் மோட்டாராகும். இதில் சிவப்பு (5V), பழுப்பு (GND), மற்றும் ஆரஞ்சு (PWM) என 3 கம்பிகள் உள்ளன. ரோபோ கரங்கள் மற்றும் ரேடார் அமைப்புகளுக்கு இது பயன்படுகிறது!'
      },
      mr: {
        term: 'SG90 मायक्रो सर्व्हो मोटर',
        shortDesc: 'हे PWM सिग्नलद्वारे ० ते १८० अंश कोनात अचूक फिरते.',
        inDepthScript: 'SG90 सर्व्हो मोटरच्या सखोल धड्यात आपले स्वागत आहे! ही मोटर ० ते १८० अंशात अचूक फिरते. यामध्ये लाल (५V), तपकिरी (GND) आणि नारंगी (PWM) हे ३ वायर असतात. याचा वापर रोबोटिक हात आणि राडार बनवण्यासाठी होतो!'
      },
      te: {
        term: 'SG90 మైక్రో సెర్వో మోటార్',
        shortDesc: 'ఇది PWM సిగ్నల్ ద్వారా 0 నుండి 180 డిగ్రీల కోణంలో కదులుతుంది.',
        inDepthScript: 'SG90 సెర్వో మోటార్ పాఠానికి స్వాగతం! ఇది 0 నుండి 180 డిగ్రీల వరకు కచ్చితంగా తిరిగే మోటార్. ఇందులో ఎరుపు (5V), గోధుమ (GND) మరియు ఆరంజ్ (PWM) 3 వైర్లు ఉంటాయి.'
      },
      bn: {
        term: 'SG90 মাইক্রো সার্ভো মোটর',
        shortDesc: 'এটি PWM সিগন্যাল দ্বারা ০ থেকে ১৮০ ডিগ্রি কোণে নির্ভুলভাবে ঘোরে।',
        inDepthScript: 'SG90 সার্ভো মোটরের পাঠে স্বাগতম! এটি ০ থেকে ১৮০ ডিগ্রি কোণে ঘোরে। এতে লাল (5V), বাদামী (GND) এবং কমলা (PWM) ৩টি তার থাকে।'
      }
    }
  }
];
