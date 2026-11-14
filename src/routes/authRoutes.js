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
        if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ message: 'El usuario ya existe' })
        }
        res.sendStatus(500)
    }
})

router.post('/login', (req, res) => {
    const { username, password } = req.body

    try {
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?')
        const user = getUser.get(username)

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' })
        }

        //Crear un token JWT para el usuario
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(500)
    }

})  


export default router