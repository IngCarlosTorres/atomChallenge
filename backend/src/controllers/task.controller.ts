import { Request, Response } from "express";
import { existTask, registerTask, getAllTasks, taskUpdate, taskDelete, taskAssigned, getAllTasksUser } from "../services/tasks.service";
import { Task } from "../interfaces/task";
import { respFunction } from "../interfaces/response";
import logger from "../utils/logger";

// --------------- FUNCIONES GENERALES ---------------

// --------------- FUNCIONES GET ---------------

// Obtener la lista de tareas
export const getTasks = async (req: Request, res: Response) => {
    try {
        logger.info(`Solicitud recibida en /tasks para obtener lista de tareas`);
        const respApi = await getAllTasks();

        if (respApi.taskList.length === 0) {
            logger.info(`No hay tareas registradas en la base de datos`);
            res.json({ respApi: { status: 404, message: "No hay tareas registradas", taskList: [] } });
            return;
        }

        logger.info(`Lista de tareas obtenida con éxito`);
        res.json({ respApi: { status: 200, message: "Se obtuvo con exito la lista de tareas", taskList: respApi.taskList } });
    } catch (error: any) {
        logger.error(`Hubo un problema al obtener la lista de tareas: ${error.message}`);
        res.json({ respApi: { status: 500, message: "Hubo un problema al obtener la lista de tareas" } });
    }
};

// Obtener las lista de tareas por usuario
export const getTasksUser = async (req: Request, res: Response) => {
    try {
        logger.info(`Solicitud recibida en /tasks para obtener lista de tareas asignada a: ${JSON.stringify(req.params)}`);
        const { assignedTo } = req.params;

        const respApi = await getAllTasksUser(assignedTo);

        if (respApi.taskList.length === 0) {
            logger.info(`No hay tareas registradas en la base de datos asignadas a ${assignedTo}`);
            res.json({ respApi: { status: 404, message: "No hay tareas registradas en la base de datos para la selección", taskList: [] } });
            return;
        }

        logger.info(`Lista de tareas obtenida con éxito`);
        res.json({ respApi: { status: 200, message: "Se obtuvo con exito la lista de tareas", taskList: respApi.taskList } });
    } catch (error: any) {
        logger.error(`Hubo un problema al obtener la lista de tareas: ${error.message}`);
        res.json({ respApi: { status: 500, message: "Hubo un problema al obtener la lista de tareas" } });
    }
};

// --------------- FUNCIONES POST ---------------

// Registrar nueva tarea en Firestore
export const createTask = async (req: Request, res: Response) => {
    try {
        logger.info(`Solicitud recibida en /tasks para registrar tarea con datos: ${JSON.stringify(req.body)}`)
        const task: Task = req.body;
        let respApi: respFunction = await existTask(task.title);

        if (respApi.status === 302) {
            logger.info(`El titulo de la tarea ${task.title} ya existe en la base de datos`);
            res.json({ respApi });
            return;
        }

        // Registro de tarea 
        respApi = await registerTask(task);
        logger.info(`La tarea ${task.title} ha sido registrada con éxito`);
        res.json({ respApi });
    } catch (error: any) {
        logger.error(`Hubo un problema al realizar el registro de la tarea: ${error.message}`);
        res.json({ respApi: { status: 500, message: "Hubo un problema al realizar el regitro de la tarea" } });
    }
};

// --------------- FUNCIONES PUT ---------------

// Se actualizar la información o estado de la tarea
export const updateTask = async (req: Request, res: Response) => {
    try {
        logger.info(`Solicitud recibida en /tasks para actualizar tarea con datos: ${JSON.stringify(req.body)}`)
        const { taskId } = req.params;
        const task: Task = req.body;

        if (!taskId) {
            logger.error(`El id de la tarea es requerido`);
            res.json({ respApi: { status: 400, message: "El id de la tarea es requerido" } });
            return;
        }

        // Actualizar tarea
        const respApi = await taskUpdate(taskId, task);

        if (respApi.status === 404) {
            logger.info(`El id ingresado no le pertenece a ninguna tarea`);
            res.json({ respApi });
            return;
        }

        logger.info(`La tarea con id ${taskId} ha sido actualizada con éxito`);
        res.json({ respApi });
    } catch (error: any) {
        logger.error(`Hubo un problema al realizar la actualización de la tarea: ${error.message}`);
        res.json({ respApi: { status: 500, message: "Hubo un problema al realizar la actualización de la tarea" } });
    }
}

// Se realiza la asignación de la tarea a un usuario
export const assignedTask = async (req: Request, res: Response) => {
    try {
        logger.info(`Solicitud recibida en /tasks/assigned para asignar tarea con datos: ${JSON.stringify(req.body.email)}`)
        const { taskId } = req.params;
        const email = req.body.email;

        if (!taskId) {
            logger.error(`El id de la tarea es requerido`);
            res.json({ respApi: { status: 400, message: "El id de la tarea es requerido" } });
            return;
        }

        // Actualizar tarea
        const respApi = await taskAssigned(taskId, email);

        if (respApi.status === 404) {
            logger.info(`El id ingresado no le pertenece a ninguna tarea`);
            res.json({ respApi });
            return;
        }

        logger.info(`La tarea con id ${taskId} ha sido asignada con éxito a ${email}`);
        res.json({ respApi });
    } catch (error: any) {
        logger.error(`Hubo un problema al realizar la asignación de la tarea: ${error.message}`);
        res.json({ respApi: { status: 500, message: "Hubo un problema al realizar la asignación de la tarea" } });
    }
}

// --------------- FUNCIONES DELETE ---------------

// Se elimina la tarea (Eliminación lógica)
export const deleteTask = async (req: Request, res: Response) => {
    try {
        logger.info(`Solicitud recibida en /tasks para eliminar tarea con id: ${req.params.taskId}`);
        const { taskId } = req.params;

        if (!taskId) {
            logger.error(`El id de la tarea es requerido`);
            res.json({ respApi: { status: 400, message: "El id de la tarea es requerido" } });
            return;
        }

        // Eliminar tarea
        const respApi = await taskDelete(taskId);

        if (respApi.status === 404) {
            logger.info(`El id ingresado no le pertenece a ninguna tarea`);
            res.json({ respApi });
            return;
        }

        logger.info(`La tarea con id ${taskId} ha sido eliminada con éxito`);
        res.json({ respApi });
    } catch (error: any) {
        logger.error(`Hubo un problema al realizar la eliminación de la tarea: ${error.message}`);
        res.json({ respApi: { status: 500, message: "Hubo un problema al realizar la eliminación de la tarea" } });
    }
}