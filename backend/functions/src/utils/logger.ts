import winston from "winston";

// Configuración del formato de log
const logFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

// Creación del logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console(), // Mostrar logs en consola
    new winston.transports.File({ filename: "logs/errors.log", level: "error" }), // Guardar errores en un archivo
    new winston.transports.File({ filename: "logs/combined.log" }), // Guardar todos los logs
  ],
});

export default logger;