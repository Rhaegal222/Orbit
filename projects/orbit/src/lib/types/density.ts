/** Supported visual density presets for operational Orbit surfaces. */
export type OrbitDensity = 'spacious' | 'comfortable' | 'compact' | 'dense';

/** Allows a composite primitive to inherit density from its nearest Orbit shell. */
export type OrbitDensityOverride = OrbitDensity | 'inherit';
