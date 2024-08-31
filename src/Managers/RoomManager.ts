import { roomOBJData, RoomRoles, interactableRoomOBJData, taskData } from "definitions"
import { getOpenSpaces } from "Utility/getOpenSpaces"
import { BodyTypeName } from "./SpawningManager"

export class RoomManager {
    initRoom(room: Room, role: RoomRoles){
        if (!Memory.rooms){
            Memory.rooms = {}
        }

        Memory.rooms[room.name] = {
            role: role,
            directiveLevel: 1,
            taskList: [],
            runningTask: [],
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

    private objectsAreEqual(obj1: any, obj2: any): boolean {
        if (Array.isArray(obj1) && Array.isArray(obj2)) {
            // Compare arrays
            if (obj1.length !== obj2.length) return false;
            for (let i = 0; i < obj1.length; i++) {
                if (!this.objectsAreEqual(obj1[i], obj2[i])) return false;
            }
            return true;
        } else if (typeof obj1 === 'object' && typeof obj2 === 'object' && obj1 !== null && obj2 !== null) {
            // Compare objects
            const keys1 = Object.keys(obj1);
            const keys2 = Object.keys(obj2);
            if (keys1.length !== keys2.length) return false;
            for (const key of keys1) {
                if (!this.objectsAreEqual(obj1[key], obj2[key])) return false;
            }
            return true;
        } else {
            // Compare primitive values (numbers, strings, etc.)
            return obj1 === obj2;
        }
    }

    findRoomTasks(room: Room){
        if (room.memory.directiveLevel === 1){
            for (const source of room.memory.Sources){
                for (const openPos of source.openPositions){
                    const data: taskData = {taskName: "Harvest", bodyTypeName: ["BootstrapWorker", "BootstrapUpgrader", "BootStrapHauler"], pos: {x: openPos.x, y: openPos.y}, target: source.Id}
                    if (!room.memory.taskList.some(task => this.objectsAreEqual(task, data)) && !room.memory.runningTask.some(task => this.objectsAreEqual(task, data))){
                        room.memory.taskList.push(data)
                    }
                }
            }

            const importantStructures = room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => 
                    structure.structureType === STRUCTURE_EXTENSION || 
                    structure.structureType === STRUCTURE_SPAWN
            }) as (StructureExtension | StructureSpawn)[];

            
            for (const structure of importantStructures){
                if (structure.store.getFreeCapacity() !== 0){
                    const openPos = getOpenSpaces({x: structure.pos.x, y: structure.pos.y}, room, 1)[0]
                    const data: taskData = {taskName: "Store", bodyTypeName: ["BootStrapHauler"], pos: {x: openPos.x, y: openPos.y}, target: structure.id}
                    if (!room.memory.taskList.some(task => this.objectsAreEqual(task, data)) && !room.memory.runningTask.some(task => this.objectsAreEqual(task, data))){
                        room.memory.taskList.push(data)
                    }
                }
            }

            for (const controller of room.memory.Controller){
                for (const openPos of controller.openPositions){
                    const data: taskData = {taskName: "Upgrade", bodyTypeName: ["BootstrapUpgrader"], pos: {x: openPos.x, y: openPos.y}, target: controller.Id}
                    if (!room.memory.taskList.some(task => this.objectsAreEqual(task, data)) && !room.memory.runningTask.some(task => this.objectsAreEqual(task, data))){
                        room.memory.taskList.push(data)
                    }
                }
            }

            const constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES)

            for (const site of constructionSites){
                const openPos = getOpenSpaces({x: site.pos.x, y: site.pos.y}, room, 1)[0]
                const data: taskData = {taskName: "Build", bodyTypeName: ["BootstrapWorker"], pos: {x: openPos.x, y: openPos.y}, target: site.id}
                if (!room.memory.taskList.some(task => this.objectsAreEqual(task, data)) && !room.memory.runningTask.some(task => this.objectsAreEqual(task, data))){
                    room.memory.taskList.push(data)
                }
            }
        }
    }
}