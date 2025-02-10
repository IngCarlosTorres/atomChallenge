import { Router } from "express";
import { register, login, getUsers } from "../controllers/auth.controller";

const router = Router();

// POST
router.post("/users", register); // Registra un nuevo usuario

// GET
router.get("/users/:email", login); // Verifica el login
router.get("/users", getUsers); // Obtiene la lista de usuarios

export default router;