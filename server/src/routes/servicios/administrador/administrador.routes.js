import { Router } from 'express'
import {
  createUser,
  getEmpleadosUser,
  getUsers,
  getRoles,
  assignRol
} from '../../../controllers/services/administrador/administrador.controller.js'
import { veryfyToken } from '../../../middlewares/auth.js'

const adminRouter = Router()

adminRouter.post('/user', createUser)
adminRouter.get('/emp/user', veryfyToken, getEmpleadosUser)
adminRouter.get('/users', veryfyToken, getUsers)
adminRouter.put('/roles', veryfyToken, assignRol)
adminRouter.get('/roles/:id', veryfyToken, getRoles)

export default adminRouter
