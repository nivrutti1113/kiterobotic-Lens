import { Backdrop } from "./types";

export type SpriteTemplate = {
  id: string;
  name: string;
  category: "Robot" | "Animals" | "People" | "Fantasy" | "Dance" | "Music" | "Sports" | "Food" | "Fashion" | "Letters" | "Utility";
  svg: string;
  costumes: { id: string; name: string; svg: string }[];
};

export const SPRITE_CATALOG: SpriteTemplate[] = [
  {
    id: "kite_bot",
    name: "KMS Kite Bot",
    category: "Robot",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="30" width="50" height="45" rx="12" fill="#5B21B6" stroke="#4C1D95" stroke-width="3"/>
      <rect x="30" y="35" width="40" height="25" rx="6" fill="#06B6D4"/>
      <circle cx="42" cy="47" r="5" fill="#FFFFFF"/>
      <circle cx="42" cy="47" r="2.5" fill="#1E1B4B"/>
      <circle cx="58" cy="47" r="5" fill="#FFFFFF"/>
      <circle cx="58" cy="47" r="2.5" fill="#1E1B4B"/>
      <path d="M 40 68 Q 50 74 60 68" stroke="#F5C518" stroke-width="3" fill="none" stroke-linecap="round"/>
      <circle cx="50" cy="18" r="7" fill="#F5C518"/>
      <line x1="50" y1="25" x2="50" y2="30" stroke="#5B21B6" stroke-width="4"/>
      <circle cx="15" cy="52" r="6" fill="#F97316"/>
      <circle cx="85" cy="52" r="6" fill="#F97316"/>
      <rect x="32" y="75" width="12" height="15" rx="4" fill="#3B82F6"/>
      <rect x="56" y="75" width="12" height="15" rx="4" fill="#3B82F6"/>
    </svg>`,
    costumes: [
      {
        id: "c1",
        name: "Standard Bot",
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="30" width="50" height="45" rx="12" fill="#5B21B6" stroke="#4C1D95" stroke-width="3"/>
          <rect x="30" y="35" width="40" height="25" rx="6" fill="#06B6D4"/>
          <circle cx="42" cy="47" r="5" fill="#FFFFFF"/>
          <circle cx="42" cy="47" r="2.5" fill="#1E1B4B"/>
          <circle cx="58" cy="47" r="5" fill="#FFFFFF"/>
          <circle cx="58" cy="47" r="2.5" fill="#1E1B4B"/>
          <path d="M 40 68 Q 50 74 60 68" stroke="#F5C518" stroke-width="3" fill="none" stroke-linecap="round"/>
          <circle cx="50" cy="18" r="7" fill="#F5C518"/>
          <line x1="50" y1="25" x2="50" y2="30" stroke="#5B21B6" stroke-width="4"/>
          <circle cx="15" cy="52" r="6" fill="#F97316"/>
          <circle cx="85" cy="52" r="6" fill="#F97316"/>
          <rect x="32" y="75" width="12" height="15" rx="4" fill="#3B82F6"/>
          <rect x="56" y="75" width="12" height="15" rx="4" fill="#3B82F6"/>
        </svg>`
      },
      {
        id: "c2",
        name: "Happy Bot",
        svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="25" y="30" width="50" height="45" rx="12" fill="#3B82F6" stroke="#1D4ED8" stroke-width="3"/>
          <rect x="30" y="35" width="40" height="25" rx="6" fill="#F5C518"/>
          <circle cx="42" cy="47" r="5" fill="#FFFFFF"/>
          <path d="M 39 47 Q 42 43 45 47" stroke="#1E1B4B" stroke-width="2" fill="none"/>
          <circle cx="58" cy="47" r="5" fill="#FFFFFF"/>
          <path d="M 55 47 Q 58 43 61 47" stroke="#1E1B4B" stroke-width="2" fill="none"/>
          <path d="M 38 66 Q 50 78 62 66 Z" fill="#EF4444"/>
          <circle cx="50" cy="18" r="7" fill="#EF4444"/>
          <line x1="50" y1="25" x2="50" y2="30" stroke="#3B82F6" stroke-width="4"/>
          <rect x="32" y="75" width="12" height="15" rx="4" fill="#8B5CF6"/>
          <rect x="56" y="75" width="12" height="15" rx="4" fill="#8B5CF6"/>
        </svg>`
      }
    ]
  },
  {
    id: "rover_bot",
    name: "Wheeled Rover",
    category: "Robot",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="40" width="60" height="28" rx="8" fill="#F97316"/>
      <circle cx="30" cy="72" r="12" fill="#334155"/>
      <circle cx="30" cy="72" r="6" fill="#94A3B8"/>
      <circle cx="70" cy="72" r="12" fill="#334155"/>
      <circle cx="70" cy="72" r="6" fill="#94A3B8"/>
      <rect x="35" y="22" width="30" height="18" rx="4" fill="#0284C7"/>
      <circle cx="44" cy="31" r="3" fill="#67E8F9"/>
      <circle cx="56" cy="31" r="3" fill="#67E8F9"/>
      <line x1="50" y1="22" x2="50" y2="10" stroke="#F97316" stroke-width="3"/>
      <circle cx="50" cy="8" r="4" fill="#EF4444"/>
    </svg>`,
    costumes: [
      { id: "r1", name: "Rover Red", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="40" width="60" height="28" rx="8" fill="#EF4444"/><circle cx="30" cy="72" r="12" fill="#334155"/><circle cx="70" cy="72" r="12" fill="#334155"/></svg>` }
    ]
  },
  {
    id: "friendly_bear",
    name: "Teddy Bear",
    category: "Animals",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="12" fill="#B45309"/>
      <circle cx="72" cy="28" r="12" fill="#B45309"/>
      <circle cx="28" cy="28" r="6" fill="#FDE68A"/>
      <circle cx="72" cy="28" r="6" fill="#FDE68A"/>
      <circle cx="50" cy="45" r="28" fill="#D97706"/>
      <ellipse cx="50" cy="52" rx="14" ry="10" fill="#FDE68A"/>
      <circle cx="50" cy="48" r="4" fill="#1E293B"/>
      <circle cx="40" cy="40" r="4" fill="#1E293B"/>
      <circle cx="60" cy="40" r="4" fill="#1E293B"/>
      <ellipse cx="50" cy="75" rx="24" ry="20" fill="#D97706"/>
    </svg>`,
    costumes: [{ id: "b1", name: "Bear", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="45" r="28" fill="#D97706"/></svg>` }]
  },
  {
    id: "playful_ghost",
    name: "Spooky Ghost",
    category: "Fantasy",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 25 50 Q 25 15 50 15 Q 75 15 75 50 L 75 80 Q 65 90 55 80 Q 45 90 35 80 Q 25 90 25 80 Z" fill="#A855F7" stroke="#7E22CE" stroke-width="2"/>
      <circle cx="40" cy="40" r="6" fill="#FFFFFF"/>
      <circle cx="40" cy="40" r="3" fill="#1E1B4B"/>
      <circle cx="60" cy="40" r="6" fill="#FFFFFF"/>
      <circle cx="60" cy="40" r="3" fill="#1E1B4B"/>
      <ellipse cx="50" cy="55" rx="6" ry="8" fill="#1E1B4B"/>
    </svg>`,
    costumes: [{ id: "g1", name: "Ghost", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 25 50 Q 25 15 50 15 Q 75 15 75 50 Z" fill="#A855F7"/></svg>` }]
  },
  {
    id: "happy_boy",
    name: "Leo the Boy",
    category: "People",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="40" r="22" fill="#FDBA74"/>
      <path d="M 28 35 Q 50 15 72 35 Q 50 25 28 35 Z" fill="#78350F"/>
      <circle cx="42" cy="38" r="3" fill="#1E293B"/>
      <circle cx="58" cy="38" r="3" fill="#1E293B"/>
      <path d="M 43 48 Q 50 54 57 48" stroke="#EA580C" stroke-width="2" fill="none"/>
      <rect x="30" y="62" width="40" height="30" rx="8" fill="#3B82F6"/>
    </svg>`,
    costumes: [{ id: "hb1", name: "Boy", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="40" r="22" fill="#FDBA74"/></svg>` }]
  },
  {
    id: "creative_girl",
    name: "Maya the Girl",
    category: "People",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="40" r="22" fill="#FED7AA"/>
      <path d="M 25 45 Q 20 15 50 15 Q 80 15 75 45 Q 85 65 75 75 Q 50 25 25 75 Z" fill="#451A03"/>
      <circle cx="42" cy="38" r="3" fill="#1E293B"/>
      <circle cx="58" cy="38" r="3" fill="#1E293B"/>
      <path d="M 43 48 Q 50 54 57 48" stroke="#E11D48" stroke-width="2" fill="none"/>
      <rect x="32" y="62" width="36" height="30" rx="8" fill="#EC4899"/>
    </svg>`,
    costumes: [{ id: "cg1", name: "Girl", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="40" r="22" fill="#FED7AA"/></svg>` }]
  },
  {
    id: "star_dancer",
    name: "Star Dancer",
    category: "Dance",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="25" r="14" fill="#FBCFE8"/>
      <path d="M 30 45 L 70 45 L 50 85 Z" fill="#F43F5E"/>
      <line x1="30" y1="45" x2="15" y2="25" stroke="#F43F5E" stroke-width="5" stroke-linecap="round"/>
      <line x1="70" y1="45" x2="85" y2="25" stroke="#F43F5E" stroke-width="5" stroke-linecap="round"/>
    </svg>`,
    costumes: [{ id: "sd1", name: "Dancer", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="25" r="14" fill="#FBCFE8"/></svg>` }]
  },
  {
    id: "rocking_guitar",
    name: "Electric Guitar",
    category: "Music",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 35 60 Q 20 70 30 85 Q 50 95 65 80 Q 75 65 60 50 Z" fill="#EF4444"/>
      <circle cx="48" cy="68" r="8" fill="#1E293B"/>
      <rect x="58" y="20" width="6" height="35" fill="#CBD5E1" transform="rotate(30 58 20)"/>
    </svg>`,
    costumes: [{ id: "gtr1", name: "Guitar", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 35 60 L 65 80 Z" fill="#EF4444"/></svg>` }]
  },
  {
    id: "soccer_ball",
    name: "Soccer Ball",
    category: "Sports",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="38" fill="#FFFFFF" stroke="#0F172A" stroke-width="4"/>
      <polygon points="50,30 62,38 58,52 42,52 38,38" fill="#0F172A"/>
      <polygon points="50,70 62,62 58,48 42,48 38,62" fill="#0F172A"/>
    </svg>`,
    costumes: [{ id: "sb1", name: "Ball", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="38" fill="#FFFFFF"/></svg>` }]
  },
  {
    id: "fresh_apple",
    name: "Red Apple",
    category: "Food",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 50 30 Q 30 20 20 45 Q 15 75 50 88 Q 85 75 80 45 Q 70 20 50 30 Z" fill="#EF4444"/>
      <path d="M 50 30 Q 55 18 62 12" stroke="#78350F" stroke-width="4" fill="none"/>
      <path d="M 55 20 Q 70 15 65 28 Z" fill="#22C55E"/>
    </svg>`,
    costumes: [{ id: "ap1", name: "Apple", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 50 30 Z" fill="#EF4444"/></svg>` }]
  },
  {
    id: "sweet_banana",
    name: "Yellow Banana",
    category: "Food",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 20 30 Q 50 25 80 70 Q 50 85 20 30 Z" fill="#EAB308" stroke="#CA8A04" stroke-width="2"/>
    </svg>`,
    costumes: [{ id: "bn1", name: "Banana", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 20 30 Z" fill="#EAB308"/></svg>` }]
  },
  {
    id: "cool_cap",
    name: "Sports Cap",
    category: "Fashion",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 25 60 Q 25 30 50 30 Q 75 30 75 60 Z" fill="#0284C7"/>
      <path d="M 15 60 Q 50 65 85 60 Q 80 70 15 60 Z" fill="#0369A1"/>
    </svg>`,
    costumes: [{ id: "cp1", name: "Cap", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 25 60 Z" fill="#0284C7"/></svg>` }]
  },
  {
    id: "letter_a",
    name: "Letter A",
    category: "Letters",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="75" font-size="70" font-weight="900" text-anchor="middle" fill="#8B5CF6" font-family="sans-serif">A</text>
    </svg>`,
    costumes: [{ id: "la1", name: "Letter A", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text x="50" y="75" font-size="70" font-weight="900" text-anchor="middle" fill="#8B5CF6">A</text></svg>` }]
  },
  {
    id: "letter_b",
    name: "Letter B",
    category: "Letters",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="75" font-size="70" font-weight="900" text-anchor="middle" fill="#EC4899" font-family="sans-serif">B</text>
    </svg>`,
    costumes: [{ id: "lb1", name: "Letter B", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text x="50" y="75" font-size="70" font-weight="900" text-anchor="middle" fill="#EC4899">B</text></svg>` }]
  },
  {
    id: "magic_star",
    name: "Shining Star",
    category: "Fantasy",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,10 63,38 93,38 68,56 78,86 50,68 22,86 32,56 7,38 37,38" fill="#F5C518" stroke="#D97706" stroke-width="2"/>
    </svg>`,
    costumes: [{ id: "ms1", name: "Star", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,10 93,38 50,68" fill="#F5C518"/></svg>` }]
  },
  {
    id: "speed_rocket",
    name: "Speed Rocket",
    category: "Sports",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M 50 15 Q 70 40 65 75 L 35 75 Q 30 40 50 15 Z" fill="#EF4444"/>
      <circle cx="50" cy="45" r="8" fill="#FFFFFF"/>
      <circle cx="50" cy="45" r="4" fill="#0284C7"/>
      <polygon points="35,65 20,80 35,75" fill="#F97316"/>
      <polygon points="65,65 80,80 65,75" fill="#F97316"/>
      <polygon points="42,75 50,92 58,75" fill="#F5C518"/>
    </svg>`,
    costumes: [{ id: "sr1", name: "Rocket", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M 50 15 Z" fill="#EF4444"/></svg>` }]
  },
  {
    id: "treasure_chest",
    name: "Treasure Chest",
    category: "Utility",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="45" width="60" height="35" rx="4" fill="#92400E"/>
      <path d="M 20 45 Q 20 25 50 25 Q 80 25 80 45 Z" fill="#B45309"/>
      <rect x="45" y="42" width="10" height="15" rx="2" fill="#F5C518"/>
      <circle cx="50" cy="48" r="2" fill="#78350F"/>
    </svg>`,
    costumes: [{ id: "tc1", name: "Chest", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="45" width="60" height="35" fill="#92400E"/></svg>` }]
  },
  {
    id: "target_aim",
    name: "Target Ring",
    category: "Utility",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="35" fill="none" stroke="#EF4444" stroke-width="6"/>
      <circle cx="50" cy="50" r="22" fill="none" stroke="#FFFFFF" stroke-width="6"/>
      <circle cx="50" cy="50" r="10" fill="#EF4444"/>
    </svg>`,
    costumes: [{ id: "ta1", name: "Target", svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="35" fill="none" stroke="#EF4444"/></svg>` }]
  }
];

