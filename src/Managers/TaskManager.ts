import { taskData } from "definitions"
import { Harvest } from "Tasks/task.harvest"
import { Upgrade } from "Tasks/task.upgrade"

export type TaskNames = "Harvest" | "Upgrade" 
export type Task = {
    taskName: TaskNames
    taskEmoji: string
    run(creep: Creep): "ChangeState" | null
    getTaskData(creep: Creep): taskData | undefined
}

type TaskLookup = {[taskName in TaskNames]: Task}


export class TaskManager {
    private taskList: TaskLookup = {
        "Harvest": Harvest,
        "Upgrade": Upgrade,
    };


    runTask(creep: Creep): void{
        const currentTask = this.getTask(creep.memory.tasks[0], creep)

        if (currentTask.run(creep) === "ChangeState"){
            this.removeTask(creep)

            if (creep.memory.tasks.length){
                this.runTask(creep)
            } else {
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
        let tasks: TaskNames[] = ["Harvest", "Upgrade"]
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