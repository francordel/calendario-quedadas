# Calendario de Quedadas [kdemos.com](https://kdemos.com)


Este es un proyecto de React para organizar quedadas entre amigos. Los usuarios pueden seleccionar los días en los que están disponibles para quedar, indicar qué días no pueden, y ver recomendaciones basadas en la disponibilidad de otros usuarios. Los datos de los usuarios se guardan y procesan en Firebase o mediante Workers de Cloudflare Pages, permitiendo a varios usuarios interactuar con el mismo calendario.

## Funcionalidades

- **Selección de Días**: Los usuarios pueden seleccionar los días en los que están disponibles (verde), los días que no pueden (rojo) y los días en los que pueden hacer un esfuerzo (naranja).
- **Recomendación de Días**: Después de que los usuarios hayan hecho su selección, el sistema sugiere los días con más disponibilidad (más verdes y menos naranjas) para todos los usuarios.
- **Persistencia en Firebase o Cloudflare Workers**: Las preferencias de los usuarios se almacenan en Firebase en tiempo real o, alternativamente, se accede a través de Workers de Cloudflare Pages para mayor seguridad y control.
- **Interfaz Interactiva**: Una interfaz fácil de usar en la que los usuarios pueden hacer clic en los días del calendario para indicar su disponibilidad.

## Tecnologías Usadas

- **React**: Librería para construir la interfaz de usuario.
- **Firebase**: Base de datos en tiempo real para almacenar las preferencias de los usuarios.
- **Cloudflare Workers**: Para desplegar una capa de backend como proxy seguro entre el frontend y la base de datos.
- **React Router**: Para manejar las rutas y la navegación entre las pantallas del calendario.
- **CSS Grid**: Para mostrar los días del calendario de manera visual y ordenada.

## Instalación

### Prerrequisitos

Asegúrate de tener [Node.js](https://nodejs.org/) instalado en tu máquina.

### Clonar el Repositorio

1. Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/tu-usuario/calendario-quedadas.git
```

2. Navega al directorio del proyecto:

```bash
cd calendario-quedadas
```

3. Instala las dependencias del proyecto:

```bash
npm install
```

### Configuración de Entorno

El proyecto puede funcionar con tres modos de almacenamiento de datos: `mock`, `firebase`, o `cloudflare`.

Configura el archivo `.env` con el modo deseado:

```env
REACT_APP_DB_MODE=cloudflare
```

### Configuración de Firebase (modo firebase o desarrollo local)

1. Crea un proyecto en Firebase Console.
2. Activa la base de datos Firestore.
3. Obtén tus credenciales de Firebase (API Key, Auth Domain, etc.) y configúralas en un archivo `.env`:

```env
REACT_APP_FIREBASE_API_KEY=TU_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=TU_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID=TU_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=TU_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=TU_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=TU_APP_ID
```

### Iniciar el Proyecto

Una vez configurado todo, puedes iniciar la aplicación localmente:

```bash
npm start
```

Esto abrirá la aplicación en tu navegador en [http://localhost:3000](http://localhost:3000).

## Despliegue en Producción

Este proyecto está listo para ser desplegado en plataformas como Vercel, Netlify o Cloudflare Pages.

### Desplegar en Cloudflare Pages (modo recomendado para producción)

1. Crea una cuenta en [Cloudflare](https://pages.cloudflare.com/).
2. Conecta tu repositorio de GitHub.
3. Configura las variables de entorno en la sección "Settings > Functions > Environment Variables":
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_API_KEY`
4. Asegúrate de tener el modo `REACT_APP_DB_MODE=cloudflare` en tu entorno.
5. Cloudflare desplegará tu aplicación y ejecutará los Workers como backend.

### Desplegar en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com/).
2. Conecta tu repositorio de GitHub con Vercel.
3. Configura las variables de entorno para Firebase (apiKey, authDomain, etc.).
4. Establece `REACT_APP_DB_MODE=firebase` para que el frontend acceda directamente a Firebase.

## Contribuciones

Las contribuciones son bienvenidas. Si tienes una mejora o solución a un problema, por favor abre un pull request.

## Licencia

Este proyecto está bajo la Licencia MIT.