export const BACKDROP_CATALOG: Backdrop[] = [
  { id: "bg_white", name: "Plain White", color: "#FFFFFF", category: "Simple" },
  { id: "bg_grid", name: "Grid Ruler", color: "#F8FAFC", category: "Simple" },
  {
    id: "bg_blue_sky",
    name: "Blue Sky",
    category: "Outdoors",
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <rect width="400" height="300" fill="#7DD3FC"/>
      <circle cx="340" cy="60" r="35" fill="#FDE047"/>
      <path d="M 0 220 Q 100 180 200 220 Q 300 260 400 210 L 400 300 L 0 300 Z" fill="#4ADE80"/>
      <ellipse cx="80" cy="80" rx="35" ry="15" fill="#FFFFFF"/>
      <ellipse cx="220" cy="100" rx="45" ry="18" fill="#FFFFFF"/>
    </svg>`
  },
  {
    id: "bg_classroom",
    name: "Classroom",
    category: "Indoor",
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <rect width="400" height="230" fill="#FEF3C7"/>
      <rect y="230" width="400" height="70" fill="#D97706"/>
      <rect x="50" y="40" width="300" height="150" rx="8" fill="#064E3B" stroke="#78350F" stroke-width="10"/>
      <text x="200" y="120" font-size="28" fill="#FFFFFF" font-family="sans-serif" text-anchor="middle">KMS Robotics Studio</text>
    </svg>`
  },
  {
    id: "bg_space",
    name: "Cosmic Space",
    category: "Space",
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <rect width="400" height="300" fill="#090D16"/>
      <circle cx="50" cy="50" r="1.5" fill="#FFF"/>
      <circle cx="150" cy="120" r="2" fill="#FFF"/>
      <circle cx="280" cy="40" r="1" fill="#FFF"/>
      <circle cx="320" cy="200" r="2.5" fill="#FFF"/>
      <circle cx="90" cy="240" r="1" fill="#FFF"/>
      <circle cx="330" cy="80" r="30" fill="#E11D48"/>
      <ellipse cx="330" cy="80" rx="45" ry="8" fill="none" stroke="#FDA4AF" stroke-width="3" transform="rotate(-20 330 80)"/>
    </svg>`
  },
  {
    id: "bg_playground",
    name: "Playground Park",
    category: "Outdoors",
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <rect width="400" height="200" fill="#BAE6FD"/>
      <rect y="200" width="400" height="100" fill="#86EFAC"/>
      <path d="M 60 200 L 90 120 L 120 200 Z" fill="#F97316"/>
    </svg>`
  },
  {
    id: "bg_underwater",
    name: "Deep Underwater",
    category: "Nature",
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <rect width="400" height="300" fill="#0284C7"/>
      <path d="M 0 250 Q 100 230 200 260 Q 300 240 400 270 L 400 300 L 0 300 Z" fill="#FDE047"/>
      <circle cx="60" cy="100" r="8" fill="none" stroke="#BAE6FD" stroke-width="2"/>
      <circle cx="70" cy="70" r="5" fill="none" stroke="#BAE6FD" stroke-width="2"/>
    </svg>`
  },
  {
    id: "bg_stage",
    name: "Spotlight Stage",
    category: "Indoor",
    svg: `<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <rect width="400" height="220" fill="#312E81"/>
      <rect y="220" width="400" height="80" fill="#991B1B"/>
      <polygon points="50,0 350,0 280,220 120,220" fill="#FEF08A" opacity="0.3"/>
    </svg>`
  }
];
