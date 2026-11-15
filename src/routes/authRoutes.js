import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prismaClient.js';

const router = express.Router()

//Registrar nuevo usuario /auth/register
router.post('/register', async (req, res) => {
    const { username, password } = req.body

    //Encriptar la contraseña antes de guardarla en la base de datos
    const hashedPassword = bcrypt.hashSync(password, 8)

    //Guardar el usuario en la base de datos
    try {
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        //Gererar la primera tarea para el usuario
        const defaultTodo = `Hola ${username}, esta es tu primera tarea. ¡Puedes eliminarla o marcarla como completada!`
        await prisma.todo.create({
            data: {
                task: defaultTodo,
                userId: user.id
            }
        })

        //Crear un token JWT para el usuario recién registrado
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        if (err.code === 'P2002') { // violación de unicidad en Prisma/Postgres
            return res.status(409).json({ message: 'El usuario ya existe' })
        }
        res.sendStatus(500)
    }
})

router.post('/login', async (req, res) => {
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

        //Crear un token JWT para el usuario
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.json({ token })
    } catch (err) {
        console.log(err.message)
        res.sendStatus(500)
    }

})  


export default router