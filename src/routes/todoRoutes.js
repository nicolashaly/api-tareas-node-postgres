import express from 'express'
import prisma from '../prismaClient.js';

const router = express.Router()

//GET /todos - Obtener todas las tareas para un usuario específico
router.get('/', async (req, res) => {
    const todos = await prisma.todo.findMany({
        where: {
            userId: req.userId
        }
    })
    res.json(todos)
})

//POST /todos - Crear una nueva tarea para un usuario específico
router.post('/', async (req, res) => {
    const { task } = req.body
    const todo = await prisma.todo.create({
        data: {
            task,
            userId: req.userId
        }
    })
    res.json(todo)
})

//PUT /todos/:id - Actualizar una tarea específica para un usuario específico
router.put('/:id', async (req, res) => { 
    const { completed } = req.body
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

//DELETE /todos/:id - Eliminar una tarea específica para un usuario específico
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

// Express 5 envía aquí los errores de los handlers async: sin detalles internos al cliente
router.use((err, req, res, next) => {
    if (err.code === 'P2025') return res.status(404).json({ message: 'Tarea no encontrada' })
    console.error(err.name, err.code)
    res.sendStatus(500)
})

export default router