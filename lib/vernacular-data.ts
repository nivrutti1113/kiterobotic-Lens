// Vernacular Audio STEM Technical Glossary in 6 Indian Languages
// Aligned with NEP 2020 Vernacular Medium & Atal Tinkering Labs (ATL) Curriculum Guidelines

export interface VernacularTerm {
  englishTerm: string;
  category: string;
  translations: {
    hi: { term: string; explanation: string };
    ta: { term: string; explanation: string };
    mr: { term: string; explanation: string };
    te: { term: string; explanation: string };
    bn: { term: string; explanation: string };
  };
}

export const VERNACULAR_DICTIONARY: VernacularTerm[] = [
  {
    englishTerm: 'Microcontroller',
    category: 'Hardware Core',
    translations: {
      hi: { term: 'माइक्रोकंट्रोलर', explanation: 'यह रोबोट का छोटा दिमाग है जो आपके लिखे गए कोड निर्देशों को निष्पादित करता है।' },
      ta: { term: 'நுண்கட்டுப்படுத்தி', explanation: 'இது ரோபோட்டின் சிறிய மூளையாகும், இது உங்கள் குறியீட்டு வழிமுறைகளை செயல்படுத்துகிறது.' },
      mr: { term: 'मायक्रोकंट्रोलर', explanation: 'हे रोबोटचे लहान मेंदू आहे जे तुमच्या कोड सूचना अंमलात आणते.' },
      te: { term: 'మైక్రోకంట్రోలర్', explanation: 'ఇది రోబోట్ యొక్క చిన్న మెదడు, ఇది మీ కోడ్ సూచనలను అమలు చేస్తుంది.' },
      bn: { term: 'মাইক্রোকন্ট্রোলার', explanation: 'এটি রোবটের ছোট মস্তিষ্ক যা আপনার লেখা কোড নির্দেশাবলী সম্পাদন করে।' },
    }
  },
  {
    englishTerm: 'Ultrasonic Sensor',
    category: 'Sensory Input',
    translations: {
      hi: { term: 'अल्ट्रासोनिक सेंसर', explanation: 'यह चमगादड़ की तरह ध्वनि तरंगें भेजकर बाधाओं की दूरी मापता है।' },
      ta: { term: 'அல்ட்ராசோனிக் சென்சார்', explanation: 'இது வௌவால்களைப் போல ஒலி அலைகளை அனுப்பி தடைகளின் தூரத்தை அளவிடுகிறது.' },
      mr: { term: 'अल्ट्रासोनिक सेन्सर', explanation: 'हे वटवाघळांप्रमाणे ध्वनी लहरी पाठवून अडथळ्यांचे अंतर मोजते.' },
      te: { term: 'అల్ట్రాసోనిక్ సెన్సార్', explanation: 'ఇది గబ్బిలాల లాగా ధ్వని తరంగాలను పంపి అడ్డంకుల దూరాన్ని కొలుస్తుంది.' },
      bn: { term: 'আল্ট্রাসনিক সেন্সর', explanation: 'এটি বাদুড়ের মতো শব্দ তরঙ্গ পাঠিয়ে বাধাগুলির দূরত্ব পরিমাপ করে।' },
    }
  },
  {
    englishTerm: 'Pulse Width Modulation (PWM)',
    category: 'Actuation',
    translations: {
      hi: { term: 'पल्स विड्थ मॉड्यूलेशन (PWM)', explanation: 'वोल्टेज को तेज़ी से चालू और बंद करके मोटर की गति को नियंत्रित करने की तकनीक।' },
      ta: { term: 'பல்ஸ் அகல மாடுலேஷன் (PWM)', explanation: 'மின்னழுத்தத்தை விரைவாக ஆன்/ஆஃப் செய்து மோட்டார் வேகத்தைக் கட்டுப்படுத்தும் தொழில்நுட்பம்.' },
      mr: { term: 'पल्स विड्थ मॉड्युलेशन (PWM)', explanation: 'व्होल्टेज वेगाने चालू/बंद करून मोटरचा वेग नियंत्रित करण्याचे तंत्रज्ञान.' },
      te: { term: 'పల్స్ విడ్త్ మోడ్యులేషన్ (PWM)', explanation: 'వోల్టేజ్‌ను వేగంగా ఆన్ మరియు ఆఫ్ చేయడం ద్వారా మోటార్ వేగాన్ని నియంత్రించే సాంకేతికత.' },
      bn: { term: 'পালস উইডথ মডিউলেশন (PWM)', explanation: 'ভোল্টেজ দ্রুত অন এবং অফ করে মোটরের গতি নিয়ন্ত্রণ করার প্রযুক্তি।' },
    }
  }
];
