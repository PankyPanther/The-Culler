import { BodyTypeName } from "Managers/SpawningManager"
import { TaskNames } from "Managers/TaskManager"

declare global {
    interface RoomMemory {
        role: RoomRoles
        taskList: taskData[]
        Sources: interactableRoomOBJData[]
        Minerals: interactableRoomOBJData[] 
        Controller: interactableRoomOBJData[]
        Spawns: roomOBJData[]
    }

    interface CreepMemory {
        bodyType: BodyTypeName
        tasks: TaskNames[]
        homeRoom: string
        workRoom: string | undefined
        taskData: taskData | undefined
    }
}

export type RoomRoles = "Citadel" | "Outland" | "Explored"

export interface Coord {
    x: number
    y: number
}

export interface roomOBJData {
    Id: string
    coord: Coord
    roomName: string
}

export interface interactableRoomOBJData extends roomOBJData {
    openPositions: Coord[]
}

export interface taskData {
    taskName: TaskNames
    bodyTypeName: BodyTypeName
    pos: Coord
    target: string // ID
}
