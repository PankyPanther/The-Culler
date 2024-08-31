import { taskData } from "definitions"
import { Task } from "Managers/TaskManager"

export const HarvestBootstrap: Task = { 
    taskName: "Harvest",
    taskEmoji: "⛏",

    run(creep) {
        if (creep.memory.taskData === undefined){
            const taskD = this.getTaskData(creep) 

            if (taskD){
                Game.rooms[creep.memory.homeRoom].memory.taskList.splice(Game.rooms[creep.memory.homeRoom].memory.taskList.indexOf(taskD), 1)
                Game.rooms[creep.memory.homeRoom].memory.runningTask.push(taskD)
                creep.memory.taskData = taskD
            } else {
                console.log("There are no Harvest Tasks Available")
            }
        } else {
            const source = Game.getObjectById(creep.memory.taskData.target) as Source
            if (source){
                const targetPos = new RoomPosition(creep.memory.taskData.pos.x, creep.memory.taskData.pos.y, creep.memory.homeRoom)
                if(creep.pos.x !== targetPos.x || creep.pos.y !== targetPos.y || creep.room.name !== targetPos.roomName ){
                    creep.moveTo(targetPos)
                } else {
                    creep.harvest(source)
                }
        
                if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0 || creep.ticksToLive! < 10) {
                    Game.rooms[creep.memory.homeRoom].memory.taskList.push(creep.memory.taskData)
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
            if(task.taskName === "Harvest"){
                return task
            }
        }

        return undefined
    }
}