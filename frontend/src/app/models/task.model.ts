export interface Task {
    id: string,
    title: string,
    description: string,
    assigned?: string,
    status?: boolean,
    dateCreated: { 
        _seconds: number,
        _nanoseconds: number
    },
    dateUpdated: { 
        _seconds: number,
        _nanoseconds: number
    }
}