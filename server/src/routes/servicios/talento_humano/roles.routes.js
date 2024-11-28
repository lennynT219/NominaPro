import { Router } from 'express'
import {
  getAllRoles,
  getConsGen,
  getConsVac,
  createAllEmpeladosRoles,
  getAnioRoles,
  getParams,
  updateParams
} from '../../../controllers/services/talento_humano/roles.controllers.js'

const rolesRouter = Router()

rolesRouter.post('/rol', createAllEmpeladosRoles)
rolesRouter.get('/cons/vac', getConsVac)
rolesRouter.get('/cons/gen', getConsGen)
rolesRouter.get('/rol/anio', getAnioRoles)
rolesRouter.get('/params', getParams)
rolesRouter.post('/params', updateParams)
rolesRouter.get('/rol/:type', getAllRoles)

export default rolesRouter
