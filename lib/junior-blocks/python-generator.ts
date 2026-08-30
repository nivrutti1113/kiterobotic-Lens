import { BlockInstance, Sprite } from "./types";

export function generatePythonFromSprite(sprite: Sprite): string {
  let python = `# KMS-AI Generated Python Code for Sprite: ${sprite.name}\nimport time\nimport robot_engine\n\n`;

  if (!sprite.scripts || sprite.scripts.length === 0) {
    python += `# No block scripts attached to ${sprite.name}.\n`;
    return python;
  }

  sprite.scripts.forEach((script, idx) => {
    python += `# --- Script ${idx + 1} ---\n`;
    python += generateBlockPython(script, 0);
    python += "\n";
  });

  return python;
}

function generateBlockPython(block: BlockInstance, indent: number): string {
  const pad = "    ".repeat(indent);
  let code = "";
  const inputs = block.inputs || {};

  function evalVal(val: number | string | BlockInstance | undefined): string {
    if (val === undefined || val === null) return "0";
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    if (typeof val === "string") return `"${val}"`;
    // Nested operator block
    const b = val as BlockInstance;
    switch (b.type) {
      case "compare_less": return `${evalVal(b.inputs?.a)} < ${evalVal(b.inputs?.b)}`;
      case "compare_equal": return `${evalVal(b.inputs?.a)} == ${evalVal(b.inputs?.b)}`;
      case "compare_greater": return `${evalVal(b.inputs?.a)} > ${evalVal(b.inputs?.b)}`;
      case "math_add": return `(${evalVal(b.inputs?.a)} + ${evalVal(b.inputs?.b)})`;
      case "math_subtract": return `(${evalVal(b.inputs?.a)} - ${evalVal(b.inputs?.b)})`;
      case "math_multiply": return `(${evalVal(b.inputs?.a)} * ${evalVal(b.inputs?.b)})`;
      case "math_divide": return `(${evalVal(b.inputs?.a)} / ${evalVal(b.inputs?.b)})`;
      case "logic_and": return `(${evalVal(b.inputs?.a)} and ${evalVal(b.inputs?.b)})`;
      case "logic_or": return `(${evalVal(b.inputs?.a)} or ${evalVal(b.inputs?.b)})`;
      case "logic_not": return `(not ${evalVal(b.inputs?.a)})`;
      default: return "0";
    }
  }

  switch (block.type) {
    case "when_flag_clicked":
      code += `${pad}def when_green_flag_clicked():\n`;
      break;
    case "when_sprite_clicked":
      code += `${pad}def when_this_sprite_clicked():\n`;
      break;
    case "when_key_pressed":
      code += `${pad}def when_key_${inputs.key || "space"}_pressed():\n`;
      break;
    case "when_receive_message":
      code += `${pad}def when_I_receive_${inputs.message || "message1"}():\n`;
      break;

    case "move_right":
      code += `${pad}sprite.move_x(${evalVal(inputs.steps)})\n`;
      break;
    case "move_left":
      code += `${pad}sprite.move_x(-${evalVal(inputs.steps)})\n`;
      break;
    case "move_up":
      code += `${pad}sprite.move_y(-${evalVal(inputs.steps)})\n`;
      break;
    case "move_down":
      code += `${pad}sprite.move_y(${evalVal(inputs.steps)})\n`;
      break;
    case "turn_cw":
      code += `${pad}sprite.rotate(${evalVal(inputs.degrees)})\n`;
      break;
    case "turn_ccw":
      code += `${pad}sprite.rotate(-${evalVal(inputs.degrees)})\n`;
      break;
    case "point_direction":
      code += `${pad}sprite.point_in_direction(${evalVal(inputs.degrees)})\n`;
      break;
    case "go_to_random":
      code += `${pad}sprite.go_to_random_position()\n`;
      break;
    case "go_to_xy":
      code += `${pad}sprite.go_to(${evalVal(inputs.x)}, ${evalVal(inputs.y)})\n`;
      break;
    case "glide_to_xy":
      code += `${pad}sprite.glide(${evalVal(inputs.duration)}, ${evalVal(inputs.x)}, ${evalVal(inputs.y)})\n`;
      break;

    case "say_text":
      code += `${pad}sprite.say("${inputs.text || ""}")\n`;
      break;
    case "show":
      code += `${pad}sprite.show()\n`;
      break;
    case "hide":
      code += `${pad}sprite.hide()\n`;
      break;
    case "switch_costume":
      code += `${pad}sprite.switch_costume(${evalVal(inputs.costume)})\n`;
      break;
    case "change_size":
      code += `${pad}sprite.change_size_by(${evalVal(inputs.percent)})\n`;
      break;

    case "wait":
      code += `${pad}time.sleep(${evalVal(inputs.seconds)})\n`;
      break;

    case "repeat": {
      code += `${pad}for _ in range(${evalVal(inputs.times)}):\n`;
      if (block.children && block.children.length > 0) {
        block.children.forEach((child) => {
          code += generateBlockPython(child, indent + 1);
        });
      } else {
        code += `${pad}    pass\n`;
      }
      break;
    }

    case "forever": {
      code += `${pad}while True:\n`;
      if (block.children && block.children.length > 0) {
        block.children.forEach((child) => {
          code += generateBlockPython(child, indent + 1);
        });
      } else {
        code += `${pad}    pass\n`;
      }
      break;
    }

    case "if_then": {
      code += `${pad}if ${evalVal(inputs.condition)}:\n`;
      if (block.children && block.children.length > 0) {
        block.children.forEach((child) => {
          code += generateBlockPython(child, indent + 1);
        });
      } else {
        code += `${pad}    pass\n`;
      }
      break;
    }

    case "if_else": {
      code += `${pad}if ${evalVal(inputs.condition)}:\n`;
      if (block.children && block.children.length > 0) {
        block.children.forEach((child) => {
          code += generateBlockPython(child, indent + 1);
        });
      } else {
        code += `${pad}    pass\n`;
      }
      code += `${pad}else:\n`;
      if (block.elseChildren && block.elseChildren.length > 0) {
        block.elseChildren.forEach((child) => {
          code += generateBlockPython(child, indent + 1);
        });
      } else {
        code += `${pad}    pass\n`;
      }
      break;
    }

    case "play_sound":
    case "play_sound_until_done":
      code += `${pad}sound.play("${inputs.sound || "pop"}")\n`;
      break;
    case "set_volume":
      code += `${pad}sound.set_volume(${evalVal(inputs.volume)})\n`;
      break;

    case "broadcast":
      code += `${pad}broadcast("${inputs.message || "message1"}")\n`;
      break;
    case "ask_and_wait":
      code += `${pad}answer = input("${inputs.question || "What is your name?"}")\n`;
      break;

    default:
      code += `${pad}# Block: ${block.type}\n`;
  }

  // Handle chain next
  if (block.next) {
    const nextIndent = block.type.startsWith("when_") ? indent + 1 : indent;
    code += generateBlockPython(block.next, nextIndent);
  }

  return code;
}
