import { taskData } from "definitions"
import { defaultBodyTask } from "./SpawningManager"
import { BootStrapHarvest } from "Tasks/BootStrap/task.bootstrap.harvest"
import { BootStrapUpgrade } from "Tasks/BootStrap/task.bootstrap.upgrade"
import { BootStrapStore } from "Tasks/BootStrap/task.bootstrap.store"
import { BootStrapBuild } from "Tasks/BootStrap/task.bootstrap.build"

export type TaskNames = "BootStrapHarvest" | "BootStrapUpgrade" | "BootStrapStore" | "BootStrapBuild"

export type Task = {
    taskName: TaskNames
    taskEmoji: string
    run(creep: Creep): "ChangeState" | null
    getTaskData(creep: Creep): taskData | undefined
}

type TaskLookup = {[taskName in TaskNames]: Task}


export class TaskManager {
    private taskList: TaskLookup = {
        "BootStrapHarvest": BootStrapHarvest,
        "BootStrapUpgrade": BootStrapUpgrade,
        "BootStrapStore": BootStrapStore,
        "BootStrapBuild": BootStrapBuild
    };


    runTask(creep: Creep): void{
        const currentTask = this.getTask(creep.memory.tasks[0], creep)

        if (currentTask.run(creep) === "ChangeState"){
            this.removeTask(creep)

            if (creep.memory.tasks.length){
                this.runTask(creep)
            } 

            if (creep.memory.tasks.length <= 1){
                this.addTask(creep)
            }
        }
        creep.say(currentTask.taskEmoji)
    }


    getTask(taskName: TaskNames, creep: Creep): Task {
        if (!this.taskList[taskName]) {throw new Error(`Creep has a task that does not Exist! -> ${creep.name} - ${creep.pos}`)}
        return this.taskList[taskName]
    }


    addTask(creep: Creep){
        let tasks: TaskNames[] = defaultBodyTask[creep.memory.bodyType]
        for(let task of tasks){
            creep.memory.tasks.push(task)
        }
    }


    removeTask(creep: Creep): string{
        const task = creep.memory.tasks[0]
        creep.memory.tasks.shift()
        return this.getTask(task, creep).taskName
    }
}