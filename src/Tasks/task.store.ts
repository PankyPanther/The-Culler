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
                Game.rooms[creep.memory.homeRoom].memory.runningTask.push(taskD)
                creep.memory.taskData = taskD
            } else {
                console.log("There are no Store Tasks Available")
            }
        } else {
            const storeTarget = Game.getObjectById(creep.memory.taskData.target) as StructureSpawn | StructureExtension
            if (storeTarget){
                if (creep.transfer(storeTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE){
                    creep.moveTo(storeTarget)
                }
                if (creep.store[RESOURCE_ENERGY] === 0 || creep.ticksToLive! < 10){
                    Game.rooms[creep.memory.homeRoom].memory.runningTask.splice(Game.rooms[creep.memory.homeRoom].memory.runningTask.indexOf(creep.memory.taskData), 1)
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