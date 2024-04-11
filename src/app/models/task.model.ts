export enum StatusTask {
    PROGRESS, DONE
}

export interface Task {
    id: string
    title: string
    description: string
    responsibleUser: string
    priority: number
    deadline: Date
    status: StatusTask
    createdAt: Date
}