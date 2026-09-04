import { BlockInstance, Project, Sprite } from "./types";
import { soundSynth } from "./sound-synth";

type EventCallback = () => void;

export class InterpreterEngine {
  private project: Project | null = null;
  private isRunning: boolean = false;
  private activeThreads: Set<string> = new Set();
  private onUpdateCallback: ((project: Project) => void) | null = null;
  private onStateChangeCallback: ((running: boolean) => void) | null = null;
  private askPromptCallback: ((prompt: string | null) => void) | null = null;
  private answerValue: string = "";
  private waitingForAnswer: boolean = false;
  private broadcastListeners: Map<string, Array<{ spriteId: string; block: BlockInstance }>> = new Map();

  public subscribeStateChange(cb: (running: boolean) => void) {
    this.onStateChangeCallback = cb;
  }

  public subscribeAskPrompt(cb: (prompt: string | null) => void) {
    this.askPromptCallback = cb;
  }

  public submitAnswer(answer: string) {
    this.answerValue = answer;
    this.waitingForAnswer = false;
    if (this.askPromptCallback) this.askPromptCallback(null);
  }

  public getIsRunning(): boolean {
    return this.isRunning;
  }

  public stopAll() {
    this.isRunning = false;
    this.activeThreads.clear();
    this.waitingForAnswer = false;
    if (this.askPromptCallback) this.askPromptCallback(null);
    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
  }

  public async runProject(
    project: Project,
    onUpdate: (project: Project) => void,
    hatFilter: "flag" | "click" | "key" | "broadcast" = "flag",
    filterPayload?: { spriteId?: string; key?: string; message?: string }
  ) {
    this.stopAll();
    this.project = JSON.parse(JSON.stringify(project));
    this.onUpdateCallback = onUpdate;
    this.isRunning = true;
    if (this.onStateChangeCallback) this.onStateChangeCallback(true);

    // Build broadcast mapping
    this.broadcastListeners.clear();
    for (const sprite of this.project!.sprites) {
      for (const script of sprite.scripts) {
        if (script.type === "when_receive_message") {
          const msg = String(script.inputs?.message || "message1");
          if (!this.broadcastListeners.has(msg)) {
            this.broadcastListeners.set(msg, []);
          }
          this.broadcastListeners.get(msg)!.push({ spriteId: sprite.id, block: script });
        }
      }
    }

    const promises: Promise<void>[] = [];

    for (const sprite of this.project!.sprites) {
      if (filterPayload?.spriteId && sprite.id !== filterPayload.spriteId) {
        continue;
      }

      const hasFlagHat = sprite.scripts.some((s) => s.type === "when_flag_clicked");

      for (const script of sprite.scripts) {
        let shouldTrigger = false;

        if (hatFilter === "flag") {
          if (script.type === "when_flag_clicked") {
            shouldTrigger = true;
          } else if (!hasFlagHat) {
            // Run orphan scripts directly on Green Flag if no flag hat block exists!
            shouldTrigger = true;
          }
        } else if (hatFilter === "click" && script.type === "when_sprite_clicked") {
          shouldTrigger = true;
        } else if (hatFilter === "key" && script.type === "when_key_pressed") {
          const targetKey = String(script.inputs?.key || "space").toLowerCase();
          const pressedKey = (filterPayload?.key || "").toLowerCase();
          if (targetKey === pressedKey || (targetKey === "space" && (pressedKey === " " || pressedKey === "space"))) {
            shouldTrigger = true;
          }
        } else if (hatFilter === "broadcast" && script.type === "when_receive_message") {
          const targetMsg = String(script.inputs?.message || "message1");
          if (targetMsg === filterPayload?.message) {
            shouldTrigger = true;
          }
        }

        if (shouldTrigger) {
          const startBlock = script.type.startsWith("when_") ? script.next : script;
          if (startBlock) {
            const threadId = `${sprite.id}_${script.id}_${Math.random()}`;
            this.activeThreads.add(threadId);
            promises.push(this.executeChain(sprite.id, startBlock, threadId));
          }
        }
      }
    }

    await Promise.all(promises);
    if (this.activeThreads.size === 0) {
      this.stopAll();
    }
  }

  private async executeChain(spriteId: string, startBlock: BlockInstance | undefined, threadId: string): Promise<void> {
    let current: BlockInstance | undefined = startBlock;

    while (current && this.isRunning && this.activeThreads.has(threadId)) {
      const sprite = this.project?.sprites.find((s) => s.id === spriteId);
      if (!sprite) break;

      await this.executeSingleBlock(sprite, current, threadId);
      current = current.next;
    }

    this.activeThreads.delete(threadId);
  }

