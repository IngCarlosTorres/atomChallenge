import { Request, Response } from "express";
import { registerUser, getUser, getAllUsers } from "../services/auth.service";
import { User } from "../interfaces/user";
import { respFunction } from "../interfaces/response";
import logger from "../utils/logger";

// --------------- FUNCIONES GENERALES ---------------

// Función para validar el correo electrónico
const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
};

// --------------- FUNCIONES GET ---------------

// Función para obtener la lista de usuarios
export const getUsers = async (req: Request, res: Response) => {
    try {
        logger.info(`Solicitud recibida en /users para obtener lista de usuarios`);
        const respApi = await getAllUsers();
        if (respApi.userList.length === 0) {
            logger.info(`No hay usuarios registrados en la base de datos`);
            res.json({ respApi: { status: 404, message: "No hay usuarios registradas", userList: [] } });
            return;
        }

        logger.info(`Lista de usuarios obtenida con éxito`);
        res.json({ respApi: { status: 200, message: "Se obtuvo con exito la lista de usuarios", userList: respApi.userList } });
    } catch (error: any) {
        logger.error(`Hubo un problema al obtener la lista de usuarios: ${error.message}`);
        res.json({ respApi: { status: 500, message: "Hubo un problema al obtener la lista de usuarios" } });
    }
};

// Función para realizar el login del usuario
export const login = async (req: Request, res: Response) => {
    try {
        logger.info(`Solicitud recibida en /users para validar login con datos: ${JSON.stringify(req.params)}`);
        const { email } = req.params;

        // Validamos el correo electrónico
        if (!validateEmail(email)) {
            logger.error(`Correo electrónico no válido: ${email}`);
            res.json({ respApi: { status: 406, message: "Correo electrónico no válido" } });
            return;
        }

        // Validamos si el usuario existe
        const respApi: respFunction = await getUser(email);

        if (respApi.status === 404) {
            logger.info(`Usuario no encontrado: ${email}`);
            res.json({ respApi: { status: 404, message: "Usuario no encontrado" } });
            return;
        }

        logger.info(`Inicio de sesión exitoso: ${email}`);
        res.json({ respApi: { status: 200, message: "Inicio de sesión exitoso", email: email } });
    } catch (error: any) {
        logger.error(`Hubo un problema al realizar el login: ${error.message}`);
        res.json({ respApi: { status: 500, error: "Hubo un problema al realizar el login" } });
    }
};

// --------------- FUNCIONES POST ---------------

// Función para registrar al usuario
export const register = async (req: Request, res: Response) => {
    try {
        logger.info(`Solicitud recibida en /users para registrar usuario con datos: ${JSON.stringify(req.body)}`)
        const user: User = req.body;
        let respApi: respFunction = await getUser(user.email);

        if (respApi.status === 302) {
            // El usuario ya existe
            logger.info(`El usuario ${user.email} ya existe en la base de datos`);
            res.json({ respApi });
            return;
        }

        // Registro de usuario  
        respApi = await registerUser(user);
        logger.info(`El usuario ${user.email} ha sido registrado con éxito`);
        res.json({ respApi });
    } catch (error: any) {
        logger.error(`Hubo un problema al realizar el registro del usuario: ${error.message}`);
        res.json({ respApi: { status: 500, message: "Hubo un problema al realizar el regitro del usuario" } });
    }
};

// --------------- FUNCIONES PUT ---------------

// --------------- FUNCIONES DELETE ---------------
