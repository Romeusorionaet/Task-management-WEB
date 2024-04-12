export enum StatusTask {
    PROGRESS = 'PROGRESS',
    DONE = 'DONE'
}


export interface Task {
    id?: string
    title: string
    description: string
    responsibleUser: string
    priority: number
    deadline: string
    status?: StatusTask
    createdAt?: Date
}