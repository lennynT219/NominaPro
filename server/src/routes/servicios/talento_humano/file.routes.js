import { Router } from 'express'
import {
  excelEmpleado
} from '../../../controllers/services/talento_humano/file.controllers.js'

const fileRouterTh = Router()

fileRouterTh.get('/excel/empleado', excelEmpleado)

export default fileRouterTh
