import { td } from './dosDecimales.js'

const formatRolVac = (empleado, CargoEmpleado, tiempoInstitucion, diffYears, montoPorPeriodo) => {
  const { diasAcumulados, totalAcumulado, diasOcupados, totalOcupados } = montoPorPeriodo.reduce((sum, periodo) => {
    sum.diasAcumulados += periodo.diasAcumulados
    sum.totalAcumulado += periodo.valorAcumulados
    sum.diasOcupados += periodo.diasUsados
    sum.totalOcupados += periodo.valorUsados
    return sum
  }, { diasAcumulados: 0, totalAcumulado: 0, diasOcupados: 0, totalOcupados: 0 })

  return {
    CEDULA: { value: empleado.ci_em, name: 'ci_em', maxlength: '10', minlength: '10', modelo: 'Empleado' },
    APELLIDO: { value: empleado.apel_em, name: 'apel_em', maxlength: '30', modelo: 'Empleado' },
    NOMBRES: { value: empleado.nom_em, name: 'nom_em', maxlength: '30', modelo: 'Empleado' },
    'FECHA INGRESO': { value: empleado.fecha_ing_em, type: 'date', name: 'fecha_ing_em', modelo: 'Empleado' },
    CARGO: {
      value: CargoEmpleado.map(caremp => ({
        ID: { value: caremp.id_cargo_emp, blockEdit: true },
        CARGO: { value: caremp.Cargos.nom_cargo, name: 'nom_cargo' },
        'FECHA DE INICIO': { value: caremp.fecha_inicio, type: 'date', name: 'fecha_inicio', modelo: 'CargoEmpleado' },
        'FECHA FIN': { value: caremp.fecha_fin, type: 'date', name: 'fecha_fin', modelo: 'CargoEmpleado' },
        SUELDO: { value: caremp.sueldo, type: 'number', name: 'sueldo', modelo: 'CargoEmpleado' },
        'TIPO DE CONTRATO': {
          value: caremp.tipo_contrato,
          name: 'tipo_contrato',
          type: 'select',
          opciones: ['Periodo de prueba', 'Indefinido'],
          modelo: 'CargoEmpleado'
        },
        JORNADA: {
          value: caremp.jornada,
          name: 'jornada',
          type: 'select',
          opciones: ['Matutitina', 'Vespertina'],
          modelo: 'CargoEmpleado'
        },
        ESTADO: {
          value: caremp.estado_cargo ? 'ACTIVO' : 'INACTIVO',
          name: 'estado_cargo',
          type: 'select',
          opciones: ['ACTIVO', 'INACTIVO'],
          modelo: 'CargoEmpleado'
        }
      }))
    },
    'TIEMPO EN LA INSTITUCION': { value: tiempoInstitucion, blockEdit: true },
    'DERECHO A VACACIONES': { value: diffYears >= 1 ? 'SI' : 'NO', blockEdit: true },
    'DIAS ACUMULADOS': { value: diasAcumulados, blockEdit: true },
    'TOTAL ACUMULADO $': { value: td(totalAcumulado), blockEdit: true },
    'DIAS OCUPADOS': { value: diasOcupados, blockEdit: true },
    'TOTAL OCUPADOS $': { value: totalOcupados, blockEdit: true },
    'DIAS TOTALES': { value: diasAcumulados + diasOcupados, blockEdit: true },
    'TOTAL $': { value: td(totalAcumulado + totalOcupados), blockEdit: true }
  }
}

export {
  formatRolVac
}
