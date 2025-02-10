import { Task } from './task.model';
import { User } from './user.model'

export interface respApi {
    respApi: {
        status: number,
        message: string    
        taskList?: Task[] 
        userList?: User[] 
    }
}