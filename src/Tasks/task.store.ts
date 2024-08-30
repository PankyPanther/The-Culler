import { taskData } from "definitions"
import { Task } from "Managers/TaskManager"

export const Store: Task = { //input actually helpful dictunaries
    taskName: "Store",
    taskEmoji: "🏬",

    run(creep){
        if (creep.memory.taskData === undefined){
            const taskD = this.getTaskData(creep) 

            if (taskD){
                Game.rooms[creep.memory.homeRoom].memory.taskList.splice(Game.rooms[creep.memory.homeRoom].memory.taskList.indexOf(taskD), 1)
                creep.memory.taskData = taskD
            } else {
                console.log("There are no Upgrade Tasks Available")
            }
        } else {
            const storeTarget = Game.getObjectById(creep.memory.taskData.target) as StructureSpawn | StructureExtension
            if (storeTarget){
                const targetPos = new RoomPosition(creep.memory.taskData.pos.x, creep.memory.taskData.pos.y, creep.memory.homeRoom)
                if(creep.pos.x !== targetPos.x || creep.pos.y !== targetPos.y || creep.room.name !== targetPos.roomName ){
                    creep.moveTo(targetPos)
                } else {
                    console.log(creep.transfer(storeTarget, RESOURCE_ENERGY))
                    creep.transfer(storeTarget, RESOURCE_ENERGY)
                }
                if (creep.store[RESOURCE_ENERGY] === 0 || creep.ticksToLive! < 10){
                    creep.memory.taskData = undefined
                    return "ChangeState"
                } 
            }
        }

        return null
    },

    getTaskData(creep: Creep): taskData | undefined {
        for (const task of Game.rooms[creep.memory.homeRoom].memory.taskList){
            if(task.taskName === "Store"){
                return task
            }
        }

        return undefined
    }
}