import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

//Registrar nuevo usuario /auth/register
router.post('/register', (req, res) => {
    const { username, password } = req.body

    //Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = bcrypt.hashSync(password, 8)

    //Guardar el usuario en la base de datos
    try {
        const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)')
        const result = insertUser.run(username, hashedPassword)

        //Gererar la primera tarea para el usuario
        const defaultTodo = `Hola ${username}, esta es tu primera tarea. ¡Puedes eliminarla o marcarla como completada!`
        const insertTodo = db.prepare(`INSERT INTO todos (user_id, task) VALUES (?, ?)`)
        insertTodo.run(result.lastInsertRowid, defaultTodo)

        //Crear un token JWT para el usuario recién registrado
        const token = jwt.sign({ id: result.lastInsertRowid }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(500)
    }
})

router.post('/login', (req, res) => {

})


export default router