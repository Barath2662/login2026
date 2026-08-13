export interface Coord {
  x: number;
  y: number;
  labelPos?: 'top' | 'bottom' | 'left' | 'right';
}

export const RIFT_COORDS_DESKTOP: Coord[] = [
  { x: 5, y: 50, labelPos: 'bottom' },
  { x: 15, y: 30, labelPos: 'top' },
  { x: 25, y: 70, labelPos: 'bottom' },
  { x: 35, y: 25, labelPos: 'top' },
  { x: 45, y: 75, labelPos: 'bottom' },
  { x: 55, y: 30, labelPos: 'top' },
  { x: 65, y: 70, labelPos: 'bottom' },
  { x: 75, y: 25, labelPos: 'top' },
  { x: 85, y: 65, labelPos: 'bottom' },
  { x: 95, y: 40, labelPos: 'top' },
  { x: 110, y: 45, labelPos: 'right' }, // World 11 - disconnected
];

export const RIFT_COORDS_MOBILE: Coord[] = [
  { x: 50, y: 5, labelPos: 'left' },
  { x: 30, y: 15, labelPos: 'right' },
  { x: 70, y: 25, labelPos: 'left' },
  { x: 25, y: 35, labelPos: 'right' },
  { x: 75, y: 45, labelPos: 'left' },
  { x: 30, y: 55, labelPos: 'right' },
  { x: 70, y: 65, labelPos: 'left' },
  { x: 25, y: 75, labelPos: 'right' },
  { x: 65, y: 85, labelPos: 'left' },
  { x: 40, y: 95, labelPos: 'right' },
  { x: 45, y: 110, labelPos: 'bottom' }, // World 11 - disconnected
];
