import express from 'express'
import db from '../db.js'

const router = express.Router()

//GET /todos - Obtener todas las tareas para un usuario específico
router.get('/', (req, res) => {
    const getTodos = db.prepare('SELECT * FROM todos WHERE user_id = ?')
    const todos = getTodos.all(req.userId)
    res.json(todos)
})

//POST /todos - Crear una nueva tarea para un usuario específico
router.post('/', (req, res) => {
    const { task } = req.body
    const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)')
    const result = insertTodo.run(req.userId, task)
    res.json({id: result.lastInsertRowid, task, completed: 0})
})

//PUT /todos/:id - Actualizar una tarea específica para un usuario específico
router.put('/:id', (req, res) => { 
    const { completed } = req.body
    const { id } = req.params
    const updateTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ? AND user_id = ?')
    const result = updateTodo.run(completed, id, req.userId)
    if (result.changes === 0) return res.status(404).json({ message: 'Tarea no encontrada' })
    res.json({ message: 'Tarea actualizada correctamente' })
})

//DELETE /todos/:id - Eliminar una tarea específica para un usuario específico
router.delete('/:id', (req, res) => {
    const { id } = req.params
    const userId = req.userId
    const deleteTodo = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?')
    const result = deleteTodo.run(id, userId)
    if (result.changes === 0) return res.status(404).json({ message: 'Tarea no encontrada'})
    res.json({ message: 'Tarea eliminada correctamente' })
})

export default router