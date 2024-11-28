import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

const veryfyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Token no proporcionado' })

  const { authorization } = req.headers

  try {
    const { id } = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET)
    req.user = await prisma.usuario.findUnique({ where: { id_user: id } })
    delete req.user.password
    next()
  } catch (err) {
    const e = new Error('Token no válido')
    return res.status(401).json({ message: e.message })
  }
}

// const verifyRol = (...rol) => (req, res, next) => {
//   if (!rol.includes(req.user.rol)) {
//     return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' })
//   }
//   next()
// }

export {
  createToken,
  veryfyToken
  // verifyRol
}
