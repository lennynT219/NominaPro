import moment from 'moment'

const diffDate = (fechaIngreso, fechaHasta) => {
  const fechaHastaMoment = moment(fechaHasta)
  const fechaIngresoMoment = moment(fechaIngreso)
  const diffYears = fechaHastaMoment.diff(fechaIngresoMoment, 'years')
  fechaIngresoMoment.add(diffYears, 'years')
  const diffMonths = fechaHastaMoment.diff(fechaIngresoMoment, 'months')
  fechaIngresoMoment.add(diffMonths, 'months')
  const diffDays = fechaHastaMoment.diff(fechaIngresoMoment, 'days')
  return {
    tiempoInstitucion: `${diffYears} años, ${diffMonths} meses y ${diffDays} dias`,
    diffYears
  }
}

const generatePeriods = (fechaIngreso, fechaHasta, fechaDesde) => {
  const fechaDesdeMoment = moment(fechaDesde || fechaIngreso)
  const fechaHastaMoment = moment(fechaHasta)
  const periodos = []

  let inicioPeriodo = fechaDesdeMoment.clone()
  while (inicioPeriodo.isBefore(fechaHastaMoment)) {
    const finPeriodo = inicioPeriodo.clone().add(1, 'years')
    periodos.push({
      inicio: inicioPeriodo.format('YYYY-MM-DD'),
      fin: finPeriodo.format('YYYY-MM-DD')
    })
    inicioPeriodo = finPeriodo.clone()
  }
  return {
    periodos
  }
}
export {
  diffDate,
  generatePeriods
}
