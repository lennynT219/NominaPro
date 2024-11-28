import { Router } from 'express'
import {
  getModuls,
  login,
  getDataUser
} from '../controllers/user.controller.js'
import { veryfyToken } from '../middlewares/auth.js'

const userRouter = Router()

userRouter.get('/modul', veryfyToken, getModuls)
userRouter.post('/login', login)
userRouter.get('/user', veryfyToken, getDataUser)

export default userRouter
