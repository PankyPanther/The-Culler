import { RoomManager } from "Managers/RoomManager"
import { TaskManager } from "Managers/TaskManager";
import { SpawningManager } from "Managers/SpawningManager";

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


            this.spawningManager.runMain(room)
        }
        
        
        for (const creepName in Memory.creeps) {
            if(!Game.creeps[creepName]) {
              console.log(`Deleting memory for dead creep: ${creepName}`)
              delete Memory.creeps[creepName];
            } else {
                this.taskManager.runTask(Game.creeps[creepName])
            }
        }
        

    }
}


const root = new Root()
export function loop(): void {
    root.runTick()
}
