import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
// Import routas
import empleadosRouter from './routes/servicios/talento_humano/empleados.routes.js'
import rolesRouter from './routes/servicios/talento_humano/roles.routes.js'
import userRouter from './routes/user.routes.js'
import adminRouter from './routes/servicios/administrador/administrador.routes.js'
import empleadoRouter from './routes/servicios/empleado/empleado.routes.js'
import fileRouterTh from './routes/servicios/talento_humano/file.routes.js'

// Instancias
const app = express()
dotenv.config()
app.use(cors())
app.use(morgan('dev'))

// Middlewares
app.use(express.json())

// Puerto ENV
app.set('port', process.env.PORT || 4000)

// Ruta Raiz
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to my API' })
})

// Rutas Api
app.use('/api', empleadosRouter)
app.use('/api', rolesRouter)
app.use('/api', userRouter)
app.use('/api', adminRouter)
app.use('/api', empleadoRouter)
app.use('/api', fileRouterTh)

// Rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

export default app
