import { ConsoGen } from './ConsoGen/ConsoGen'
import { ConsoVac } from './ConsoVac/ConsoVac'
import { Empresa } from './Empresa/Empresa'
import { Param } from './Param/Param'
import { Personal } from './Personal/Personal'
import { RolGeneral } from './RolGeneral/RolGeneral'
import { Vacacion } from './Vacacion/Vacacion'
import { Users } from './Users/Users'
import { Empleado } from './Empleado/Empleado'

export { RolGeneral } from './RolGeneral/RolGeneral'
export { ConsoVac } from './ConsoVac/ConsoVac'
export { ConsoGen } from './ConsoGen/ConsoGen'
export { Personal } from './Personal/Personal'
export { Vacacion } from './Vacacion/Vacacion'
export { Empresa } from './Empresa/Empresa'
export { Param } from './Param/Param'
export { Empleado } from './Empleado/Empleado'

const componentMap = {
  RolGeneral,
  ConsoVac,
  ConsoGen,
  Param,
  Personal,
  Vacacion,
  Empresa,
  Users,
  Empleado
}

const ListViews = (component) => {
  const Component = componentMap[component]
  return Component ? <Component /> : null
}

export {
  ListViews
}
