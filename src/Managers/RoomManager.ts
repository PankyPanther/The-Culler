import { roomOBJData, RoomRoles, interactableRoomOBJData } from "definitions"
import { getOpenSpaces } from "Utility/getOpenSpaces"

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

        this.findStaticTasks(room)
        this.findDynamicTasks(room)
    }

    findStaticTasks(room: Room){
        for (const source of room.memory.Sources) {
            for (const openPos of source.openPositions){
                room.memory.taskList.push({taskName: "Harvest", bodyTypeName: "BootstrapWorker", pos: {x: openPos.x, y: openPos.y}, target: source.Id})
            }
        }

        for (const controller of room.memory.Controller) {
            for (const openPos of controller.openPositions){
                room.memory.taskList.push({taskName: "Upgrade", bodyTypeName: "BootstrapWorker", pos: {x: openPos.x, y: openPos.y}, target: controller.Id})
            }
        }
    }

    findDynamicTasks(room: Room){
        const structures = room.find(FIND_STRUCTURES, {
            filter: (structure): structure is StructureSpawn | StructureExtension => {
                return structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_EXTENSION;
            }
        })

        console.log(structures.length)

        for (const structure of structures){
            const tData = {taskName: "Store", bodyTypeName: "BootstrapHarvester", pos: {x: structure.pos.x, y: structure.pos.y}, target: structure.id}
            if (structure.store.getFreeCapacity() !== 0 && !room.memory.taskList.includes({taskName: "Store", bodyTypeName: "BootstrapWorker", pos: {x: structure.pos.x, y: structure.pos.y}, target: structure.id})){
                const openPos = getOpenSpaces({x: structure.pos.x, y: structure.pos.y}, room, 1).sort(() => Math.random() - 0.5)[0];
                room.memory.taskList.push({taskName: "Store", bodyTypeName: "BootstrapWorker", pos: {x: openPos.x, y: openPos.y}, target: structure.id})
            }
        }
    }
}