  private evaluateInput(sprite: Sprite, val: number | string | BlockInstance | undefined): number | string | boolean {
    if (val === undefined || val === null) return 0;
    if (typeof val === "number" || typeof val === "boolean") return val;
    if (typeof val === "string") {
      const num = Number(val);
      return isNaN(num) ? val : num;
    }

    // BlockInstance reporter or boolean operator block
    const block = val as BlockInstance;
    const inputs = block.inputs || {};

    switch (block.type) {
      case "compare_less":
        return Number(this.evaluateInput(sprite, inputs.a)) < Number(this.evaluateInput(sprite, inputs.b));
      case "compare_equal":
        return String(this.evaluateInput(sprite, inputs.a)) === String(this.evaluateInput(sprite, inputs.b));
      case "compare_greater":
        return Number(this.evaluateInput(sprite, inputs.a)) > Number(this.evaluateInput(sprite, inputs.b));
      case "math_add":
        return Number(this.evaluateInput(sprite, inputs.a)) + Number(this.evaluateInput(sprite, inputs.b));
      case "math_subtract":
        return Number(this.evaluateInput(sprite, inputs.a)) - Number(this.evaluateInput(sprite, inputs.b));
      case "math_multiply":
        return Number(this.evaluateInput(sprite, inputs.a)) * Number(this.evaluateInput(sprite, inputs.b));
      case "math_divide": {
        const denom = Number(this.evaluateInput(sprite, inputs.b));
        return denom === 0 ? 0 : Number(this.evaluateInput(sprite, inputs.a)) / denom;
      }
      case "logic_and":
        return Boolean(this.evaluateInput(sprite, inputs.a)) && Boolean(this.evaluateInput(sprite, inputs.b));
      case "logic_or":
        return Boolean(this.evaluateInput(sprite, inputs.a)) || Boolean(this.evaluateInput(sprite, inputs.b));
      case "logic_not":
        return !Boolean(this.evaluateInput(sprite, inputs.a));
      case "distance_to": {
        return Math.round(Math.hypot(sprite.x - 200, sprite.y - 150));
      }
      case "touching_target": {
        const target = String(inputs.target || "edge");
        if (target === "edge") {
          return sprite.x <= -180 || sprite.x >= 180 || sprite.y <= -130 || sprite.y >= 130;
        }
        return false;
      }
      case "qr_is_detected":
      case "face_is_detected":
      case "obj_is_detected":
      case "ocr_is_detected":
      case "speech_is_recognized":
        return true;
      case "qr_get_data":
        return "https://kiterobotics.in";
      case "face_count":
      case "obj_count":
        return 1;
      case "gpt_response":
        return "Robots love binary code!";
      case "translate_text":
        return String(inputs.text || "Hello") + " (Translated)";
      default:
        return 0;
    }
  }

