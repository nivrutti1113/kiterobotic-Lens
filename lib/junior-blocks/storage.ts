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
          // 1. Right Arrow -> Move Right 20 steps
          {
            id: "b_arrow_right",
            type: "when_key_pressed",
            category: "events",
            inputs: { key: "RightArrow" },
            x: 30,
            y: 30,
            next: {
              id: "b_move_right_20",
              type: "move_right",
              category: "movement",
              inputs: { steps: 20 },
            },
          },
          // 2. Left Arrow -> Move Left 20 steps
          {
            id: "b_arrow_left",
            type: "when_key_pressed",
            category: "events",
            inputs: { key: "LeftArrow" },
            x: 270,
            y: 30,
            next: {
              id: "b_move_left_20",
              type: "move_left",
              category: "movement",
              inputs: { steps: 20 },
            },
          },
          // 3. Up Arrow -> Move Up 20 steps
          {
            id: "b_arrow_up",
            type: "when_key_pressed",
            category: "events",
            inputs: { key: "UpArrow" },
            x: 30,
            y: 150,
            next: {
              id: "b_move_up_20",
              type: "move_up",
              category: "movement",
              inputs: { steps: 20 },
            },
          },
          // 4. Down Arrow -> Move Down 20 steps
          {
            id: "b_arrow_down",
            type: "when_key_pressed",
            category: "events",
            inputs: { key: "DownArrow" },
            x: 270,
            y: 150,
            next: {
              id: "b_move_down_20",
              type: "move_down",
              category: "movement",
              inputs: { steps: 20 },
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
