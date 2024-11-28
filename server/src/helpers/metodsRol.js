/* eslint-disable camelcase */
import moment from 'moment'
import { decrypt } from './metodsEncrypt.js'
import { td } from './dosDecimales.js'

const proporcionalSalary2 = (sueldo, desde, hasta, roles) => {
  const fechaDesde = moment(desde)
  const fechaHasta = moment(hasta)
  const mesesCompletos = fechaHasta.diff(fechaDesde, 'months')
  const diasRestantes = fechaHasta.diff(fechaDesde.clone().add(mesesCompletos, 'months'), 'days')
  return td((sueldo * mesesCompletos) + (sueldo / 30 * diasRestantes))
}

const proporcionalSalary = (sueldo, desde, hasta, roles) => {
  const fechaDesde = moment(desde)
  const fechaHasta = moment(hasta)
  let sueldTotal = 0
  const ingresos = []

  for (let m = moment(desde); m.isSameOrBefore(fechaHasta, 'month'); m.add(1, 'months')) {
    let ingresosMensuales = 0
    const info = {
      mes: m.get('month'),
      ingresos: 0,
      diasProporcionales: 0
    }

    roles.forEach(rol => {
      const fechaPago = moment(rol.fecha_pago)
      if (fechaPago.isSame(m, 'month') && fechaPago.isSame(m, 'year')) {
        info.fechaPago = fechaPago.format('DD/MM/YYYY')
        rol.DetalleIngreso.forEach(ingreso => {
          if (ingreso.Ingreso.ing_grabado) {
            ingresosMensuales += ingreso.monto
          }
        })
      }
    })

    info.ingresosMensuales = ingresosMensuales

    if (m.isSame(fechaDesde, 'month') && m.isSame(fechaDesde, 'year')) {
      // Proporcional para el primer mes parcial
      const diasProporcionales = 30 - fechaDesde.date() + 1
      // const diasProporcionales = 30
      sueldTotal += ((sueldo + ingresosMensuales) / 30) * diasProporcionales
      info.ingresos = ((sueldo + ingresosMensuales) / 30) * diasProporcionales
      info.diasProporcionales = diasProporcionales
    } else if (m.isSame(fechaHasta, 'month') && m.isSame(fechaHasta, 'year')) {
      // Proporcional para el ultimo mes parcial
      const diasProporcionales = fechaHasta.date() - 1
      sueldTotal += ((sueldo + ingresosMensuales) / 30) * diasProporcionales
      info.ingresos = ((sueldo + ingresosMensuales) / 30) * diasProporcionales
      info.diasProporcionales = diasProporcionales
    } else {
      // Proporcional para los meses completos
      sueldTotal += sueldo + ingresosMensuales
      info.ingresos = sueldo + ingresosMensuales
      info.diasProporcionales = 30
    }
    ingresos.push(info)
  }
  console.log('-------------------------------------------------------------')
  console.log({ desde, hasta, sueldTotal, ingresos })
  return td(sueldTotal)
}

const calculateSalaryForPeriod = (cargo, inicio, fin, fechaHasta, rolesPago) => {
  const fechaInicioCargo = moment(cargo.fecha_inicio)
  const fechaFinCargo = cargo.fecha_fin ? moment(cargo.fecha_fin) : moment(fechaHasta)
  const fechaInicioPeriodo = moment(inicio)
  const fechaFinPeriodo = moment(fin)

  // Si el cargo no tiene fecha de fin y la fecha de inicio es posterior al fin del periodo
  if (fechaInicioCargo.isAfter(fin) || fechaFinCargo.isBefore(inicio)) return 0

  const fechaInicio = moment.max(fechaInicioCargo, fechaInicioPeriodo)
  const fechaFin = moment.min(fechaFinCargo, fechaFinPeriodo)
  const roles = rolesPago.filter(rol =>
    (moment(rol.fecha_pago).isSame(fechaInicio, 'month') && moment(rol.fecha_pago).isSame(fechaInicio, 'year')) ||
    moment(rol.fecha_pago).isBetween(fechaInicio, fechaFin, null, '[]')
  )
  // console.log('-------------------------------------------------------------')
  // console.log({ fechaInicio, fechaFin, roles })
  return proporcionalSalary(cargo.sueldo, fechaInicio, fechaFin, roles)
}

