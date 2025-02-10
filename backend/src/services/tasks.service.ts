import { db } from "../config/firebase";
import { Task } from '../interfaces/task'
import { Timestamp } from "firebase-admin/firestore";

// Validar si el usuario existe en la base de datos
export const existTask = async (title: string) => {

    const listTasks = await getAllTasks();
    const exist = listTasks.taskList.some(task => task.title === title);

    return exist ? { status: 302, message: "El titulo de la tarea ya existe" } : { status: 404, message: "El titulo de la tarea no existe" };
};

// Registro de usuarios en Firestore
export const registerTask = async (task: Task) => {

    await db.collection("tasks").add({
        ...task,
        assigned: null,
        status: false,
        visible: true,
        dateCreated: Timestamp.now(),
        dateUpdated: null,
        dateDeleted: null
    });

    return { status: 201, message: "La tarea ha sido registrada con éxito" };
};

// Obtener la lista de tareas
export const getAllTasks = async () => {

    const taskCollection = await db.collection("tasks").orderBy("dateCreated", "asc").get();
    const taskList = taskCollection.docs
        .filter(doc => doc.data().visible)
        .map(doc => ({
            id: doc.id,
            title: doc.data().title,
            ...doc.data()
        }));
    return { taskList: taskList };
};

// Obtener la lista de tareas por usuario
export const getAllTasksUser = async (assignedTo: any) => {

    assignedTo = assignedTo === "null" ? null : assignedTo;
    const taskCollection = await db.collection("tasks").orderBy("dateCreated", "asc").get();
    const taskList = taskCollection.docs
        .filter(doc => doc.data().assigned === assignedTo && doc.data().visible)
        .map(doc => ({
            id: doc.id,
            title: doc.data().title,
            ...doc.data()
        }));

    return { taskList: taskList };
};

// Actualizar tarea
export const taskUpdate = async (id: string, task: Task) => {

    const taskRef = db.collection("tasks").doc(id);
    const taskSnapshot = await taskRef.get();

    if (!taskSnapshot.exists) {
        return { status: 404, message: "El id ingresado no le pertenece a ninguna tarea" };
    }

    await taskRef.update({
        ...task,
        dateUpdated: task.status ? Timestamp.now() : null,
    });

    return { status: 200, message: "La tarea ha sido actualizada con éxito" };
}

// Eliminar tarea
export const taskDelete = async (id: string) => {

    const taskRef = db.collection("tasks").doc(id);
    const taskSnapshot = await taskRef.get();

    if (!taskSnapshot.exists) {
        return { status: 404, message: "El id ingresado no le pertenece a ninguna tarea" };
    }

    await taskRef.update({
        visible: false,
        dateDeleted: Timestamp.now(),
    });

    //await taskRef.delete();
    return { status: 200, message: "La tarea ha sido eliminada con éxito" };
}

// Asignar tarea a usuario
export const taskAssigned = async (id: string, assigned: string) => {

    const taskRef = db.collection("tasks").doc(id);
    const taskSnapshot = await taskRef.get();

    if (!taskSnapshot.exists) {
        return { status: 404, message: "El id ingresado no le pertenece a ninguna tarea" };
    }

    await taskRef.update({
        assigned: (assigned === "SIN ASIGNAR" || assigned === null || assigned === "null") ? null : assigned,
    });

    return { status: 200, message: "La tarea ha sido asignada con éxito" };
}