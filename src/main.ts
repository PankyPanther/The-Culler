import { RoomManager } from "Managers/RoomManager"
import { TaskManager } from "Managers/TaskManager";
import { BodyTypeName, SpawningManager } from "Managers/SpawningManager";

class Root {
    private taskManager = new TaskManager()
    private roomManager = new RoomManager()
    private spawningManager = new SpawningManager()

    runTick() {
        for (let roomName in Game.rooms){
            let room = Game.rooms[roomName]
            if (!room.memory.role){
                this.roomManager.initRoom(room, "Citadel")
            }

            if (!room.memory.spawnList.length) {
                let spawnlist: BodyTypeName[] = ["BootStrapHauler", "BootStrapHauler", "BootstrapWorker", "BootstrapWorker", "BootStrapHauler", "BootstrapUpgrader"] 
                for (let name of spawnlist){
                    room.memory.spawnList.push(name)
                }
            }
            this.spawningManager.runMain(room)
            this.roomManager.findRoomTasks(room)
        }
        
        
        for (const creepName in Memory.creeps) {
            if(!Game.creeps[creepName]) {
              console.log(`Deleting memory for dead creep: ${creepName}`)
              const taskData = Memory.creeps[creepName].taskData
              if (taskData){
                    Game.rooms[Memory.creeps[creepName].homeRoom].memory.runningTask.splice(Game.rooms[Memory.creeps[creepName].homeRoom].memory.runningTask.indexOf(taskData, 1))
              }
              delete Memory.creeps[creepName];
            } else {
                // Game.creeps[creepName].suicide()
                this.taskManager.runTask(Game.creeps[creepName])
            }
        }
        

    }
}


const root = new Root()
export function loop(): void {
    root.runTick()
}
