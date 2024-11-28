/* eslint-disable camelcase */
import { PrismaClient } from '@prisma/client'
import { enryptPassword } from '../../../helpers/metodsPassword.js'

const prisma = new PrismaClient()

const createUser = async (req, res) => {
  const user = req.body

  const usernameVerify = await prisma.usuario.findFirst({ where: { username: user.username } })
  if (usernameVerify) return res.status(400).json({ errors: [{ msg: 'El nombre de usuario ya esta registrado' }] })

  user.password = await enryptPassword(user.password)
  await prisma.usuario.create({
    data: user
  })
  res.status(200).json({ msg: 'Usuario creado con exito' })
}

const getEmpleadosUser = async (rep, res) => {
  const empleados = await prisma.empleado.findMany({
    include: {
      Usuario: {
        include: {
          RolesUser: true
        }
      }
    }
  })
  const infoFormater = {
    values: empleados.map(emp => ({
      CEDULA: { value: emp.ci_em, type: 'number', name: 'ci_em' },
      NOMBRES: { value: emp.nom_em, type: 'text', name: 'nom_em' },
      APELLIDO: { value: emp.apel_em, type: 'text', name: 'apel_em' },
      USUARIO: {
        value: emp.Usuario.map(users => ({
          ID: { value: users.id_user, type: 'number', name: 'id_user' },
          USUARIO: { value: users.username, name: 'username' },
          ROL: {
            value: users.RolesUser.map(rol => ({
              ID: { value: rol.id_roles_user },
              NOMBRE: { value: rol.nom_roles, name: 'nom_roles' }
            })),
            modelo: 'RolesUser'
          },
          'FECHA DE CREACION': { value: users.createdAt.toISOString().split('T')[0], type: 'date', name: 'createdAt' }
        })),
        modelo: 'Usuario'
      },
      CORREO: { value: emp.correo_em, type: 'email', name: 'correo_em' },
      GENERO: { value: emp.genero_em, type: 'text', name: 'genero_em' }

    })),
    modelo: 'Empleado'
  }
  res.status(200).json(infoFormater)
}

const getUsers = async (rep, res) => {
  const usuarios = await prisma.usuario.findMany({
    include: {
      Empleado: true,
      RolesUser: {
        where: {
          endAt: null
        }
      }
    }
  })
  const infoFormater = {
    values: usuarios.map(users => ({
      ID: { value: users.id_user, type: 'number', name: 'id_user', blockEdit: true },
      USUARIO: { value: users.username, name: 'username' },
      ROL: {
        value: users.RolesUser.map(rol => ({
          ID: { value: rol.id_roles_user },
          NOMBRE: { value: rol.nom_roles, name: 'nom_roles' }
        })),
        modelo: 'RolesUser'
      },
      'FECHA DE CREACION': { value: users.createdAt.toISOString().split('T')[0], type: 'date', name: 'createdAt', blockEdit: true }
    })),
    modelo: 'Usuario'
  }
  res.status(200).json(infoFormater)
}

const getRoles = async (req, res) => {
  const rolesUser = await prisma.rolesUser.findMany({
    where: {
      id_user: +req.params.id,
      endAt: null
    }
  })

  const roleNames = rolesUser.map(rol => rol.nom_roles)
  const roles = await prisma.roles.findMany({
    where: {
      nom_roles: {
        notIn: roleNames
      }
    }
  })
  const rolesFormater = roles.map(rol => ({
    NOMBRE: { value: rol.nom_roles, name: 'nom_roles' }
  }))

  res.status(200).json(rolesFormater)
}

const assignRol = async (req, res) => {
  const { id, roles } = req.body

  const data = roles.map(rol => ({
    id_user: id,
    nom_roles: rol.NOMBRE.value
  }))
  const currentRol = await prisma.rolesUser.findMany({
    where: {
      id_user: id,
      endAt: null
    }
  })
  const key = rol => `${rol.id_user}-${rol.nom_roles}`
  const currentRolSet = new Set(currentRol.map(dbRol => key(dbRol)))
  const newRoles = []
  const remmoveRol = new Set(currentRolSet)
  for (const rol of data) {
    if (!currentRolSet.has(key(rol))) {
      newRoles.push(rol)
    }
    remmoveRol.delete(key(rol))
  }
  const endRol = Array.from(remmoveRol).map(key => {
    const [id_user, nom_roles] = key.split('-')
    return { id_user: +id_user, nom_roles }
  })

  if (newRoles.length > 0) {
    await prisma.rolesUser.createMany({
      data: newRoles
    })
  }
  if (endRol.length > 0) {
    await prisma.rolesUser.updateMany({
      where: {
        OR: endRol.map(rol => ({
          id_user: rol.id_user,
          nom_roles: rol.nom_roles
        })),
        endAt: null
      },
      data: {
        endAt: new Date()
      }
    })
  }

  res.status(201).json({ msg: 'Usuario actualizado coorrectamente' })
}

export {
  createUser,
  getEmpleadosUser,
  getUsers,
  getRoles,
  assignRol
}
