import { PrismaClient } from '@prisma/client'
import { matchPassword } from '../helpers/metodsPassword.js'
import { createToken } from '../middlewares/auth.js'

const prisma = new PrismaClient()

const login = async (req, res) => {
  const { username, password } = req.body

  const usuario = await prisma.usuario.findFirst({ where: { username } })
  if (!usuario) return res.status(404).json({ errors: [{ msg: 'El nombre de usuario no esta registrado' }] })
  const verifyPassword = await matchPassword(password, usuario.password)
  if (!verifyPassword) return res.status(404).json({ errors: [{ msg: 'Contraseña incorrecta' }] })
  const token = createToken(usuario.id_user)

  res.status(200).json({ msg: 'Bienvenido', token })
}

const getModuls = async (req, res) => {
  const user = req.user

  const rolesName = await prisma.rolesUser.findMany({
    where: { id_user: user.id_user, endAt: null },
    select: { nom_roles: true }
  })
  const rolesIdArray = rolesName.map(rol => rol.nom_roles)

  const modulos = await prisma.modulos.findMany({
    include: {
      SecionModul: {
        include: {
          OpcionesSection: {
            include: {
              OpcionesRoles: {
                where: {
                  nom_roles: {
                    in: rolesIdArray
                  }
                }
              }
            }
          }
        }
      }
    }
  })

  const modulosFormat = modulos.map(modul => ({
    label: modul.label,
    icon: modul.icon,
    url: modul.url,
    secciones: modul.SecionModul.map(seccion => ({
      label: seccion.label,
      opciones: seccion.OpcionesSection
        .filter(opcion =>
          opcion.OpcionesRoles.some(opRol => rolesIdArray.includes(opRol.nom_roles))
        )
        .map(opcion => ({
          label: opcion.label,
          icon: opcion.icon,
          url: opcion.url,
          component: opcion.component
        }))
    })).filter(seccion => seccion.opciones.length > 0)
  })).filter(modul => modul.secciones.length > 0)
  res.status(200).json(modulosFormat)
}

const getDataUser = async (req, res) => {
  let empleado
  let firstName = false
  if (req.user?.ci_em) {
    empleado = await prisma.empleado.findUnique({ where: { ci_em: req.user.ci_em } })
    firstName = empleado?.nom_em.split(' ')[0]
  }
  const userFormat = {
    name: firstName || req.user?.username,
    img: req.user?.img,
    ci_em: empleado?.ci_em || null
  }
  res.status(200).json(userFormat)
}

export {
  getModuls,
  login,
  getDataUser
}
