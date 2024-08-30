import { roomOBJData, RoomRoles, interactableRoomOBJData } from "definitions"
import { getOpenSpaces } from "Utility/getOpenSpaces"
import { BodyTypeName } from "./SpawningManager"

export class RoomManager {
    initRoom(room: Room, role: RoomRoles){
        if (!Memory.rooms){
            Memory.rooms = {}
        }

        Memory.rooms[room.name] = {
            role: role,
            taskList: [],
            spawnList: [],
            Sources: [],
            Minerals: [],
            Controller: [],
            Spawns: []
        }

        if (role === "Citadel"){
            const initialCreeps: BodyTypeName[] = ["BootStrapHauler", "BootStrapHauler", "BootstrapUpgrader", "BootstrapUpgrader", "BootstrapWorker", "BootstrapWorker", "BootstrapWorker"]
            for (const creep of initialCreeps){
                room.memory.spawnList.push(creep)  
            }
        }
        
        const sources: Source[] = room.find(FIND_SOURCES)
        const minerals: Mineral[] = room.find(FIND_MINERALS)
        const spawns: StructureSpawn[] = room.find(FIND_MY_SPAWNS)

        if (sources.length){
            for (let source of sources){
                const sourceData: interactableRoomOBJData = {
                    Id: source.id,
                    coord: {
                        x: source.pos.x,
                        y: source.pos.y
                    },
                    roomName: source.room.name,
                    openPositions: getOpenSpaces({x: source.pos.x, y: source.pos.y}, room, 1)
                }
                room.memory.Sources.push(sourceData)
            }
        }

        if (minerals.length){
            for (let mineral of minerals){
                const mineralData: interactableRoomOBJData = {
                    Id: mineral.id,
                    coord: {
                        x: mineral.pos.x,
                        y: mineral.pos.y
                    },
                    roomName: mineral.room!.name,
                    openPositions: getOpenSpaces({x: mineral.pos.x, y: mineral.pos.y}, room, 1)
                }
                room.memory.Minerals.push(mineralData) 
            }
        }

        if (room.controller){
            const controllerData: interactableRoomOBJData = {
                Id: room.controller.id,
                coord: {
                    x: room.controller.pos.x,
                    y: room.controller.pos.y
                },
                roomName: room.controller.room.name,
                openPositions: getOpenSpaces({x: room.controller.pos.x, y: room.controller.pos.y}, room, 1)
            }
            room.memory.Controller.push(controllerData) 
        }

        if (spawns.length){
            for (let spawn of spawns){
                const spawnData: roomOBJData = {
                    Id: spawn.id,
                    coord: {
                        x: spawn.pos.x,
                        y: spawn.pos.y
                    },
                    roomName: spawn.room.name
                }
                room.memory.Spawns.push(spawnData) 
            }
        }
    }
}