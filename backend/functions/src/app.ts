import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

const app = express();

app.use(cors({ origin: true}));
app.use(express.json());

// Rutas para los usuarios
app.use("/", authRoutes);

// Rutas para las tareas
app.use("/", taskRoutes);

export default app;