export enum StatusTask {
    PROGRESS = 'PROGRESS',
    DONE = 'DONE'
}

export enum PriorityTask {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export interface Task {
    id?: string
    title: string
    description: string
    responsibleUser: string
    priority: PriorityTask
    deadline: string
    status?: StatusTask
    createdAt?: Date
}