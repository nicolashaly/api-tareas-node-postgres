import express from 'express'
import prisma from '../prismaClient.js'

const router = express.Router()

// GET /todos - Lista las tareas del usuario autenticado
router.get('/', async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId
        }
    })
    res.json(todos)
})

// POST /todos - Crea una tarea para el usuario autenticado
router.post('/', async (req, res) => {
    const { task } = req.body ?? {}
    if (typeof task !== 'string' || !task.trim()) {
        return res.status(400).json({ message: 'La tarea no puede estar vacía' })
    }
    const todo = await prisma.todo.create({
        data: {
            task,
            userId: req.userId
        }
    })
    res.json(todo)
})

// PUT /todos/:id - Marca una tarea como completada o pendiente
// Filtrar también por userId impide modificar tareas de otro usuario
router.put('/:id', async (req, res) => {
    const { completed } = req.body ?? {}
    const id = parseInt(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'ID inválido' })

    const updatedTodo = await prisma.todo.update({
        where: {
            id,
            userId: req.userId
        },
        data: {
            completed: !!completed
        }
    })

    res.json(updatedTodo)
})

// DELETE /todos/:id - Elimina una tarea del usuario autenticado
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'ID inválido' })
    const userId = req.userId

    await prisma.todo.delete({
        where: {
            id,
            userId
        }
    })

    res.json({ message: 'Tarea eliminada correctamente' })
})

// Express 5 envía aquí los errores de las rutas async; al cliente no se le muestran detalles internos
router.use((err, req, res, next) => {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Tarea no encontrada' })
    console.error(err.name, err.code)
    res.sendStatus(500)
})

export default router
