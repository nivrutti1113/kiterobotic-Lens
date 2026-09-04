export type Category = 
  | "movement" 
  | "looks" 
  | "events" 
  | "control" 
  | "sound" 
  | "sensing" 
  | "operators"
  | "variables"
  | string;

export type BlockShape = 
  | "hat" 
  | "stack" 
  | "c_block" 
  | "c_block_else" 
  | "reporter" 
  | "boolean";

export type InputType = "number" | "text" | "select" | "reporter";

export type InputDefinition = {
  name: string;
  label?: string;
  type: InputType;
  defaultValue: number | string;
  options?: { label: string; value: string }[];
};

export type BlockDefinition = {
  type: string;
  category: Category;
  shape: BlockShape;
  label: string; // E.g. "Move Right {steps} steps"
  inputs?: Record<string, InputDefinition>;
  color: string;
  sectionLabel?: string;
  hasCheckbox?: boolean;
};

// Data Model
export type BlockInstance = {
  id: string;
  type: string; // e.g. "move_right", "repeat", "if_else"
  category: Category;
  inputs: Record<string, number | string | BlockInstance>; // supports nested operator blocks
  children?: BlockInstance[]; // for C-shaped blocks (repeat/forever/if)
  elseChildren?: BlockInstance[]; // for if-else block
  next?: BlockInstance; // next block snapped below
  x?: number; // root position in workspace
  y?: number;
};

export type SpriteCostume = {
  id: string;
  name: string;
  svg: string;
};

export type Sprite = {
  id: string;
  name: string;
  costumeUrl: string; // SVG data URI or URL
  costumes: SpriteCostume[];
  currentCostumeIndex: number;
  x: number;
  y: number;
  rotation: number;
  size: number; // percent, 100 = default
  visible: boolean;
  scripts: BlockInstance[]; // each entry is a hat block + its chain
  sayBubble?: { text: string; timer?: number } | null;
};

export type Backdrop = {
  id: string;
  name: string;
  color?: string;
  svg?: string;
  category: string;
};

export type Project = {
  id: string;
  name: string;
  sprites: Sprite[];
  backdropUrl: string;
  gridVisible: boolean;
  extensions?: string[]; // IDs of active extensions
};

export type ExecutionState = {
  isRunning: boolean;
  activeBlockId: string | null;
  activeSpriteId: string | null;
  variables: Record<string, string | number>;
  answer: string;
  waitingForAnswer: boolean;
  askPrompt: string | null;
};
