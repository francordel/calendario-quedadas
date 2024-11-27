# Calendario de Quedadas

Este es un proyecto de React para organizar quedadas entre amigos. Los usuarios pueden seleccionar los días en los que están disponibles para quedar, indicar qué días no pueden, y ver recomendaciones basadas en la disponibilidad de otros usuarios. Los datos de los usuarios se guardan y procesan en Firebase, permitiendo a varios usuarios interactuar con el mismo calendario.

## Funcionalidades

- **Selección de Días**: Los usuarios pueden seleccionar los días en los que están disponibles (verde), los días que no pueden (rojo) y los días en los que pueden hacer un esfuerzo (naranja).
- **Recomendación de Días**: Después de que los usuarios hayan hecho su selección, el sistema sugiere los días con más disponibilidad (más verdes y menos naranjas) para todos los usuarios.
- **Persistencia en Firebase**: Las preferencias de los usuarios se almacenan en Firebase, lo que permite que la información se guarde y se consulte por otros usuarios.
- **Interfaz Interactiva**: Una interfaz fácil de usar en la que los usuarios pueden hacer clic en los días del calendario para indicar su disponibilidad.

## Tecnologías Usadas

- **React**: Librería para construir la interfaz de usuario.
- **Firebase**: Base de datos en tiempo real para almacenar las preferencias de los usuarios.
- **React Router**: Para manejar las rutas y la navegación entre las pantallas del calendario.
- **CSS Grid**: Para mostrar los días del calendario de manera visual y ordenada.

## Instalación

### Prerequisitos

Asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu máquina.

### Clonar el Repositorio

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/tu-usuario/calendario-quedadas.git
2. Navega al directorio del proyecto:

    ```bash
    cd calendario-quedadas
3. Instala las dependencias del proyecto:
    ```bash
    npm install

### Configuración de Firebase

    Crea un proyecto en Firebase Console.

    Activa la base de datos en tiempo real de Firebase.

    Obtén tus credenciales de Firebase (API Key, Auth Domain, etc.) y configúralas en el archivo firebaseConfig.js.

    Aquí tienes un ejemplo de cómo debería verse tu configuración de Firebase:

    const firebaseConfig = {
      apiKey: "TU_API_KEY",
      authDomain: "TU_AUTH_DOMAIN",
      databaseURL: "TU_DATABASE_URL",
      projectId: "TU_PROJECT_ID",
      storageBucket: "TU_STORAGE_BUCKET",
      messagingSenderId: "TU_MESSAGING_SENDER_ID",
      appId: "TU_APP_ID"
    };

    Agrega esta configuración en el archivo firebaseConfig.js de tu proyecto.

### Iniciar el Proyecto

Una vez configurado todo, puedes iniciar la aplicación localmente:

npm start

Esto abrirá la aplicación en tu navegador en http://localhost:3000.
Despliegue en Producción

Este proyecto está listo para ser desplegado en plataformas como Vercel o Netlify. Solo debes seguir sus respectivos procesos de despliegue conectando tu repositorio de GitHub y configurando las variables de entorno para Firebase.

### Desplegar en Vercel

Crea una cuenta en Vercel https://vercel.com/.
Conecta tu repositorio de GitHub con Vercel.
Configura las variables de entorno en Vercel para las credenciales de Firebase (apiKey, authDomain, etc.).
Vercel desplegará tu aplicación automáticamente.

### Contribuciones

Las contribuciones son bienvenidas. Si tienes una mejora o solución a un problema, por favor abre un pull request.
Licencia

Este proyecto está bajo la Licencia MIT.