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
    const { id } = req.params
    
    const updatedTodo = await prisma.todo.update({
        where: {
            id: parseInt(id),
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
    const { id } = req.params
    const userId = req.userId
    
    await prisma.todo.delete({
        where: {
            id: parseInt(id),
            userId
        }
    })

    res.json({ message: 'Tarea eliminada correctamente' })
})

export default router