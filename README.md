# API de tareas con Node.js y PostgreSQL

Aplicación web de tareas donde cada persona crea su cuenta, inicia sesión y administra su propia lista. Es un proyecto de práctica de backend: el foco está en la API, la autenticación y la base de datos. El frontend es simple y solo sirve para usarla desde el navegador.

## Qué muestra este proyecto

- **API REST** con Express: rutas para registrarse, iniciar sesión y crear, listar, completar y eliminar tareas.
- **Autenticación con JWT**: al iniciar sesión, la API entrega un token que se usa en las siguientes solicitudes.
- **Contraseñas cifradas** con bcrypt. Nunca se guardan en texto plano.
- **Datos separados por usuario**: cada consulta filtra por el usuario del token, así nadie puede ver ni modificar tareas ajenas.
- **Base de datos relacional** en PostgreSQL, con el esquema y las migraciones manejados por Prisma.
- **Docker Compose** levanta la app y la base de datos con un solo comando.
- **Configuración segura**: las claves van en un archivo `.env` que no se sube al repositorio, y los errores internos no se muestran al usuario.

## Tecnologías

Node.js 22 · Express 5 · PostgreSQL · Prisma 7 · JWT · bcrypt · Docker · HTML, CSS y JavaScript

## Cómo probarlo

Necesitas Docker instalado.

1. Copia `.env.example` como `.env` y escribe valores largos y aleatorios en `JWT_SECRET` y `POSTGRES_PASSWORD`.
2. Levanta la app y la base de datos:

   ```
   docker compose up --build
   ```

3. La primera vez, en otra terminal, crea las tablas:

   ```
   docker compose exec app npx prisma migrate deploy
   ```

4. Abre http://localhost:5001 y crea una cuenta.

## Rutas de la API

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/auth/register` | Crea una cuenta y devuelve un token |
| POST | `/auth/login` | Inicia sesión y devuelve un token |
| GET | `/todos` | Lista tus tareas |
| POST | `/todos` | Crea una tarea |
| PUT | `/todos/:id` | Marca una tarea como completada |
| DELETE | `/todos/:id` | Elimina una tarea |

Las rutas de `/todos` requieren el token en el header `Authorization`.

## Estructura

```
src/
  server.js        arranca el servidor y conecta las rutas
  routes/          registro, login y tareas
  middleware/      verificación del token
  prismaClient.js  conexión a la base de datos
prisma/            esquema de la base y migraciones
public/            frontend
```

## Autor

Nicolás Haly Arroyo
