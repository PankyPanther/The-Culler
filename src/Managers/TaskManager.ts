import { taskData } from "definitions"
import { Build } from "Tasks/task.build"
import { HarvestBootstrap } from "Tasks/task.harvest"
import { Store } from "Tasks/task.store"
import { Upgrade } from "Tasks/task.upgrade"
import { defaultBodyTask } from "./SpawningManager"

export type TaskNames = "Harvest"| "HarvestBootstrap" | "Upgrade" | "Store" | "Build"

export type Task = {
    taskName: TaskNames
    taskEmoji: string
    run(creep: Creep): "ChangeState" | null
    getTaskData(creep: Creep): taskData | undefined
}

type TaskLookup = {[taskName in TaskNames]: Task}


export class TaskManager {
    private taskList: TaskLookup = {
        "Harvest": HarvestBootstrap,
        "HarvestBootstrap": HarvestBootstrap,
        "Upgrade": Upgrade,
        "Store": Store,
        "Build": Build
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