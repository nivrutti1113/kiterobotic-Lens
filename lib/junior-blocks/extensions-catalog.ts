import { BlockDefinition } from './types';

export type ExtensionSection = {
  sectionLabel: string;
  items: BlockDefinition[];
};

export type ExtensionItem = {
  id: string;
  name: string;
  description: string;
  categoryTags: string[];
  requiresHardware?: string[];
  isNew?: boolean;
  thumbnailBg: string;
  iconColor: string;
  blockCategoryColor: string;
  iconGlyph: string;
  sections: ExtensionSection[];
};

export const EXTENSION_CATALOG: ExtensionItem[] = [
  // 1. QR Code Scanner
  {
    id: "qr-code-scanner",
    name: "QR Code Scanner",
    description: "Detect and identify QR Codes live from stage camera",
    categoryTags: ["AI & ML", "Games & Animation"],
    requiresHardware: ["wifi"],
    isNew: true,
    thumbnailBg: "#3fc9a8",
    iconColor: "#c0392b",
    blockCategoryColor: "#c0392b",
    iconGlyph: "📷",
    sections: [
      {
        sectionLabel: "Settings",
        items: [
          {
            type: "qr_turn_video",
            category: "ext_qr-code-scanner",
            shape: "stack",
            label: "Turn {state} video on stage with {transparency}% transparency",
            color: "#c0392b",
            inputs: {
              state: { name: "state", type: "select", defaultValue: "on", options: [{ label: "on", value: "on" }, { label: "off", value: "off" }] },
              transparency: { name: "transparency", type: "number", defaultValue: 0 },
            },
          },
          {
            type: "qr_show_box",
            category: "ext_qr-code-scanner",
            shape: "stack",
            label: "{visibility} bounding box",
            color: "#c0392b",
            inputs: {
              visibility: { name: "visibility", type: "select", defaultValue: "show", options: [{ label: "show", value: "show" }, { label: "hide", value: "hide" }] },
            },
          },
        ],
      },
      {
        sectionLabel: "Analyse Image",
        items: [
          {
            type: "qr_analyse_camera",
            category: "ext_qr-code-scanner",
            shape: "stack",
            label: "Analyse image for QR code from camera",
            color: "#c0392b",
          },
          {
            type: "qr_is_detected",
            category: "ext_qr-code-scanner",
            shape: "boolean",
            label: "Is QR code detected?",
            color: "#c0392b",
          },
          {
            type: "qr_get_data",
            category: "ext_qr-code-scanner",
            shape: "reporter",
            label: "Get QR code data",
            color: "#c0392b",
            hasCheckbox: true,
          },
          {
            type: "qr_get_position",
            category: "ext_qr-code-scanner",
            shape: "reporter",
            label: "{coord} position of {point}",
            color: "#c0392b",
            hasCheckbox: true,
            inputs: {
              coord: { name: "coord", type: "select", defaultValue: "x", options: [{ label: "x", value: "x" }, { label: "y", value: "y" }] },
              point: { name: "point", type: "select", defaultValue: "center", options: [{ label: "center", value: "center" }, { label: "corner", value: "corner" }] },
            },
          },
          {
            type: "qr_get_angle",
            category: "ext_qr-code-scanner",
            shape: "reporter",
            label: "Get QR angle",
            color: "#c0392b",
            hasCheckbox: true,
          },
        ],
      },
    ],
  },

  // 2. Face Detection
  {
    id: "face-detection",
    name: "Face Detection",
    description: "Detect human faces, expressions, and landmark coordinates",
    categoryTags: ["AI & ML"],
    requiresHardware: ["wifi"],
    isNew: true,
    thumbnailBg: "#f59e0b",
    iconColor: "#d97706",
    blockCategoryColor: "#d97706",
    iconGlyph: "😀",
    sections: [
      {
        sectionLabel: "Settings",
        items: [
          {
            type: "face_turn_video",
            category: "ext_face-detection",
            shape: "stack",
            label: "Turn {state} video on stage with {transparency}% transparency",
            color: "#d97706",
            inputs: {
              state: { name: "state", type: "select", defaultValue: "on", options: [{ label: "on", value: "on" }, { label: "off", value: "off" }] },
              transparency: { name: "transparency", type: "number", defaultValue: 0 },
            },
          },
          {
            type: "face_show_bounding_box",
            category: "ext_face-detection",
            shape: "stack",
            label: "{visibility} face bounding box",
            color: "#d97706",
            inputs: {
              visibility: { name: "visibility", type: "select", defaultValue: "show", options: [{ label: "show", value: "show" }, { label: "hide", value: "hide" }] },
            },
          },
        ],
      },
      {
        sectionLabel: "Analyse Image",
        items: [
          {
            type: "face_analyse_camera",
            category: "ext_face-detection",
            shape: "stack",
            label: "Analyse image for face from camera",
            color: "#d97706",
          },
          {
            type: "face_is_detected",
            category: "ext_face-detection",
            shape: "boolean",
            label: "Is face detected?",
            color: "#d97706",
          },
          {
            type: "face_count",
            category: "ext_face-detection",
            shape: "reporter",
            label: "Get # faces detected",
            color: "#d97706",
            hasCheckbox: true,
          },
          {
            type: "face_expression",
            category: "ext_face-detection",
            shape: "reporter",
            label: "Get expression of face {index}",
            color: "#d97706",
            hasCheckbox: true,
            inputs: {
              index: { name: "index", type: "number", defaultValue: 1 },
            },
          },
          {
            type: "face_coord",
            category: "ext_face-detection",
            shape: "reporter",
            label: "Get {coord} position of face {index}",
            color: "#d97706",
            hasCheckbox: true,
            inputs: {
              coord: { name: "coord", type: "select", defaultValue: "x", options: [{ label: "x", value: "x" }, { label: "y", value: "y" }] },
              index: { name: "index", type: "number", defaultValue: 1 },
            },
          },
        ],
      },
    ],
  },

  // 3. Object Detection
  {
    id: "object-detection",
    name: "Object Detection",
    description: "Detect 80+ everyday objects like cars, dogs, chairs, and balls",
    categoryTags: ["AI & ML"],
    requiresHardware: ["wifi"],
    isNew: false,
    thumbnailBg: "#0d9488",
    iconColor: "#0f766e",
    blockCategoryColor: "#0f766e",
    iconGlyph: "📦",
    sections: [
      {
        sectionLabel: "Settings",
        items: [
          {
            type: "obj_turn_video",
            category: "ext_object-detection",
            shape: "stack",
            label: "Turn {state} video on stage",
            color: "#0f766e",
            inputs: {
              state: { name: "state", type: "select", defaultValue: "on", options: [{ label: "on", value: "on" }, { label: "off", value: "off" }] },
            },
          },
        ],
      },
      {
        sectionLabel: "Detection",
        items: [
          {
            type: "obj_analyse",
            category: "ext_object-detection",
            shape: "stack",
            label: "Analyse image for objects from camera",
            color: "#0f766e",
          },
          {
            type: "obj_is_detected",
            category: "ext_object-detection",
            shape: "boolean",
            label: "Is object {class} detected?",
            color: "#0f766e",
            inputs: {
              class: { name: "class", type: "select", defaultValue: "person", options: [{ label: "person", value: "person" }, { label: "car", value: "car" }, { label: "cup", value: "cup" }, { label: "laptop", value: "laptop" }] },
            },
          },
          {
            type: "obj_count",
            category: "ext_object-detection",
            shape: "reporter",
            label: "Get # objects detected",
            color: "#0f766e",
            hasCheckbox: true,
          },
          {
            type: "obj_class_name",
            category: "ext_object-detection",
            shape: "reporter",
            label: "Get class of object {index}",
            color: "#0f766e",
            hasCheckbox: true,
            inputs: {
              index: { name: "index", type: "number", defaultValue: 1 },
            },
          },
        ],
      },
    ],
  },

  // 4. Human Body Detection
  {
    id: "body-detection",
    name: "Human Body Detection",
    description: "Track 17 skeletal body joints and hand gestures in real-time",
    categoryTags: ["AI & ML", "Robots"],
    requiresHardware: ["wifi"],
    isNew: true,
    thumbnailBg: "#1e3a8a",
    iconColor: "#1d4ed8",
    blockCategoryColor: "#1d4ed8",
    iconGlyph: "🧍",
    sections: [
      {
        sectionLabel: "Settings & Pose",
        items: [
          {
            type: "body_analyse",
            category: "ext_body-detection",
            shape: "stack",
            label: "Analyse image for {mode} pose from camera",
            color: "#1d4ed8",
            inputs: {
              mode: { name: "mode", type: "select", defaultValue: "body", options: [{ label: "body", value: "body" }, { label: "hand", value: "hand" }] },
            },
          },
          {
            type: "body_is_pose",
            category: "ext_body-detection",
            shape: "boolean",
            label: "Is body pose detected?",
            color: "#1d4ed8",
          },
          {
            type: "body_landmark_coord",
            category: "ext_body-detection",
            shape: "reporter",
            label: "Get {coord} of landmark {joint}",
            color: "#1d4ed8",
            hasCheckbox: true,
            inputs: {
              coord: { name: "coord", type: "select", defaultValue: "x", options: [{ label: "x", value: "x" }, { label: "y", value: "y" }] },
              joint: { name: "joint", type: "select", defaultValue: "nose", options: [{ label: "nose", value: "nose" }, { label: "left wrist", value: "left_wrist" }, { label: "right wrist", value: "right_wrist font-bold" }] },
            },
          },
        ],
      },
    ],
  },

  // 5. ChatGPT AI
  {
    id: "chatgpt",
    name: "ChatGPT AI",
    description: "Connect to OpenAI ChatGPT LLM to ask questions and generate story responses",
    categoryTags: ["AI & ML"],
    requiresHardware: ["wifi"],
    isNew: true,
    thumbnailBg: "#059669",
    iconColor: "#047857",
    blockCategoryColor: "#047857",
    iconGlyph: "🤖",
    sections: [
      {
        sectionLabel: "OpenAI Setup",
        items: [
          {
            type: "gpt_set_key",
            category: "ext_chatgpt",
            shape: "stack",
            label: "Set API key {key}",
            color: "#047857",
            inputs: {
              key: { name: "key", type: "text", defaultValue: "sk-..." },
            },
          },
          {
            type: "gpt_set_persona",
            category: "ext_chatgpt",
            shape: "stack",
            label: "Set persona to {persona}",
            color: "#047857",
            inputs: {
              persona: { name: "persona", type: "text", defaultValue: "Friendly Robot Tutor" },
            },
          },
        ],
      },
      {
        sectionLabel: "Prompting",
        items: [
          {
            type: "gpt_ask",
            category: "ext_chatgpt",
            shape: "stack",
            label: "Ask ChatGPT {prompt}",
            color: "#047857",
            inputs: {
              prompt: { name: "prompt", type: "text", defaultValue: "Tell me a joke about robots!" },
            },
          },
          {
            type: "gpt_response",
            category: "ext_chatgpt",
            shape: "reporter",
            label: "Get ChatGPT response",
            color: "#047857",
            hasCheckbox: true,
          },
        ],
      },
    ],
  },

  // 6. Text Recognition (OCR)
  {
    id: "text-recognition",
    name: "Text Recognition",
    description: "Read printed or handwritten text directly from the camera feed",
    categoryTags: ["AI & ML"],
    requiresHardware: ["wifi"],
    isNew: false,
    thumbnailBg: "#4f46e5",
    iconColor: "#4338ca",
    blockCategoryColor: "#4338ca",
    iconGlyph: "🔤",
    sections: [
      {
        sectionLabel: "OCR Processing",
        items: [
          {
            type: "ocr_analyse",
            category: "ext_text-recognition",
            shape: "stack",
            label: "Analyse text from camera",
            color: "#4338ca",
          },
          {
            type: "ocr_is_detected",
            category: "ext_text-recognition",
            shape: "boolean",
            label: "Is text detected?",
            color: "#4338ca",
          },
          {
            type: "ocr_get_text",
            category: "ext_text-recognition",
            shape: "reporter",
            label: "Get recognized text",
            color: "#4338ca",
            hasCheckbox: true,
          },
        ],
      },
    ],
  },

  // 7. Speech Recognition
  {
    id: "speech-recognition",
    name: "Speech Recognition",
    description: "Convert student voice microphone input into text commands",
    categoryTags: ["AI & ML"],
    requiresHardware: ["wifi"],
    isNew: false,
    thumbnailBg: "#2563eb",
    iconColor: "#1d4ed8",
    blockCategoryColor: "#1d4ed8",
    iconGlyph: "🎙️",
    sections: [
      {
        sectionLabel: "Voice Commands",
        items: [
          {
            type: "speech_listen",
            category: "ext_speech-recognition",
            shape: "stack",
            label: "Listen and wait for speech",
            color: "#1d4ed8",
          },
          {
            type: "speech_is_recognized",
            category: "ext_speech-recognition",
            shape: "boolean",
            label: "Is speech recognized?",
            color: "#1d4ed8",
          },
          {
            type: "speech_get_result",
            category: "ext_speech-recognition",
            shape: "reporter",
            label: "Get speech to text result",
            color: "#1d4ed8",
            hasCheckbox: true,
          },
        ],
      },
    ],
  },

  // 8. Translate
  {
    id: "translate",
    name: "Translate",
    description: "Translate text into over 50 world languages instantly",
    categoryTags: ["AI & ML", "Games & Animation"],
    requiresHardware: ["wifi"],
    isNew: false,
    thumbnailBg: "#3b82f6",
    iconColor: "#2563eb",
    blockCategoryColor: "#2563eb",
    iconGlyph: "🌐",
    sections: [
      {
        sectionLabel: "Language Translation",
        items: [
          {
            type: "translate_text",
            category: "ext_translate",
            shape: "reporter",
            label: "Translate {text} to {lang}",
            color: "#2563eb",
            inputs: {
              text: { name: "text", type: "text", defaultValue: "Hello World" },
              lang: { name: "lang", type: "select", defaultValue: "hi", options: [{ label: "Hindi", value: "hi" }, { label: "Spanish", value: "es" }, { label: "French", value: "fr" }, { label: "German", value: "de" }] },
            },
          },
        ],
      },
    ],
  },

  // 9. Text to Speech
  {
    id: "text-to-speech",
    name: "Text to Speech",
    description: "Make your robotics sprites talk aloud with customizable AI voices",
    categoryTags: ["Games & Animation"],
    isNew: false,
    thumbnailBg: "#6d28d9",
    iconColor: "#5b21b6",
    blockCategoryColor: "#5b21b6",
    iconGlyph: "🗣️",
    sections: [
      {
        sectionLabel: "Speech Output",
        items: [
          {
            type: "tts_speak",
            category: "ext_text-to-speech",
            shape: "stack",
            label: "Speak {phrase}",
            color: "#5b21b6",
            inputs: {
              phrase: { name: "phrase", type: "text", defaultValue: "Hello, I am Kite Robot!" },
            },
          },
          {
            type: "tts_set_voice",
            category: "ext_text-to-speech",
            shape: "stack",
            label: "Set voice to {voice}",
            color: "#5b21b6",
            inputs: {
              voice: { name: "voice", type: "select", defaultValue: "alto", options: [{ label: "Alto", value: "alto" }, { label: "Tenor", value: "tenor" }, { label: "Giant", value: "giant font-bold" }, { label: "Kitten", value: "kitten" }] },
            },
          },
        ],
      },
    ],
  },

  // 10. Pen (Draw & Canvas)
  {
    id: "pen",
    name: "Pen & Canvas",
    description: "Draw lines, shapes, and colorful patterns on the stage as sprites move",
    categoryTags: ["Games & Animation"],
    isNew: false,
    thumbnailBg: "#10b981",
    iconColor: "#059669",
    blockCategoryColor: "#059669",
    iconGlyph: "✏️",
    sections: [
      {
        sectionLabel: "Pen Drawing",
        items: [
          {
            type: "pen_erase_all",
            category: "ext_pen",
            shape: "stack",
            label: "Erase all",
            color: "#059669",
          },
          {
            type: "pen_down",
            category: "ext_pen",
            shape: "stack",
            label: "Pen down",
            color: "#059669",
          },
          {
            type: "pen_up",
            category: "ext_pen",
            shape: "stack",
            label: "Pen up",
            color: "#059669",
          },
          {
            type: "pen_set_size",
            category: "ext_pen",
            shape: "stack",
            label: "Set pen size to {size}",
            color: "#059669",
            inputs: {
              size: { name: "size", type: "number", defaultValue: 2 },
            },
          },
        ],
      },
    ],
  },

  // 11. Music & Synthesizer
  {
    id: "music",
    name: "Music Synthesizer",
    description: "Play drums, piano notes, synth chords, and rhythm beats",
    categoryTags: ["Games & Animation"],
    isNew: false,
    thumbnailBg: "#ec4899",
    iconColor: "#db2777",
    blockCategoryColor: "#db2777",
    iconGlyph: "🎵",
    sections: [
      {
        sectionLabel: "Instrument & Notes",
        items: [
          {
            type: "music_play_note",
            category: "ext_music",
            shape: "stack",
            label: "Play note {note} for {beats} beats",
            color: "#db2777",
            inputs: {
              note: { name: "note", type: "number", defaultValue: 60 },
              beats: { name: "beats", type: "number", defaultValue: 0.25 },
            },
          },
          {
            type: "music_play_drum",
            category: "ext_music",
            shape: "stack",
            label: "Play drum {drum} for {beats} beats",
            color: "#db2777",
            inputs: {
              drum: { name: "drum", type: "select", defaultValue: "1", options: [{ label: "(1) Snare", value: "1" }, { label: "(2) Bass", value: "2" }, { label: "(3) Hi-Hat", value: "3" }] },
              beats: { name: "beats", type: "number", defaultValue: 0.25 },
            },
          },
        ],
      },
    ],
  },

  // 12. Physics Engine
  {
    id: "physics",
    name: "Physics Engine",
    description: "Simulate gravity, mass, friction, impulse forces, and collisions",
    categoryTags: ["Games & Animation"],
    isNew: true,
    thumbnailBg: "#4338ca",
    iconColor: "#3730a3",
    blockCategoryColor: "#3730a3",
    iconGlyph: "🎮",
    sections: [
      {
        sectionLabel: "World Dynamics",
        items: [
          {
            type: "physics_enable",
            category: "ext_physics",
            shape: "stack",
            label: "Enable physics on sprite",
            color: "#3730a3",
          },
          {
            type: "physics_set_gravity",
            category: "ext_physics",
            shape: "stack",
            label: "Set gravity to x: {gx} y: {gy}",
            color: "#3730a3",
            inputs: {
              gx: { name: "gx", type: "number", defaultValue: 0 },
              gy: { name: "gy", type: "number", defaultValue: -9.8 },
            },
          },
          {
            type: "physics_apply_force",
            category: "ext_physics",
            shape: "stack",
            label: "Apply force fx: {fx} fy: {fy}",
            color: "#3730a3",
            inputs: {
              fx: { name: "fx", type: "number", defaultValue: 10 },
              fy: { name: "fy", type: "number", defaultValue: 50 },
            },
          },
        ],
      },
    ],
  },

  // 13. Internet of Things (IoT & Webhooks)
  {
    id: "iot",
    name: "Internet of Things (IoT)",
    description: "Connect to cloud MQTT brokers, HTTP webhooks, and Adafruit IO",
    categoryTags: ["IoT", "Hardware"],
    requiresHardware: ["wifi"],
    isNew: true,
    thumbnailBg: "#ea580c",
    iconColor: "#c2410c",
    blockCategoryColor: "#c2410c",
    iconGlyph: "🌐",
    sections: [
      {
        sectionLabel: "Cloud Messaging",
        items: [
          {
            type: "iot_connect",
            category: "ext_iot",
            shape: "stack",
            label: "Connect to MQTT broker {server} with key {key}",
            color: "#c2410c",
            inputs: {
              server: { name: "server", type: "text", defaultValue: "io.adafruit.com" },
              key: { name: "key", type: "text", defaultValue: "aio_..." },
            },
          },
          {
            type: "iot_publish",
            category: "ext_iot",
            shape: "stack",
            label: "Publish value {val} to topic {topic}",
            color: "#c2410c",
            inputs: {
              val: { name: "val", type: "number", defaultValue: 25.4 },
              topic: { name: "topic", type: "text", defaultValue: "sensors/temp" },
            },
          },
        ],
      },
    ],
  },
];
