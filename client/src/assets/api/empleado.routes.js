/* eslint-disable camelcase */
const BASE_URL = import.meta.env.VITE_API_URL
const url_getAllEmpleados = `${BASE_URL}/api/emp`
const url_ingresarEmpleado = `${BASE_URL}/api/emp`
const url_updateEmpleados = `${BASE_URL}/api/emp`
const url_deleteAll = (id, modelo) => `${BASE_URL}/api/emp/${id}/${modelo}`
const url_ingresarAll = (ciEm, modelo) => `${BASE_URL}/api/emp/${ciEm}/${modelo}`
const url_vacaciones = `${BASE_URL}/api/emp/vacaciones`
const url_cargos = `${BASE_URL}/api/emp/cargos`
const url_createCargoEmpleado = (ciEm) => `${BASE_URL}/api/emp/${ciEm}/cargosEmp`
const url_getAllRoles = (rol) => `${BASE_URL}/api/rol/${rol}`
const url_getConsVac = `${BASE_URL}/api/cons/vac`
const url_getConsGen = `${BASE_URL}/api/cons/gen`
const url_createAreas = `${BASE_URL}/api/areas`
const url_getAreas = `${BASE_URL}/api/areas`
const url_createCargos = `${BASE_URL}/api/cargos`
const url_getCargos = `${BASE_URL}/api/cargos`
const url_createAllEmpeladosRoles = `${BASE_URL}/api/rol`
const url_getAnioRoles = `${BASE_URL}/api/rol/anio`
const url_getParams = `${BASE_URL}/api/params`
const url_updateParams = `${BASE_URL}/api/params`
const url_moduls = `${BASE_URL}/api/modul`
const url_login = `${BASE_URL}/api/login`
const url_getDataUser = `${BASE_URL}/api/user`
const url_createUser = `${BASE_URL}/api/user`
const url_getEmpleadoUsers = `${BASE_URL}/api/emp/user`
const url_getUsers = `${BASE_URL}/api/users`
const url_getRoles = id => `${BASE_URL}/api/roles/${id}`
const url_assignRol = `${BASE_URL}/api/roles`
const url_updateOne = `${BASE_URL}/api/update-one`
const url_diasVacacionesByCi = (ci) => `${BASE_URL}/api/emp/dias-vacaciones/${ci}`

export {
  url_ingresarEmpleado,
  url_getAllEmpleados,
  url_updateEmpleados,
  url_deleteAll,
  url_ingresarAll,
  url_vacaciones,
  url_cargos,
  url_getAllRoles,
  url_getConsVac,
  url_getConsGen,
  url_createAreas,
  url_getAreas,
  url_createCargos,
  url_getCargos,
  url_createCargoEmpleado,
  url_createAllEmpeladosRoles,
  url_getAnioRoles,
  url_getParams,
  url_updateParams,
  url_moduls,
  url_login,
  url_getDataUser,
  url_createUser,
  url_getEmpleadoUsers,
  url_getUsers,
  url_getRoles,
  url_assignRol,
  url_updateOne,
  url_diasVacacionesByCi
}
