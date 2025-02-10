# Atom Challenge
Repositorio utilizado para el desarrollo del challenge para la empresa Atom.

-	[Challenge](ChallengeTecnicoAtom.pdf)

# Bienvenido
En el siguiente repositorio encontraras toda la información y desarrollo del challenge realizado, segmentando las carpetas por:  
- **[Backend](backend/README.md)**
En este proyecto se aloja la funcionalidad y descripción del API
	- **[Functions](backend/functions):** Esta carpeta contiene la misma información y contenido que la carpeta SRC basado al desarrollo realizado para toda la API con la diferencia que esta fue generada por las herramientas de Firebase para poder realizar la publicación en la nube de todas las funciones utilizadas, cabe destacar que si desea realizar la prueba de estas funciones en la nube debe generar su propio archivo de claves secreta generada por Firebase y contar con una cuenta Blaze en  [Firebase](https://firebase.google.com/) 
	- **[SRC](backend/src):** Esta carpeta contiene todo el desarrollo del API y si se desea realizar el test de la misma se descarga el repositorio y se procede a la instalación local.
- **[Fronted](frontend/documentation.md)**
En este proyecto se aloja la funcionalidad y descripción de los módulos de la aplicación web realizada.

# Herramientas utilizadas
- **NodeJS versión 20.18.6**
- **Express**
- **TypeScript**
- **Firebase**
	- Firestore Database
	- Functions
	- Hosting
- **Angular versión 17.3.6**

# Instalación local
Para poder realizar el test e instalación del proyecto localmente se debe tener instalado las herramientas utilizadas y tambien contar con un archivo de llaves secretas brindadas por Firebase al momento de crear un proyecto.
- **Backend**
	- Dirigirse a la siguiente ruta backend/src
	- Ejecutar el siguiente comando **npm install** para poder instalar todas las dependecias
	- Crear un archivo **.env** para poder configurar el PORT de ejecución localmente.
	- Ejecutar el comando **npm run dev** para poder desplegar la aplicación localmente.
- **Fronted**
	- Dirigirse a la siguiente ruta frontend/
	- Ejecutar el siguiente comando **npm install** para poder instalar todas las dependecias
	- Ejecutar el comando **ng serve** para poder desplegar la aplicación localmente.
