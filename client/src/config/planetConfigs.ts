export interface PlanetThemeConfig {
  geometryType: 'sphere' | 'icosahedron' | 'octahedron' | 'dodecahedron' | 'displaced';
  ringStyle: 'none' | 'solid-silver' | 'solid-red' | 'debris' | 'satin';
  hasPolarBeams: boolean;
  coreRoughness: number;
  coreMetalness: number;
  primaryColor?: string;
  secondaryColor?: string;
  wireframeShield?: boolean;
  hasRings?: boolean;
}

export const PLANET_CONFIGS: Record<string, PlanetThemeConfig> = {
  'hackathon': {
    geometryType: 'sphere',
    ringStyle: 'solid-silver',
    hasPolarBeams: false,
    coreRoughness: 0.2,
    coreMetalness: 0.8,
  },
  'cyber-security': {
    geometryType: 'icosahedron',
    ringStyle: 'none',
    hasPolarBeams: false,
    coreRoughness: 0.8,
    coreMetalness: 0.2,
  },
  'competitive-coding': {
    geometryType: 'sphere',
    ringStyle: 'solid-red', // Accretion disk
    hasPolarBeams: false,
    coreRoughness: 0.9, // Matte black core
    coreMetalness: 0.1,
  },
  'ai-data-science': {
    geometryType: 'sphere',
    ringStyle: 'none',
    hasPolarBeams: true,
    coreRoughness: 0.6,
    coreMetalness: 0.4,
  },
  'esports': {
    geometryType: 'displaced',
    ringStyle: 'debris',
    hasPolarBeams: false,
    coreRoughness: 0.9,
    coreMetalness: 0.1,
  },
  'tech-quiz': {
    geometryType: 'octahedron',
    ringStyle: 'none',
    hasPolarBeams: true,
    coreRoughness: 0.3,
    coreMetalness: 0.7,
  },
  'ui-ux': {
    geometryType: 'sphere',
    ringStyle: 'satin',
    hasPolarBeams: false,
    coreRoughness: 0.1,
    coreMetalness: 0.9, // Very smooth/iridescent
  },
  'default': {
    geometryType: 'sphere',
    ringStyle: 'none',
    hasPolarBeams: false,
    coreRoughness: 0.5,
    coreMetalness: 0.5,
  }
};

export const getPlanetConfig = (category: string): PlanetThemeConfig => {
  return PLANET_CONFIGS[category] || PLANET_CONFIGS['default'];
};
