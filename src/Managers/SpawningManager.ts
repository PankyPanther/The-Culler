import { TaskNames } from "./TaskManager";

export type BodyTypeName = "BootstrapWorker" | "BootStrapHauler" | "BootstrapUpgrader"
type BodyTypeLookup = {[bodyType in BodyTypeName]: BodyPartConstant[]}

type defaultBodyTypeTask = {[bodyType in BodyTypeName]: TaskNames[]}
export const defaultBodyTask: defaultBodyTypeTask = {
    "BootstrapWorker": ["Harvest"],
    "BootStrapHauler": ["Harvest", "Store"],
    "BootstrapUpgrader": ["Harvest", "Upgrade"]
}

export class SpawningManager {
    private bodyTypeList: BodyTypeLookup = {
        "BootstrapWorker": [WORK, WORK, MOVE, CARRY],
        "BootStrapHauler": [WORK, WORK, MOVE, CARRY],
        "BootstrapUpgrader": [WORK, WORK, MOVE, CARRY],
    };



    private creepNames: string[] = [
        "The Reaper",
        "The Harvester",
        "The Collector",
        "The Warden",
        "The Butcher",
        "The Cleaver",
        "The Ripper",
        "The Chopper",
        "The Slasher",
        "The Scourge",
        "The Cleansweep",
        "The Striker",
        "The Annihilator",
        "The Purger",
        "The Eliminator",
        "The Decimator",
        "The Ravager",
        "The Sifter",
        "The Eraser",
        "The Enforcer"
    ];


    runMain(room: Room){
        
        const roomSpawnList = room.memory.spawnList
        if (!roomSpawnList.length) { return }

        const spawns = this.getSpawns(room)
        if (!spawns) { return }

        for (const spawn of spawns){
            if (!spawn.spawning && this.spawnCreep(spawn, roomSpawnList[0])){
                roomSpawnList.splice(0, 1)
                break
            }
        }
    }


    spawnCreep(spawn: StructureSpawn, creepBodyType: BodyTypeName): boolean {
        if (spawn.spawnCreep(this.bodyTypeList[creepBodyType], (this.getRandomName(this.creepNames) + " " + Game.time), {
            memory: {bodyType: creepBodyType, tasks: defaultBodyTask[creepBodyType], homeRoom: Game.spawns[spawn.name].room.name, workRoom: Game.spawns[spawn.name].room.name, taskData: undefined}
        }) === 0){
            return true
        }

        return false
    }

    getRandomName(array: string[]): string {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    getSpawns(room: Room): StructureSpawn[] | null {
        let spawns: StructureSpawn[] = []
        for (let spawn of room.memory.Spawns){
            spawns.push(Game.getObjectById(spawn.Id) as StructureSpawn)
        }

        if (spawns.length) { return spawns}

        return null
    }
}