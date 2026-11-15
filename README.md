# App de tareas

App de tareas con registro y login. Cada usuario ve solo sus propias tareas.

## Tecnologías

- **Node.js 22** y **Express 5**: servidor y API.
- **PostgreSQL 13**: base de datos.
- **Prisma 7** con `@prisma/adapter-pg`: acceso a la base de datos.
- **JWT** (`jsonwebtoken`) y **bcryptjs**: autenticación y cifrado de contraseñas.
- **Docker** y **Docker Compose**: para correr la app y la base de datos.
- **HTML, CSS y JavaScript** sin frameworks: el frontend, servido por Express desde `public/`.

## Estructura

```
prisma/        esquema y migraciones
public/        frontend
src/
  routes/      rutas de auth y tareas
  middleware/  verificación del token
  server.js    punto de entrada
```

## Cómo correrla

1. Copia `.env.example` a `.env` y rellena `JWT_SECRET` y `POSTGRES_PASSWORD` con valores largos y aleatorios.
2. Levanta todo:

   ```
   docker compose up
   ```

3. Solo la primera vez, crea las tablas:

   ```
   docker compose exec app npx prisma migrate deploy
   ```

La app queda en http://localhost:5001.

## Rutas

| Método | Ruta | Qué hace |
|---|---|---|
| POST | `/auth/register` | Crea un usuario y devuelve un token |
| POST | `/auth/login` | Inicia sesión y devuelve un token |
| GET | `/todos` | Lista tus tareas |
| POST | `/todos` | Crea una tarea |
| PUT | `/todos/:id` | Actualiza una tarea |
| DELETE | `/todos/:id` | Elimina una tarea |

Las rutas `/todos` piden el token en el header `Authorization`.