  private async executeSingleBlock(sprite: Sprite, block: BlockInstance, threadId: string): Promise<void> {
    const inputs = block.inputs || {};

    switch (block.type) {
      case "move_right": {
        const steps = Number(this.evaluateInput(sprite, inputs.steps)) || 10;
        sprite.x = Math.min(200, sprite.x + steps);
        this.notifyUpdate();
        await this.delay(40);
        break;
      }
      case "move_left": {
        const steps = Number(this.evaluateInput(sprite, inputs.steps)) || 10;
        sprite.x = Math.max(-200, sprite.x - steps);
        this.notifyUpdate();
        await this.delay(40);
        break;
      }
      case "move_up": {
        const steps = Number(this.evaluateInput(sprite, inputs.steps)) || 10;
        sprite.y = Math.max(-150, sprite.y - steps);
        this.notifyUpdate();
        await this.delay(40);
        break;
      }
      case "move_down": {
        const steps = Number(this.evaluateInput(sprite, inputs.steps)) || 10;
        sprite.y = Math.min(150, sprite.y + steps);
        this.notifyUpdate();
        await this.delay(40);
        break;
      }
      case "turn_cw": {
        const deg = Number(this.evaluateInput(sprite, inputs.degrees)) || 15;
        sprite.rotation = (sprite.rotation + deg) % 360;
        this.notifyUpdate();
        await this.delay(40);
        break;
      }
      case "turn_ccw": {
        const deg = Number(this.evaluateInput(sprite, inputs.degrees)) || 15;
        sprite.rotation = (sprite.rotation - deg + 360) % 360;
        this.notifyUpdate();
        await this.delay(40);
        break;
      }
      case "point_direction": {
        const deg = Number(this.evaluateInput(sprite, inputs.degrees)) || 90;
        sprite.rotation = deg % 360;
        this.notifyUpdate();
        await this.delay(40);
        break;
      }
      case "go_to_random": {
        sprite.x = Math.floor(Math.random() * 320) - 160;
        sprite.y = Math.floor(Math.random() * 220) - 110;
        this.notifyUpdate();
        await this.delay(60);
        break;
      }
      case "go_to_xy": {
        const targetX = Number(this.evaluateInput(sprite, inputs.x)) || 0;
        const targetY = Number(this.evaluateInput(sprite, inputs.y)) || 0;
        sprite.x = Math.max(-200, Math.min(200, targetX));
        sprite.y = Math.max(-150, Math.min(150, targetY));
        this.notifyUpdate();
        await this.delay(40);
        break;
      }
      case "glide_to_xy": {
        const durationSec = Math.max(0.1, Number(this.evaluateInput(sprite, inputs.duration)) || 1);
        const targetX = Number(this.evaluateInput(sprite, inputs.x)) || 0;
        const targetY = Number(this.evaluateInput(sprite, inputs.y)) || 0;
        const startX = sprite.x;
        const startY = sprite.y;
        const startTime = Date.now();
        const totalMs = durationSec * 1000;

        while (this.isRunning && Date.now() - startTime < totalMs) {
          const progress = (Date.now() - startTime) / totalMs;
          sprite.x = startX + (targetX - startX) * progress;
          sprite.y = startY + (targetY - startY) * progress;
          this.notifyUpdate();
          await this.delay(16);
        }
        sprite.x = targetX;
        sprite.y = targetY;
        this.notifyUpdate();
        break;
      }

      case "say_text": {
        const text = String(this.evaluateInput(sprite, inputs.text) || "Hello!");
        sprite.sayBubble = { text };
        this.notifyUpdate();
        await this.delay(1200);
        sprite.sayBubble = null;
        this.notifyUpdate();
        break;
      }
      case "show": {
        sprite.visible = true;
        this.notifyUpdate();
        break;
      }
      case "hide": {
        sprite.visible = false;
        this.notifyUpdate();
        break;
      }
      case "switch_costume": {
        const costumeVal = String(inputs.costume || "next");
        if (costumeVal === "next") {
          sprite.currentCostumeIndex = (sprite.currentCostumeIndex + 1) % (sprite.costumes.length || 1);
        } else {
          const idx = parseInt(costumeVal, 10);
          if (!isNaN(idx) && idx >= 0 && idx < sprite.costumes.length) {
            sprite.currentCostumeIndex = idx;
          }
        }
        if (sprite.costumes[sprite.currentCostumeIndex]) {
          sprite.costumeUrl = sprite.costumes[sprite.currentCostumeIndex].svg;
        }
        this.notifyUpdate();
        break;
      }
      case "change_size": {
        const percent = Number(this.evaluateInput(sprite, inputs.percent)) || 10;
        sprite.size = Math.max(10, Math.min(300, sprite.size + percent));
        this.notifyUpdate();
        break;
      }

      case "wait": {
        const secs = Math.max(0.05, Number(this.evaluateInput(sprite, inputs.seconds)) || 1);
        await this.delay(secs * 1000);
        break;
      }

      case "repeat": {
        const times = Math.max(0, Math.floor(Number(this.evaluateInput(sprite, inputs.times)) || 10));
        const children = block.children || [];
        for (let i = 0; i < times && this.isRunning; i++) {
          for (const child of children) {
            if (!this.isRunning) break;
            await this.executeSingleBlock(sprite, child, threadId);
            if (child.next) {
              await this.executeChainFromBlock(sprite, child.next, threadId);
            }
          }
        }
        break;
      }

      case "forever": {
        const children = block.children || [];
        while (this.isRunning) {
          for (const child of children) {
            if (!this.isRunning) break;
            await this.executeSingleBlock(sprite, child, threadId);
            if (child.next) {
              await this.executeChainFromBlock(sprite, child.next, threadId);
            }
          }
          await this.delay(16);
        }
        break;
      }

      case "if_then": {
        const cond = Boolean(this.evaluateInput(sprite, inputs.condition));
        if (cond) {
          const children = block.children || [];
          for (const child of children) {
            if (!this.isRunning) break;
            await this.executeSingleBlock(sprite, child, threadId);
            if (child.next) {
              await this.executeChainFromBlock(sprite, child.next, threadId);
            }
          }
        }
        break;
      }

      case "if_else": {
        const cond = Boolean(this.evaluateInput(sprite, inputs.condition));
        const targetChildren = cond ? block.children || [] : block.elseChildren || [];
        for (const child of targetChildren) {
          if (!this.isRunning) break;
          await this.executeSingleBlock(sprite, child, threadId);
          if (child.next) {
            await this.executeChainFromBlock(sprite, child.next, threadId);
          }
        }
        break;
      }

      case "stop_script": {
        this.activeThreads.delete(threadId);
        break;
      }

      case "stop_all": {
        this.stopAll();
        break;
      }

      case "play_sound":
      case "play_sound_until_done": {
        const soundName = String(inputs.sound || "pop");
        await soundSynth.playSound(soundName);
        if (block.type === "play_sound_until_done") {
          await this.delay(300);
        }
        break;
      }

      case "set_volume": {
        const vol = Number(this.evaluateInput(sprite, inputs.volume)) || 100;
        soundSynth.setVolume(vol);
        break;
      }

      case "broadcast": {
        const msg = String(inputs.message || "message1");
        const listeners = this.broadcastListeners.get(msg) || [];
        for (const listener of listeners) {
          if (listener.block.next) {
            const newThread = `${listener.spriteId}_msg_${Math.random()}`;
            this.activeThreads.add(newThread);
            this.executeChain(listener.spriteId, listener.block.next, newThread);
          }
        }
        break;
      }

      case "ask_and_wait": {
        const question = String(inputs.question || "What's your name?");
        this.waitingForAnswer = true;
        if (this.askPromptCallback) this.askPromptCallback(question);

        while (this.waitingForAnswer && this.isRunning) {
          await this.delay(100);
        }
        break;
      }

      // --- EXTENSION BLOCK RUNTIME HANDLERS ---
      case "gpt_ask": {
        const promptText = String(this.evaluateInput(sprite, inputs.prompt) || "Hello!");
        sprite.sayBubble = { text: `🤖 AI Thinking: "${promptText}"` };
        this.notifyUpdate();
        await this.delay(1500);
        sprite.sayBubble = { text: "🤖 AI Answer: Robots love coding!" };
        this.notifyUpdate();
        await this.delay(2000);
        sprite.sayBubble = null;
        this.notifyUpdate();
        break;
      }

      case "tts_speak": {
        const phrase = String(this.evaluateInput(sprite, inputs.phrase) || "Hello!");
        sprite.sayBubble = { text: `🗣️ "${phrase}"` };
        this.notifyUpdate();
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          const utter = new SpeechSynthesisUtterance(phrase);
          window.speechSynthesis.speak(utter);
        }
        await this.delay(1500);
        sprite.sayBubble = null;
        this.notifyUpdate();
        break;
      }

      case "qr_turn_video":
      case "face_turn_video":
      case "obj_turn_video": {
        sprite.sayBubble = { text: "📷 Stage Camera Feed Active" };
        this.notifyUpdate();
        await this.delay(1000);
        sprite.sayBubble = null;
        this.notifyUpdate();
        break;
      }

      case "qr_analyse_camera":
      case "face_analyse_camera":
      case "obj_analyse":
      case "ocr_analyse":
      case "body_analyse": {
        sprite.sayBubble = { text: "🔍 Analysing camera frame..." };
        this.notifyUpdate();
        await this.delay(1000);
        sprite.sayBubble = { text: "✅ Target detected!" };
        this.notifyUpdate();
        await this.delay(1000);
        sprite.sayBubble = null;
        this.notifyUpdate();
        break;
      }

      case "music_play_note":
      case "music_play_drum": {
        await soundSynth.playSound("ding");
        break;
      }

      case "physics_apply_force": {
        const fx = Number(this.evaluateInput(sprite, inputs.fx)) || 20;
        sprite.x = Math.min(200, sprite.x + fx);
        this.notifyUpdate();
        await this.delay(50);
        break;
      }

      default: {
        // Fallback generic block execution with update notification
        this.notifyUpdate();
        await this.delay(30);
        break;
      }
    }
  }

  private async executeChainFromBlock(sprite: Sprite, startBlock: BlockInstance, threadId: string): Promise<void> {
    let current: BlockInstance | undefined = startBlock;
    while (current && this.isRunning && this.activeThreads.has(threadId)) {
      await this.executeSingleBlock(sprite, current, threadId);
      current = current.next;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private notifyUpdate() {
    if (this.onUpdateCallback && this.project) {
      this.onUpdateCallback({ ...this.project });
    }
  }
}

export const interpreterEngine = new InterpreterEngine();
