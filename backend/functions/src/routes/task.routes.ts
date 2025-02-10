import { Router } from "express";
import { createTask, deleteTask, getTasks, updateTask, assignedTask, getTasksUser } from "../controllers/task.controller";

const router = Router();

// GET
router.get("/tasks", getTasks); // Obtiene la lista de tareas
router.get("/tasks/:assignedTo", getTasksUser) // Obtiene la lista de tareas por usuario

// POST
router.post("/tasks", createTask); // Registra nueva tarea

// PUT
router.put("/tasks/:taskId", updateTask); // Actualizar la información de una tarea
router.put("/tasks/assigned/:taskId", assignedTask); // Asigna tarea a un usuario

// DELETE
router.delete("/tasks/:taskId", deleteTask); // Elimina una tarea

export default router;