const calculateVacationDays = (fechaIngreso, finPeriod, fechaHasta, inicioPeriod) => {
  const ingreso = moment(fechaIngreso)
  const fin = moment(finPeriod)
  const hasta = moment(fechaHasta)
  const inicio = moment(inicioPeriod)

  const diffYears = fin.diff(ingreso, 'years')
  const cumulativeTotalDays = diffYears > 5 ? Math.min(15 + (diffYears - 5), 30) : 15
  const cumulativeDays = moment.min(hasta, fin).diff(inicio, 'months')
  return {
    cumulativeTotalDays,
    cumulativeDays: td((cumulativeDays * cumulativeTotalDays) / 12)
  }
}

const vacacionesTotal = (diasTotales, montoTotal, diasUsados, diasAcumulados, Cargo) => {
  let valorDia
  if (diasAcumulados === 0) {
    valorDia = 0
  } else {
    valorDia = (montoTotal / 24) / diasAcumulados
  }

  return {
    diasUsados,
    valorUsados: td(valorDia * diasUsados),
    diasAcumulados: diasAcumulados - diasUsados,
    valorAcumulados: td(valorDia * (diasAcumulados - diasUsados))
  }
}

const amountByPeriod = (periodos, fechaHasta, fechaIngreso, Vacaciones, RolesPago, CargoEmpleado) => {
  return periodos.map(periodo => {
    let diasUsados = 0
    const montoTotalSueldo = 0
    const { inicio, fin } = periodo
    let montoTotal = 0

    CargoEmpleado && /* CargoEmpleado[0].ci_em === '0503960478' && */CargoEmpleado.forEach(cargo => {
      montoTotal += calculateSalaryForPeriod(cargo, inicio, fin, fechaHasta, RolesPago)
    })

    Vacaciones && Vacaciones.forEach(vacacion => {
      const fechaInicio = moment(vacacion.ini_vac_period)
      // const fechaFin = moment(vacacion.fin_vac_period)
      if (fechaInicio.isSameOrAfter(inicio) && fechaInicio.isBefore(fin)) {
        diasUsados += vacacion.dias
      }
    })
    const { cumulativeTotalDays, cumulativeDays } = calculateVacationDays(fechaIngreso, fin, fechaHasta, inicio)

    return {
      ...periodo,
      monto: montoTotal,
      montoTotalSueldo,
      ...vacacionesTotal(cumulativeTotalDays, montoTotal, diasUsados, cumulativeDays, CargoEmpleado)
    }
  })
}

const amountByPeriod2 = (periodos, RolesPago, CargoEmpleado, fechaHasta, fechaIngreso, diasUsados) => {
  let diasUsadosUpdated = diasUsados
  return periodos.map(periodo => {
    const { inicio, fin } = periodo
    let montoTotal = 0
    CargoEmpleado.forEach(cargo => {
      montoTotal += calculateSalaryForPeriod(cargo, inicio, fin, fechaHasta)
    })
    RolesPago.forEach(rol => {
      const fechaRol = moment(rol.fecha_pago)
      if (fechaRol.isBetween(inicio, fin, null, '[]')) {
        rol.DetalleIngreso.forEach(ing => {
          if (ing.Ingreso.ing_grabado) {
            const monto = +decrypt(ing.monto)
            montoTotal += monto
          }
        })
      }
    })
    const { cumulativeTotalDays, cumulativeDays } = calculateVacationDays(fechaIngreso, fin, fechaHasta, inicio)
    let diasUsados = 0
    if (diasUsadosUpdated >= cumulativeDays) {
      diasUsadosUpdated -= cumulativeDays
      diasUsados = cumulativeDays
    } else {
      diasUsados = diasUsadosUpdated
      diasUsadosUpdated = 0
    }
    return {
      ...periodo,
      monto: montoTotal,
      ...vacacionesTotal(cumulativeTotalDays, montoTotal, diasUsados, cumulativeDays)
    }
  })
}

export { amountByPeriod }
