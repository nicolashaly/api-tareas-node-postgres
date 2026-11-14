import express from 'express'
import db from '../db.js'

const router = express.Router()

//GET /todos - Obtener todas las tareas para un usuario específico
router.get('/', (req, res) => { })

//POST /todos - Crear una nueva tarea para un usuario específico
router.post('/', (req, res) => { })

//PUT /todos/:id - Actualizar una tarea específica para un usuario específico
router.put('/:id', (req, res) => { })

//DELETE /todos/:id - Eliminar una tarea específica para un usuario específico
router.delete('/:id', (req, res) => { })

export default router