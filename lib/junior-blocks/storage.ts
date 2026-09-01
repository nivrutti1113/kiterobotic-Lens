import { Project } from "./types";
import { SPRITE_CATALOG } from "./catalog";

const LOCAL_STORAGE_KEY = "kms-ai-project";

export function createDefaultProject(): Project {
  const defaultSprite = SPRITE_CATALOG[0]; // KMS Kite Bot
  const teddySprite = SPRITE_CATALOG.find((s) => s.id === 'friendly_bear') || SPRITE_CATALOG[2];

  return {
    id: "proj_" + Date.now(),
    name: "My First Robot Project",
    backdropUrl: "bg_white",
    gridVisible: true,
    sprites: [
      {
        id: "sprite_kite_bot",
        name: defaultSprite.name,
        costumeUrl: defaultSprite.svg,
        costumes: defaultSprite.costumes,
        currentCostumeIndex: 0,
        x: -40,
        y: 0,
        rotation: 0,
        size: 100,
        visible: true,
        scripts: [
          {
            id: "b_hat_1",
            type: "when_flag_clicked",
            category: "events",
            inputs: {},
            x: 40,
            y: 40,
            next: {
              id: "b_say_1",
              type: "say_text",
              category: "looks",
              inputs: { text: "Hello KMS-AI!" },
              next: {
                id: "b_repeat_1",
                type: "repeat",
                category: "control",
                inputs: { times: 4 },
                children: [
                  {
                    id: "b_move_1",
                    type: "move_right",
                    category: "movement",
                    inputs: { steps: 30 },
                    next: {
                      id: "b_turn_1",
                      type: "turn_cw",
                      category: "movement",
                      inputs: { degrees: 90 },
                      next: {
                        id: "b_wait_1",
                        type: "wait",
                        category: "control",
                        inputs: { seconds: 0.3 },
                      },
                    },
                  },
                ],
                next: {
                  id: "b_sound_1",
                  type: "play_sound",
                  category: "sound",
                  inputs: { sound: "ding" },
                },
              },
            },
          },
        ],
      },
      {
        id: "sprite_teddy_bear",
        name: teddySprite.name,
        costumeUrl: teddySprite.svg,
        costumes: teddySprite.costumes,
        currentCostumeIndex: 0,
        x: 40,
        y: 0,
        rotation: 0,
        size: 90,
        visible: true,
        scripts: [],
      },
    ],
  };
}

export function saveProjectToStorage(project: Project): void {
  if (typeof window === "undefined") return;
  try {
    const json = JSON.stringify(project);
    localStorage.setItem(LOCAL_STORAGE_KEY, json);
  } catch (err) {
    console.error("Failed to save project to localStorage", err);
  }
}

export function loadProjectFromStorage(): Project {
  if (typeof window === "undefined") return createDefaultProject();
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.sprites && Array.isArray(parsed.sprites)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load project from localStorage", err);
  }
  return createDefaultProject();
}

export function exportProjectAsJSON(project: Project): void {
  const jsonStr = JSON.stringify(project, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${project.name.toLowerCase().replace(/\s+/g, "_")}_kms_ai.json`;
  a.click();
  URL.revokeObjectURL(url);
}
