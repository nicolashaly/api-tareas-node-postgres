import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from './routes/todoRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 5001

//Obtener el nombre del archivo actual y el directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

//Middleware
app.use(express.json()) //Para poder recibir datos en formato JSON en el cuerpo de la solicitud
//Le dice a express que use la carpeta public para servir archivos estáticos (como HTML, CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, '../public')))

//Muestra el archivo HTML desde la carpeta public
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

//Routes
app.use('/auth', authRoutes)
app.use('/todos', authMiddleware, todoRoutes)

app.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`)
})