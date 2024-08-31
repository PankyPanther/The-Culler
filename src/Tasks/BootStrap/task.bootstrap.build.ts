import { taskData } from "definitions"
import { Task } from "Managers/TaskManager"

export const BootStrapBuild: Task = { 
    taskName: "BootStrapBuild",
    taskEmoji: "🔨",

    run(creep) {
        if (creep.memory.taskData === undefined){
            const taskD = this.getTaskData(creep) 

            if (taskD){
                Game.rooms[creep.memory.homeRoom].memory.taskList.splice(Game.rooms[creep.memory.homeRoom].memory.taskList.indexOf(taskD), 1)
                creep.memory.taskData = taskD
            } else {
                console.log("There are no Build Tasks Available")
            }
        } else {
            const ConstructionSite = Game.getObjectById(creep.memory.taskData.target) as ConstructionSite
            if (ConstructionSite){
                const targetPos = new RoomPosition(creep.memory.taskData.pos.x, creep.memory.taskData.pos.y, creep.memory.homeRoom)
                if(creep.pos.x !== targetPos.x || creep.pos.y !== targetPos.y || creep.room.name !== targetPos.roomName ){
                    creep.build(ConstructionSite)
                    creep.moveTo(targetPos)
                } else {
                    creep.build(ConstructionSite)
                }
        
                if (creep.store[RESOURCE_ENERGY] === 0 || creep.ticksToLive! < 1 || !ConstructionSite) {
                    creep.memory.taskData = undefined
                    return "ChangeState"
                }
            }
        }

        return null
    },


    getTaskData(creep: Creep): taskData | undefined {
        for (const task of Game.rooms[creep.memory.homeRoom].memory.taskList){
            if(task.taskName === "BootStrapBuild"){
                return task
            }
        }

        return undefined
    }
}