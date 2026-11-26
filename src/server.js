import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 5001

// Ruta de este archivo y su carpeta (no existen __dirname ni __filename en módulos ES)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Lee el cuerpo de las solicitudes en formato JSON
app.use(express.json())
// Sirve el frontend (HTML, CSS y JS) desde la carpeta public
app.use(express.static(path.join(__dirname, '../public')))

// Página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

// Rutas de la API: /todos exige un token válido
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`)
})
