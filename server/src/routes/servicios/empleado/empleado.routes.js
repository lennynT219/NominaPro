import { Router } from 'express'
import {
  getRolesByEmpleadoId
} from '../../../controllers/services/empleado/Empleado.controller.js'

const empleadoRouter = Router()

empleadoRouter.get('/empleado/:id', getRolesByEmpleadoId)

export default empleadoRouter
