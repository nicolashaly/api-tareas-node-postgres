import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js'

const router = express.Router()

// Valida que vengan usuario y contraseña antes de tocar la base de datos
function validarCredenciales(req, res, next) {
    const { username, password } = req.body ?? {}
    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
        return res.status(400).json({ message: 'Faltan el usuario o la contraseña' })
    }
    next()
}

// POST /auth/register - Crea un usuario y devuelve un token
router.post('/register', validarCredenciales, async (req, res) => {
    const { username, password } = req.body

    // Cifra la contraseña antes de guardarla en la base de datos
    const hashedPassword = bcrypt.hashSync(password, 8)

    // Guarda el usuario en la base de datos
    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        // Crea una primera tarea de bienvenida
        const defaultTodo = `Hola ${username}, esta es tu primera tarea. ¡Puedes eliminarla o marcarla como completada!`
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })

        // Token JWT válido por 24 horas
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.error(err.name, err.code)
        if (err.code === 'P2002') { // violación de unicidad en Prisma/Postgres
            return res.status(409).json({ message: 'El usuario ya existe' })
        }
        res.sendStatus(500)
    }
})

// POST /auth/login - Verifica la contraseña y devuelve un token
router.post('/login', validarCredenciales, async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' })
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password)
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' })
        }

        // Token JWT válido por 24 horas
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.error(err.name, err.code)
        res.sendStatus(500)
    }
})

export default router
