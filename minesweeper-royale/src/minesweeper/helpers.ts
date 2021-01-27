import { Settings, GameStatus, Space, Coord, SpaceStatus } from './types';

// Get an array of coordinates for spaces that are adjacent to the coordinates
// passed as input.
export function getNeighborhoodCoords([r, c]: Coord, {rows, cols}: Settings): Coord[] {
  const neighborhoodCoords: Coord[] = [];
  for (let i = Math.max(0, r - 1); i <= Math.min(rows - 1, r + 1); i++) {
    for (let j = Math.max(0, c - 1); j <= Math.min(cols - 1, c + 1); j++) {
      if (i === r && j === c)
        continue;
      neighborhoodCoords.push([i, j]);
    }
  }
  return neighborhoodCoords;
}
