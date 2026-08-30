import { BlockDefinition, Category } from "./types";

export const CATEGORY_COLORS: Record<Category, { bg: string; border: string; text: string; hex: string }> = {
  movement: { bg: "bg-blue-500", border: "border-blue-600", text: "text-white", hex: "#3B82F6" },
  looks: { bg: "bg-purple-500", border: "border-purple-600", text: "text-white", hex: "#8B5CF6" },
  events: { bg: "bg-amber-400", border: "border-amber-500", text: "text-slate-950", hex: "#F5C518" },
  control: { bg: "bg-orange-500", border: "border-orange-600", text: "text-white", hex: "#F97316" },
  sound: { bg: "bg-pink-500", border: "border-pink-600", text: "text-white", hex: "#EC4899" },
  sensing: { bg: "bg-cyan-500", border: "border-cyan-600", text: "text-white", hex: "#06B6D4" },
  operators: { bg: "bg-emerald-500", border: "border-emerald-600", text: "text-white", hex: "#22C55E" },
};

export const BLOCK_DEFINITIONS: Record<string, BlockDefinition> = {
  // --- MOVEMENT ---
  move_right: {
    type: "move_right",
    category: "movement",
    shape: "stack",
    label: "Move Right {steps} steps",
    color: "#3B82F6",
    inputs: {
      steps: { name: "steps", type: "number", defaultValue: 10 },
    },
  },
  move_left: {
    type: "move_left",
    category: "movement",
    shape: "stack",
    label: "Move Left {steps} steps",
    color: "#3B82F6",
    inputs: {
      steps: { name: "steps", type: "number", defaultValue: 10 },
    },
  },
  move_up: {
    type: "move_up",
    category: "movement",
    shape: "stack",
    label: "Move Up {steps} steps",
    color: "#3B82F6",
    inputs: {
      steps: { name: "steps", type: "number", defaultValue: 10 },
    },
  },
  move_down: {
    type: "move_down",
    category: "movement",
    shape: "stack",
    label: "Move Down {steps} steps",
    color: "#3B82F6",
    inputs: {
      steps: { name: "steps", type: "number", defaultValue: 10 },
    },
  },
  turn_cw: {
    type: "turn_cw",
    category: "movement",
    shape: "stack",
    label: "Turn ↻ {degrees} degrees",
    color: "#3B82F6",
    inputs: {
      degrees: { name: "degrees", type: "number", defaultValue: 15 },
    },
  },
  turn_ccw: {
    type: "turn_ccw",
    category: "movement",
    shape: "stack",
    label: "Turn ↺ {degrees} degrees",
    color: "#3B82F6",
    inputs: {
      degrees: { name: "degrees", type: "number", defaultValue: 15 },
    },
  },
  point_direction: {
    type: "point_direction",
    category: "movement",
    shape: "stack",
    label: "Point in direction {degrees}°",
    color: "#3B82F6",
    inputs: {
      degrees: { name: "degrees", type: "number", defaultValue: 90 },
    },
  },
  go_to_random: {
    type: "go_to_random",
    category: "movement",
    shape: "stack",
    label: "Go to random position",
    color: "#3B82F6",
  },
  go_to_xy: {
    type: "go_to_xy",
    category: "movement",
    shape: "stack",
    label: "Go to x: {x} y: {y}",
    color: "#3B82F6",
    inputs: {
      x: { name: "x", type: "number", defaultValue: 0 },
      y: { name: "y", type: "number", defaultValue: 0 },
    },
  },
  glide_to_xy: {
    type: "glide_to_xy",
    category: "movement",
    shape: "stack",
    label: "Glide {duration} secs to x: {x} y: {y}",
    color: "#3B82F6",
    inputs: {
      duration: { name: "duration", type: "number", defaultValue: 1 },
      x: { name: "x", type: "number", defaultValue: 100 },
      y: { name: "y", type: "number", defaultValue: 100 },
    },
  },

  // --- LOOKS ---
  say_text: {
    type: "say_text",
    category: "looks",
    shape: "stack",
    label: "Say {text}",
    color: "#8B5CF6",
    inputs: {
      text: { name: "text", type: "text", defaultValue: "Hello!" },
    },
  },
  show: {
    type: "show",
    category: "looks",
    shape: "stack",
    label: "Show",
    color: "#8B5CF6",
  },
  hide: {
    type: "hide",
    category: "looks",
    shape: "stack",
    label: "Hide",
    color: "#8B5CF6",
  },
  switch_costume: {
    type: "switch_costume",
    category: "looks",
    shape: "stack",
    label: "Switch costume to {costume}",
    color: "#8B5CF6",
    inputs: {
      costume: {
        name: "costume",
        type: "select",
        defaultValue: "next",
        options: [
          { label: "Next Costume", value: "next" },
          { label: "Costume 1", value: "0" },
          { label: "Costume 2", value: "1" },
        ],
      },
    },
  },
  change_size: {
    type: "change_size",
    category: "looks",
    shape: "stack",
    label: "Change size by {percent}%",
    color: "#8B5CF6",
    inputs: {
      percent: { name: "percent", type: "number", defaultValue: 10 },
    },
  },

  // --- EVENTS ---
  when_flag_clicked: {
    type: "when_flag_clicked",
    category: "events",
    shape: "hat",
    label: "When 🟢 flag clicked",
    color: "#F5C518",
  },
  when_sprite_clicked: {
    type: "when_sprite_clicked",
    category: "events",
    shape: "hat",
    label: "When this sprite clicked",
    color: "#F5C518",
  },
  when_key_pressed: {
    type: "when_key_pressed",
    category: "events",
    shape: "hat",
    label: "When key {key} pressed",
    color: "#F5C518",
    inputs: {
      key: {
        name: "key",
        type: "select",
        defaultValue: "space",
        options: [
          { label: "Space", value: "space" },
          { label: "Up Arrow", value: "ArrowUp" },
          { label: "Down Arrow", value: "ArrowDown" },
          { label: "Left Arrow", value: "ArrowLeft" },
          { label: "Right Arrow", value: "ArrowRight" },
          { label: "Letter A", value: "a" },
        ],
      },
    },
  },
  broadcast: {
    type: "broadcast",
    category: "events",
    shape: "stack",
    label: "Broadcast {message}",
    color: "#F5C518",
    inputs: {
      message: { name: "message", type: "text", defaultValue: "message1" },
    },
  },
  when_receive_message: {
    type: "when_receive_message",
    category: "events",
    shape: "hat",
    label: "When I receive {message}",
    color: "#F5C518",
    inputs: {
      message: { name: "message", type: "text", defaultValue: "message1" },
    },
  },

  // --- CONTROL ---
  wait: {
    type: "wait",
    category: "control",
    shape: "stack",
    label: "Wait {seconds} seconds",
    color: "#F97316",
    inputs: {
      seconds: { name: "seconds", type: "number", defaultValue: 1 },
    },
  },
  repeat: {
    type: "repeat",
    category: "control",
    shape: "c_block",
    label: "Repeat {times} times",
    color: "#F97316",
    inputs: {
      times: { name: "times", type: "number", defaultValue: 10 },
    },
  },
  forever: {
    type: "forever",
    category: "control",
    shape: "c_block",
    label: "Forever",
    color: "#F97316",
  },
  if_then: {
    type: "if_then",
    category: "control",
    shape: "c_block",
    label: "If {condition} then",
    color: "#F97316",
    inputs: {
      condition: { name: "condition", type: "reporter", defaultValue: "" },
    },
  },
  if_else: {
    type: "if_else",
    category: "control",
    shape: "c_block_else",
    label: "If {condition} then ... Else",
    color: "#F97316",
    inputs: {
      condition: { name: "condition", type: "reporter", defaultValue: "" },
    },
  },
  stop_script: {
    type: "stop_script",
    category: "control",
    shape: "stack",
    label: "Stop this script",
    color: "#F97316",
  },
  stop_all: {
    type: "stop_all",
    category: "control",
    shape: "stack",
    label: "Stop all",
    color: "#F97316",
  },

  // --- SOUND ---
  play_sound: {
    type: "play_sound",
    category: "sound",
    shape: "stack",
    label: "Play sound {sound}",
    color: "#EC4899",
    inputs: {
      sound: {
        name: "sound",
        type: "select",
        defaultValue: "pop",
        options: [
          { label: "Pop 🎈", value: "pop" },
          { label: "Ding 🔔", value: "ding" },
          { label: "Laser ⚡", value: "laser" },
          { label: "Jump 🦘", value: "jump" },
          { label: "Coin 🪙", value: "coin" },
          { label: "Cheer 🎉", value: "cheer" },
        ],
      },
    },
  },
  play_sound_until_done: {
    type: "play_sound_until_done",
    category: "sound",
    shape: "stack",
    label: "Play sound {sound} until done",
    color: "#EC4899",
    inputs: {
      sound: {
        name: "sound",
        type: "select",
        defaultValue: "ding",
        options: [
          { label: "Ding 🔔", value: "ding" },
          { label: "Pop 🎈", value: "pop" },
          { label: "Laser ⚡", value: "laser" },
          { label: "Jump 🦘", value: "jump" },
          { label: "Coin 🪙", value: "coin" },
        ],
      },
    },
  },
  set_volume: {
    type: "set_volume",
    category: "sound",
    shape: "stack",
    label: "Set volume to {volume}%",
    color: "#EC4899",
    inputs: {
      volume: { name: "volume", type: "number", defaultValue: 100 },
    },
  },

  // --- SENSING ---
  touching_target: {
    type: "touching_target",
    category: "sensing",
    shape: "boolean",
    label: "Touching {target}?",
    color: "#06B6D4",
    inputs: {
      target: {
        name: "target",
        type: "select",
        defaultValue: "edge",
        options: [
          { label: "Edge", value: "edge" },
          { label: "Mouse Pointer", value: "mouse" },
        ],
      },
    },
  },
  distance_to: {
    type: "distance_to",
    category: "sensing",
    shape: "reporter",
    label: "Distance to {target}",
    color: "#06B6D4",
    inputs: {
      target: {
        name: "target",
        type: "select",
        defaultValue: "mouse",
        options: [
          { label: "Mouse Pointer", value: "mouse" },
        ],
      },
    },
  },
  ask_and_wait: {
    type: "ask_and_wait",
    category: "sensing",
    shape: "stack",
    label: "Ask {question} and wait",
    color: "#06B6D4",
    inputs: {
      question: { name: "question", type: "text", defaultValue: "What's your name?" },
    },
  },

  // --- OPERATORS ---
  compare_less: {
    type: "compare_less",
    category: "operators",
    shape: "boolean",
    label: "{a} < {b}",
    color: "#22C55E",
    inputs: {
      a: { name: "a", type: "number", defaultValue: 5 },
      b: { name: "b", type: "number", defaultValue: 10 },
    },
  },
  compare_equal: {
    type: "compare_equal",
    category: "operators",
    shape: "boolean",
    label: "{a} = {b}",
    color: "#22C55E",
    inputs: {
      a: { name: "a", type: "number", defaultValue: 5 },
      b: { name: "b", type: "number", defaultValue: 5 },
    },
  },
  compare_greater: {
    type: "compare_greater",
    category: "operators",
    shape: "boolean",
    label: "{a} > {b}",
    color: "#22C55E",
    inputs: {
      a: { name: "a", type: "number", defaultValue: 10 },
      b: { name: "b", type: "number", defaultValue: 5 },
    },
  },
  math_add: {
    type: "math_add",
    category: "operators",
    shape: "reporter",
    label: "{a} + {b}",
    color: "#22C55E",
    inputs: {
      a: { name: "a", type: "number", defaultValue: 1 },
      b: { name: "b", type: "number", defaultValue: 1 },
    },
  },
  math_subtract: {
    type: "math_subtract",
    category: "operators",
    shape: "reporter",
    label: "{a} − {b}",
    color: "#22C55E",
    inputs: {
      a: { name: "a", type: "number", defaultValue: 10 },
      b: { name: "b", type: "number", defaultValue: 4 },
    },
  },
  math_multiply: {
    type: "math_multiply",
    category: "operators",
    shape: "reporter",
    label: "{a} × {b}",
    color: "#22C55E",
    inputs: {
      a: { name: "a", type: "number", defaultValue: 3 },
      b: { name: "b", type: "number", defaultValue: 3 },
    },
  },
  math_divide: {
    type: "math_divide",
    category: "operators",
    shape: "reporter",
    label: "{a} ÷ {b}",
    color: "#22C55E",
    inputs: {
      a: { name: "a", type: "number", defaultValue: 12 },
      b: { name: "b", type: "number", defaultValue: 3 },
    },
  },
  logic_and: {
    type: "logic_and",
    category: "operators",
    shape: "boolean",
    label: "{a} and {b}",
    color: "#22C55E",
    inputs: {
      a: { name: "a", type: "reporter", defaultValue: "" },
      b: { name: "b", type: "reporter", defaultValue: "" },
    },
  },
  logic_or: {
    type: "logic_or",
    category: "operators",
    shape: "boolean",
    label: "{a} or {b}",
    color: "#22C55E",
    inputs: {
      a: { name: "a", type: "reporter", defaultValue: "" },
      b: { name: "b", type: "reporter", defaultValue: "" },
    },
  },
  logic_not: {
    type: "logic_not",
    category: "operators",
    shape: "boolean",
    label: "not {a}",
    color: "#22C55E",
    inputs: {
      a: { name: "a", type: "reporter", defaultValue: "" },
    },
  },
};
