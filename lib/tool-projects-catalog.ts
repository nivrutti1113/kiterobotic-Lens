export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tag: string;
  icon: string;
  initialData?: any;
};

export type ToolCatalogItem = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  themeColor: string;
  projects: ProjectItem[];
};

export class ToolProjectsCatalog {
  public static TOOLS: Record<string, ToolCatalogItem> = {
    paint: {
      slug: "paint",
      title: "Paint Studio",
      subtitle: "2D Canvas & Costume Drawing Engine",
      description: "Create pixel art, color templates, symmetry mandalas, and custom sprite costumes.",
      iconName: "Palette",
      themeColor: "#EC4899",
      projects: [
        {
          id: "blank",
          title: "+ Blank Canvas",
          description: "Start fresh with a clean white 2D drawing canvas.",
          difficulty: "Beginner",
          tag: "Custom",
          icon: "🎨",
          initialData: { mode: "freeform", color: "#7C3AED", size: 8 }
        },
        {
          id: "pixel_art",
          title: "Pixel Art Grid (16x16)",
          description: "Design 8-bit retro game sprites on a 16x16 pixel grid.",
          difficulty: "Beginner",
          tag: "Pixel Art",
          icon: "👾",
          initialData: { mode: "pixel", gridSize: 16 }
        },
        {
          id: "coloring_book",
          title: "Coloring Book Outlines",
          description: "Color in pre-drawn robot and space outlines using fill bucket tools.",
          difficulty: "Beginner",
          tag: "Template",
          icon: "🖍️",
          initialData: { mode: "coloring", template: "robot" }
        },
        {
          id: "symmetry_mandala",
          title: "Symmetry & Mandala Mode",
          description: "Draw intricate 4-axis mirrored radial patterns in real-time.",
          difficulty: "Intermediate",
          tag: "Symmetry",
          icon: "☸️",
          initialData: { mode: "symmetry", axes: 4 }
        },
        {
          id: "sprite_costume",
          title: "Sprite Costume Editor",
          description: "Draw transparent PNG costumes ready for Coding Studio sprites.",
          difficulty: "Intermediate",
          tag: "Costumes",
          icon: "🤖",
          initialData: { mode: "costume", width: 128, height: 128 }
        },
        {
          id: "comic_strip",
          title: "Comic Storyboard (4-Panel)",
          description: "Illustrate 4-panel comic stories with storyboard guides.",
          difficulty: "Advanced",
          tag: "Storyboard",
          icon: "📖",
          initialData: { mode: "comic", panels: 4 }
        }
      ]
    },

    gamelab: {
      slug: "gamelab",
      title: "Game Lab",
      subtitle: "2D Arcade Physics & Game Engine",
      description: "Play and modify 6 distinct 2D game mechanics from platformers to mazes and shooters.",
      iconName: "Gamepad2",
      themeColor: "#F59E0B",
      projects: [
        {
          id: "blank",
          title: "+ Custom Game Sandbox",
          description: "Build a custom 2D arcade game scene from scratch.",
          difficulty: "Advanced",
          tag: "Sandbox",
          icon: "🎮",
          initialData: { mode: "sandbox" }
        },
        {
          id: "platformer",
          title: "Platformer Quest (Gravity & Stars)",
          description: "Jump across platforms, avoid spikes, and collect star XP.",
          difficulty: "Beginner",
          tag: "Platformer",
          icon: "🦘",
          initialData: { mode: "platformer", speed: 4, gravity: 0.55 }
        },
        {
          id: "topdown_maze",
          title: "Top-Down Maze Collector",
          description: "Navigate a grid maze, collect keys, and unlock the exit portal.",
          difficulty: "Beginner",
          tag: "Maze",
          icon: "🧩",
          initialData: { mode: "maze", size: 10 }
        },
        {
          id: "flappy_runner",
          title: "Flappy Sky Runner",
          description: "Tap to fly vertical sprite between moving obstacle pipes.",
          difficulty: "Intermediate",
          tag: "Arcade",
          icon: "🐤",
          initialData: { mode: "flappy", gap: 100 }
        },
        {
          id: "space_shooter",
          title: "Space Invader Shooter",
          description: "Pilot your starship and blast descending alien targets with lasers.",
          difficulty: "Intermediate",
          tag: "Shooter",
          icon: "🚀",
          initialData: { mode: "shooter", enemies: 8 }
        },
        {
          id: "memory_match",
          title: "Memory Card Matcher",
          description: "Flip and match pairs of robotics cards before turns run out.",
          difficulty: "Beginner",
          tag: "Puzzle",
          icon: "🃏",
          initialData: { mode: "memory", pairs: 8 }
        }
      ]
    },

    electronics: {
      slug: "electronics",
      title: "Electronics Lab",
      subtitle: "Interactive Breadboard Simulator",
      description: "Wire circuits, test resistors, mix RGB LEDs, and calculate live current and power.",
      iconName: "Zap",
      themeColor: "#10B981",
      projects: [
        {
          id: "blank",
          title: "+ Blank Breadboard",
          description: "Start with an un-wired breadboard terminal strip matrix.",
          difficulty: "Intermediate",
          tag: "Custom",
          icon: "🔌",
          initialData: { circuit: "blank" }
        },
        {
          id: "led_resistor_button",
          title: "Basic LED + Resistor + Push-Button",
          description: "Classic circuit topology with live Ohm's Law (V=IR) calculations.",
          difficulty: "Beginner",
          tag: "Foundational",
          icon: "💡",
          initialData: { circuit: "basic_led", voltage: 5.0, resistance: 220 }
        },
        {
          id: "rgb_mixer",
          title: "RGB LED Color Mixer",
          description: "3 independent LED channels with potentiometers to mix 16M colors.",
          difficulty: "Intermediate",
          tag: "Analog",
          icon: "🌈",
          initialData: { circuit: "rgb_mixer", r: 255, g: 128, b: 0 }
        },
        {
          id: "traffic_light",
          title: "Traffic Light Sequencer",
          description: "Red, Yellow, and Green LEDs with manual and 2s auto-sequence modes.",
          difficulty: "Beginner",
          tag: "Logic",
          icon: "🚦",
          initialData: { circuit: "traffic_light", autoSeq: true }
        },
        {
          id: "buzzer_alarm",
          title: "Buzzer Security Alarm",
          description: "Piezo buzzer audio tone generator + warning LED + trigger switch.",
          difficulty: "Intermediate",
          tag: "Audio",
          icon: "🔔",
          initialData: { circuit: "buzzer_alarm", freq: 880 }
        },
        {
          id: "potentiometer_dimmer",
          title: "Potentiometer Dimmer Circuit",
          description: "Rotary dial (0-10kΩ) adjusting LED current and voltage divider.",
          difficulty: "Advanced",
          tag: "Potentiometer",
          icon: "🎛️",
          initialData: { circuit: "potentiometer", potVal: 5000 }
        },
        {
          id: "series_vs_parallel",
          title: "Series vs Parallel Comparison",
          description: "Compare voltage drops and branch currents across dual circuit topologies.",
          difficulty: "Advanced",
          tag: "Comparison",
          icon: "⚡",
          initialData: { circuit: "series_parallel", mode: "parallel" }
        }
      ]
    },

    iot: {
      slug: "iot",
      title: "IoT Simulator",
      subtitle: "Live Telemetry & Cloud Actuators",
      description: "Monitor real-time sensor streams and control relays across 6 IoT scenarios.",
      iconName: "Wifi",
      themeColor: "#06B6D4",
      projects: [
        {
          id: "blank",
          title: "+ Blank IoT Gateway Node",
          description: "Configure a custom MQTT telemetry feed and relay triggers.",
          difficulty: "Advanced",
          tag: "Custom",
          icon: "📡",
          initialData: { mode: "custom" }
        },
        {
          id: "smart_home",
          title: "Smart Home Temp & Relay Lock",
          description: "Live ambient temperature stream with heat spike simulation & relay lock.",
          difficulty: "Beginner",
          tag: "Smart Home",
          icon: "🏠",
          initialData: { mode: "temp_lock", min: 18, max: 45 }
        },
        {
          id: "plant_watering",
          title: "Smart Plant Watering System",
          description: "Soil moisture sensor stream with auto water pump actuator trigger.",
          difficulty: "Beginner",
          tag: "AgriTech",
          icon: "🌱",
          initialData: { mode: "plant_moisture", threshold: 30 }
        },
        {
          id: "street_light",
          title: "Smart Street Light (LDR Sensor)",
          description: "Ambient light lux feed with automatic night LED street light logic.",
          difficulty: "Intermediate",
          tag: "Smart City",
          icon: "🏙️",
          initialData: { mode: "ldr_light", luxThreshold: 200 }
        },
        {
          id: "air_quality",
          title: "Air Quality Index (AQI) Monitor",
          description: "PM2.5 and CO2 telemetry stream with safety threshold badges and exhaust fan.",
          difficulty: "Intermediate",
          tag: "Environment",
          icon: "🍃",
          initialData: { mode: "aqi_monitor", pmlimit: 50 }
        },
        {
          id: "security_alarm",
          title: "Smart Motion Security Alarm",
          description: "PIR motion sensor feed with intruder alert logs and alarm horn.",
          difficulty: "Intermediate",
          tag: "Security",
          icon: "🚨",
          initialData: { mode: "pir_motion" }
        },
        {
          id: "weather_station",
          title: "Multi-Sensor Weather Dashboard",
          description: "Triple sensor feed (Temp, Humidity, Pressure) with multi-line SVG charts.",
          difficulty: "Advanced",
          tag: "Weather",
          icon: "⛅",
          initialData: { mode: "weather_multi" }
        }
      ]
    },

    web: {
      slug: "web",
      title: "Web Builder",
      subtitle: "Visual Drag-and-Drop Page Studio",
      description: "Build, edit, and preview responsive HTML/CSS web pages in real-time.",
      iconName: "Globe",
      themeColor: "#3B82F6",
      projects: [
        {
          id: "blank",
          title: "+ Blank Web Page",
          description: "Start from scratch with a blank HTML5 canvas page.",
          difficulty: "Beginner",
          tag: "Custom",
          icon: "🌐",
          initialData: { template: "blank" }
        },
        {
          id: "portfolio",
          title: "Personal Student Bio Page",
          description: "Hero header, skill pills, project gallery, and contact form.",
          difficulty: "Beginner",
          tag: "Portfolio",
          icon: "👤",
          initialData: { template: "portfolio" }
        },
        {
          id: "science_fair",
          title: "School Science Fair Showcase",
          description: "Hypothesis, experiment steps, data table, and photo presentation.",
          difficulty: "Beginner",
          tag: "Science",
          icon: "🔬",
          initialData: { template: "science_fair" }
        },
        {
          id: "robotics_club",
          title: "Robotics Club Landing Page",
          description: "Hero CTA banner, feature grid, meeting schedule, and team cards.",
          difficulty: "Intermediate",
          tag: "Landing",
          icon: "🤖",
          initialData: { template: "robotics_club" }
        },
        {
          id: "tech_blog",
          title: "Tech Blog Post Layout",
          description: "Article header, markdown body formatting, callouts, and comments.",
          difficulty: "Intermediate",
          tag: "Blog",
          icon: "📝",
          initialData: { template: "tech_blog" }
        },
        {
          id: "photo_gallery",
          title: "Photo & Art Showcase",
          description: "Responsive 6-photo grid with captions and lightbox view.",
          difficulty: "Intermediate",
          tag: "Gallery",
          icon: "🖼️",
          initialData: { template: "photo_gallery" }
        },
        {
          id: "event_poster",
          title: "Event & Quest Announcement",
          description: "Bold typography event poster with countdown timer and RSVP button.",
          difficulty: "Advanced",
          tag: "Poster",
          icon: "📣",
          initialData: { template: "event_poster" }
        }
      ]
    },

    math: {
      slug: "math",
      title: "Math Lab",
      subtitle: "Interactive Visual Mathematics",
      description: "Graph functions, explore geometry, compute fractions, and simulate probability.",
      iconName: "Calculator",
      themeColor: "#8B5CF6",
      projects: [
        {
          id: "blank",
          title: "+ Custom Math Scratchpad",
          description: "Open an interactive scratchpad for custom mathematical formulas.",
          difficulty: "Beginner",
          tag: "Custom",
          icon: "📐",
          initialData: { mode: "scratchpad" }
        },
        {
          id: "function_grapher",
          title: "Interactive Function Grapher (y=mx+c)",
          description: "Adjust slope m and intercept c with sliders on a live Cartesian grid.",
          difficulty: "Intermediate",
          tag: "Algebra",
          icon: "📈",
          initialData: { mode: "grapher", m: 2, c: 1 }
        },
        {
          id: "geometry_explorer",
          title: "Geometry Shape Explorer",
          description: "Interactive polygons calculating live Area (A) and Perimeter (P).",
          difficulty: "Beginner",
          tag: "Geometry",
          icon: "🔷",
          initialData: { mode: "geometry", shape: "rectangle", w: 8, h: 5 }
        },
        {
          id: "fraction_pie",
          title: "Fraction & Ratio Visualizer",
          description: "Interactive pie & bar chart split into N parts with percentage calc.",
          difficulty: "Beginner",
          tag: "Fractions",
          icon: "🥧",
          initialData: { mode: "fraction", num: 3, den: 8 }
        },
        {
          id: "number_line",
          title: "Number Line Integer Operations",
          description: "Visual number line (-15 to +15) showing vector jump arrows.",
          difficulty: "Beginner",
          tag: "Integers",
          icon: "➖",
          initialData: { mode: "numberline", a: -4, b: 7 }
        },
        {
          id: "probability_sim",
          title: "Probability Dice & Coin Simulator",
          description: "Roll dice 10/50/100 times with live frequency charts.",
          difficulty: "Intermediate",
          tag: "Probability",
          icon: "🎲",
          initialData: { mode: "probability", diceCount: 1 }
        },
        {
          id: "statistics_tool",
          title: "Basic Statistics Calculator",
          description: "Compute Mean, Median, Mode, and Range with live frequency bar chart.",
          difficulty: "Advanced",
          tag: "Statistics",
          icon: "📊",
          initialData: { mode: "statistics", dataset: [12, 15, 15, 18, 22, 25, 30] }
        }
      ]
    },

    invisible: {
      slug: "invisible",
      title: "Invisible Mode",
      subtitle: "Distraction-Free Focus IDE",
      description: "Choose from 6 focus session configurations with distinct constraints and timers.",
      iconName: "Eye",
      themeColor: "#6366F1",
      projects: [
        {
          id: "blank",
          title: "+ Custom Focus Session",
          description: "Set custom timer and interface constraints.",
          difficulty: "Beginner",
          tag: "Custom",
          icon: "👁️",
          initialData: { mode: "custom" }
        },
        {
          id: "timed_challenge",
          title: "Timed Challenge Mode (10 Min)",
          description: "Distraction-free IDE with a 10-minute countdown and focus streak.",
          difficulty: "Intermediate",
          tag: "Timer",
          icon: "⏱️",
          initialData: { mode: "timed", minutes: 10 }
        },
        {
          id: "silent_practice",
          title: "Silent Practice Mode",
          description: "Audio-muted, zero-notification clean environment for deep coding.",
          difficulty: "Beginner",
          tag: "Silent",
          icon: "🤫",
          initialData: { mode: "silent" }
        },
        {
          id: "exam_simulation",
          title: "Exam Simulation Mode",
          description: "Strict exam conditions with disabled copy-paste and problem checklist.",
          difficulty: "Advanced",
          tag: "Exam",
          icon: "📝",
          initialData: { mode: "exam", time: 15 }
        },
        {
          id: "free_build",
          title: "Free Build Sandbox Mode",
          description: "Completely clean canvas with zero floating toolbars for maximum view.",
          difficulty: "Beginner",
          tag: "Zen",
          icon: "🧘",
          initialData: { mode: "free_build" }
        },
        {
          id: "pair_programming",
          title: "Pair Programming Mode",
          description: "Dual split-view workspace layout for peer driver/navigator coding.",
          difficulty: "Intermediate",
          tag: "Teamwork",
          icon: "👥",
          initialData: { mode: "pair" }
        },
        {
          id: "debug_sprint",
          title: "Debug Sprint Challenge",
          description: "Fix pre-loaded broken code snippets under a 5-minute timer.",
          difficulty: "Advanced",
          tag: "Debugging",
          icon: "🐞",
          initialData: { mode: "debug" }
        }
      ]
    }
  };

  public static getTool(slug: string): ToolCatalogItem | undefined {
    return this.TOOLS[slug.toLowerCase()];
  }
}
