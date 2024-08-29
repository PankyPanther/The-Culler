export type BodyTypeName = "BootstrapHarvester" | "BootStrapHauler"
type BodyTypeLookup = {[bodyType in BodyTypeName]: BodyPartConstant[]}

export class SpawningManager {
    private bodyTypeList: BodyTypeLookup = {
        "BootstrapHarvester": [WORK, WORK, MOVE, CARRY],
        "BootStrapHauler": [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
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

    spawnCreep(spawn: StructureSpawn, creepBodyType: BodyTypeName): void {
        spawn.spawnCreep(this.bodyTypeList[creepBodyType], (this.getRandomName(this.creepNames) + " " + Game.time), {
            memory: {bodyType: creepBodyType, tasks: ["Harvest","Upgrade"], homeRoom: Game.spawns[spawn.name].room.name, workRoom: Game.spawns[spawn.name].room.name, taskData: undefined}
        })
    }

    getRandomName(array: string[]): string {
        const randomIndex = Math.floor(Math.random() * array.length);
        return array[randomIndex];
    }

    getSpawn(room: Room): StructureSpawn | null {
        for (let spawn of room.memory.Spawns){
            return Game.getObjectById(spawn.Id)
        }
        return null
    }
}