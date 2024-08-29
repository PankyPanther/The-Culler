import { Coord } from "definitions";

export function getOpenSpaces(coord: Coord, room: Room, radius: number, gridSize: number = 50): Coord[] {
    const terrain = new Room.Terrain(room.name)
    const adjacentPositions: Coord[] = [];

    for (let dx = -radius; dx <= radius; dx++) {
        for (let dy = -radius; dy <= radius; dy++) {
            // Skip the center point itself (dx=0, dy=0)
            if (dx === 0 && dy === 0) continue;

            const newX = coord.x + dx;
            const newY = coord.y + dy;

            if (newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize && terrain.get(newX, newY) !== TERRAIN_MASK_WALL) {
                adjacentPositions.push({ x: newX, y: newY });
            }
        }
    }

    return adjacentPositions;
}