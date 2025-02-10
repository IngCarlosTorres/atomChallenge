import { db } from "../config/firebase";
import { User } from '../interfaces/user'


// Registro de usuarios en Firestore
export const registerUser = async (user: User) => {

    const userRef = db.collection("users").doc(user.email);

    await userRef.set({
        ...user,
        createdAt: new Date(),
    });

    return { status: 201, message: "El usario ha sido registrado con éxito" };
};

// Validar si el usuario existe en la base de datos
export const getUser = async (email: string) => {
    const userRef = db.collection("users").doc(email);
    const userSnapshot = await userRef.get();

    return userSnapshot.exists ? { status: 302, message: "El usuario si existe" } : { status: 404, message: "El usuario no existe" };
};

// Validar si el usuario existe en la base de datos
export const getAllUsers = async () => {
    const userCollection = await db.collection("users").get();
    const userList = userCollection.docs
        .map(doc => ({
            assignedTo: doc.data().email + '-' + (doc.data().name + ' ' + doc.data().lastname),
            nameComplete: doc.data().name + ' ' + doc.data().lastname
        }));
    return { userList: userList };
};