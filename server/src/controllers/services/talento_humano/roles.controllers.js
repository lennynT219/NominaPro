/* eslint-disable camelcase */
import { PrismaClient } from '@prisma/client'
import moment from 'moment'
import { mesNumero } from '../../../helpers/mesNumbers.js'
import { td } from '../../../helpers/dosDecimales.js'
import { decrypt, encrypt } from '../../../helpers/metodsEncrypt.js'
import { diffDate, generatePeriods } from '../../../helpers/metodsDate.js'
import { amountByPeriod } from '../../../helpers/metodsRol.js'
import { formatRolVac } from '../../../helpers/infoFormater.js'
import { createSendExcel } from '../../../helpers/metodsFiles.js'

const prisma = new PrismaClient()

const getAllRoles = async (req, res) => {
  try {
    let { anio, mes = '' } = req.query
    const { type } = req.params
    let numeroMes = mesNumero[mes.toLowerCase()]
    if (!anio || !numeroMes || anio === 'Año') {
      const ahora = moment()
      anio = ahora.year() // Si anio es undefined, usar el año actual
      numeroMes = ahora.month() + 1 // Si mes es undefined, usar el mes actual en texto
    }
    const fechaDesde = new Date(anio, (numeroMes) - 1, 1).toISOString().split('T')[0]
    const fechaHastaFormat = new Date(anio, (numeroMes), 0)
    const fechaHasta = fechaHastaFormat.toISOString().split('T')[0]
    const cargos = await prisma.cargos.findMany()
    const roles = await prisma.empleado.findMany({
      where: {
        RolesPago: {
          some: {
            fecha_pago: { gte: fechaDesde, lt: fechaHasta }
          }
        },
        fecha_ing_em: { lte: fechaHasta }
      },
      include: {
        CargoEmpleado: {
          where: {
            fecha_inicio: { lte: fechaHasta },
            OR: [
              { fecha_fin: { gte: fechaDesde } },
              { estado_cargo: true }
            ]
          },
          include: { Cargos: true }
        },
        RolesPago: {
          where: {
            fecha_pago: { gte: fechaDesde, lt: fechaHasta }
          },
          include: {
            DetalleIngreso: {
              include: { Ingreso: true }
            },
            DetalleEgreso: {
              include: { Egreso: true }
            }
          }
        }
      },
      orderBy: {
        apel_em: 'asc'
      }
    })
    const porcentajeIess = await prisma.parametros.findFirst({
      where: {
        nom_param: 'Aporte Individual IESS'
      },
      include: {
        ParametrosDetalle: true
      }
    })
    if (roles.length === 0) return res.status(404).json({ msg: 'No se ha encontrado información para el mes y año seleccionado' })
    const infoFormater = roles.map(rol => {
      const { CargoEmpleado, RolesPago, ci_em, nom_em, apel_em, fecha_ing_em, cuenta_em } = rol
      const sueldo = +decrypt(CargoEmpleado[0]?.sueldo) || 0
      const tercero = RolesPago[0].mes_tercero
      const cuarto = RolesPago[0].mes_cuarto
      const fondo = RolesPago[0].mes_fondo
      const quincena = RolesPago[0].quincena
      const fechaIngreso = new Date(fecha_ing_em)
      const fechaIngresoUnAnio = new Date(fechaIngreso)
      fechaIngresoUnAnio.setFullYear(fechaIngreso.getFullYear() + 1)
      const cumpleAnio = fechaHastaFormat >= fechaIngresoUnAnio
      let diasTrabajados
      let diasFondo
      if (fechaIngreso.getMonth() === fechaHastaFormat.getMonth() && fechaIngreso.getFullYear() === fechaHastaFormat.getFullYear()) {
        diasTrabajados = (30 - fechaIngreso.getDate())
      } else {
        diasTrabajados = 30
      }
      if (fechaIngresoUnAnio.getMonth() === fechaHastaFormat.getMonth() && fechaIngresoUnAnio.getFullYear() === fechaHastaFormat.getFullYear()) {
        diasFondo = (30 - fechaIngreso.getDate())
      } else {
        diasFondo = 30
      }

      const sueldoNominal = td((sueldo / 30) * diasTrabajados)
      const { ingGrabado, noIngGrabado } = RolesPago[0].DetalleIngreso.reduce((acc, det) => {
        acc[det.Ingreso.ing_grabado ? 'ingGrabado' : 'noIngGrabado'] += (+decrypt(det.monto))
        return acc
      }, { ingGrabado: 0, noIngGrabado: 0 })
      const montoEgreso = RolesPago[0].DetalleEgreso.reduce((acc, det) => acc + (+decrypt(det.monto)), 0)
      const anticipoQuincena = diasTrabajados >= 16 && quincena ? td(sueldoNominal * 0.45) : 0
      const subtotal = td(sueldoNominal + ingGrabado)
      const patronal = td(subtotal * 0.1215)
      const terceroSueldo = td(type === '2' && !tercero ? 0 : subtotal / 12)
      const cuartoSueldo = td(type === '2' && !cuarto ? 0 : 460 / 12)
      const fondoSueldo = (type === '2' && !fondo) || !cumpleAnio ? 0 : td((((sueldo / 30) * diasFondo) + ingGrabado) * 0.0833)
      const totalIngresos = td(subtotal + (tercero ? terceroSueldo : 0) + (cuarto ? cuartoSueldo : 0) + (fondo ? fondoSueldo : 0) + noIngGrabado) // total ingreso
      const individualIess = td(subtotal * (porcentajeIess.ParametrosDetalle[0].valor / 100))
      const totalDescuentos = td(individualIess + montoEgreso + anticipoQuincena)
      const ingresos = {}
      const egresos = {}
      RolesPago[0].DetalleIngreso.forEach(det => {
        ingresos[det.Ingreso.nom_tipo_ingr] = { value: +decrypt(det.monto), type: 'number', name: 'monto', id: det.id_det_ingr, modelo: 'DetalleIngreso' }
      })
      RolesPago[0].DetalleEgreso.forEach(det => {
        egresos[det.Egreso.nom_tipo_egrs] = { value: +decrypt(det.monto), type: 'number', name: 'monto', id: det.id_det_egrs, modelo: 'DetalleEgreso' }
      })
      return {
        CEDULA: { value: ci_em, name: 'ci_em', minlength: '10', maxlength: '10', modelo: 'Empleado' },
        NOMBRES: { value: nom_em, name: 'nom_em', maxlength: '30', modelo: 'Empleado' },
        APELLIDOS: { value: apel_em, name: 'apel_em', maxlength: '30', modelo: 'Empleado' },
        'FECHA INGRESO': { value: fecha_ing_em, type: 'date', name: 'fecha_ing_em', modelo: 'Empleado' },
        CARGO: {
          value: CargoEmpleado.map(caremp => ({
            ID: { value: caremp.id_cargo_emp, blockEdit: true },
            CARGO: {
              value: caremp.Cargos.nom_cargo,
              name: 'nom_cargo',
              type: 'select',
              opciones: cargos.map(cargo => cargo.nom_cargo),
              modelo: 'CargoEmpleado'
            },
            'FECHA DE INICIO': { value: caremp.fecha_inicio, type: 'date', name: 'fecha_inicio', modelo: 'CargoEmpleado' },
            'FECHA FIN': { value: caremp.fecha_fin, type: 'date', name: 'fecha_fin', modelo: 'CargoEmpleado' },
            SUELDO: { value: decrypt(caremp.sueldo), type: 'number', name: 'sueldo', modelo: 'CargoEmpleado' },
            'TIPO DE CONTRATO': {
              value: decrypt(caremp.tipo_contrato),
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
        'DIAS TRABAJADOS': { value: diasTrabajados, blockEdit: true },
        SUELDO: { value: sueldo, blockEdit: true },
        'SUELDO NOMINAL': { value: sueldoNominal, blockEdit: true },
        ...ingresos,
        SUBTOTAL: { value: subtotal, blockEdit: true },
        '13° SUELDO': {
          value: terceroSueldo,
          estado: tercero,
          type: 'select',
          name: 'mes_tercero',
          opciones: ['SI', 'NO'],
          modelo: 'RolesPago',
          id: RolesPago[0].id_rol,
          moreTotal: ['Total', 'Pagado', 'Provisión']
        },
        '14° SUELDO': {
          value: cuartoSueldo,
          estado: cuarto,
          type: 'select',
          name: 'mes_cuarto',
          opciones: ['SI', 'NO'],
          modelo: 'RolesPago',
          id: RolesPago[0].id_rol,
          moreTotal: ['Total', 'Pagado', 'Provisión']
        },
        'FONDOS DE RESERVA': {
          value: fondoSueldo,
          estado: fondo,
          type: 'select',
          name: 'mes_fondo',
          opciones: ['SI', 'NO'],
          modelo: 'RolesPago',
          id: RolesPago[0].id_rol,
          blockEdit: !cumpleAnio,
          moreTotal: ['Total', 'Pagado', 'Provisión']
        },
        'TOTAL INGRESOS': { value: totalIngresos, blockEdit: true },
        'ANTICIPO QUINCENA': {
          value: anticipoQuincena,
          estado: quincena,
          type: 'select',
          name: 'quincena',
          opciones: ['SI', 'NO'],
          modelo: 'RolesPago',
          id: RolesPago[0].id_rol
        },
        'INDIVIDUAL IESS': { value: individualIess, blockEdit: true },
        'APORTE PATRONAL': { value: patronal, blockEdit: true },
        ...egresos,
        'TOTAL DESCUENTOS': { value: totalDescuentos, blockEdit: true },
        '2° QUINCENA': { value: +(totalIngresos - totalDescuentos).toFixed(2), blockEdit: true },
        'CUENTA ACREEDORA': { value: cuenta_em, blockEdit: true }
      }
    })
    res.status(200).json(infoFormater)
  } catch (err) {
    console.log(err)
    res.status(500).json({ errors: [{ msg: 'Error al obtener los roles' }] })
  }
}

const getConsVac = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta, download } = req.query
    const empleados = await prisma.empleado.findMany({
      where: {
        fecha_ing_em: { lte: fechaHasta },
        CargoEmpleado: { some: { estado_cargo: true } }
      },
      include: {
        CargoEmpleado: {
          where: {
            fecha_inicio: { lte: fechaHasta },
            OR: [
              { fecha_fin: { gte: fechaDesde || '1970-01-01' } },
              { estado_cargo: true }
            ]
          },
          include: { Cargos: true }
        },
        Vacaciones: {
          where: {
            ini_vac_period: { gte: fechaDesde || '1970-01-01', lt: fechaHasta }
          }
        },
        RolesPago: {
          where: { fecha_pago: { gte: fechaDesde || '1970-01-01', lt: fechaHasta } },
          include: {
            DetalleIngreso: { include: { Ingreso: true } }
          }
        }
      },
      orderBy: { apel_em: 'asc' }
    })
    if (empleados.length === 0) return res.status(404).json({ msg: 'No se ha encontrado información para las fechas seleccionadas' })

    const infoFormater = empleados.map(emp => {
      const { fecha_ing_em, Vacaciones, RolesPago, CargoEmpleado } = emp
      CargoEmpleado.forEach(car => {
        car.sueldo = +decrypt(car.sueldo)
        car.tipo_contrato = decrypt(car.tipo_contrato)
      })
      RolesPago.forEach(rol => {
        rol.DetalleIngreso.forEach(det => {
          det.monto = +decrypt(det.monto)
        })
      })
      const { tiempoInstitucion, diffYears } = diffDate(fecha_ing_em, fechaHasta)
      const { periodos } = generatePeriods(fecha_ing_em, fechaHasta, fechaDesde)
      const montoPorPeriodo = amountByPeriod(periodos, fechaHasta, fecha_ing_em, Vacaciones, RolesPago, CargoEmpleado)
      return formatRolVac(emp, CargoEmpleado, tiempoInstitucion, diffYears, montoPorPeriodo)
      // return { CargoEmpleado, montoPorPeriodo }
    })
    if (download === 'Excel') {
      return await createSendExcel(infoFormater, res)
    }
    res.status(200).json(infoFormater)
  } catch (err) {
    console.log(err)
    res.status(400).json({ errors: [{ msg: 'Error al obtener los datos' }] })
  }
}

const getConsGen = async (req, res) => {
  const roles = await prisma.empleado.findMany({
    include: {
      CargoEmpleado: {
        include: {
          Cargos: true
        }
      }
    }
  })

  const infoFormater = roles.map(rol => ({
    CEDULA: { value: rol.ci_em, name: 'ci_em', maxlength: '10', minlength: '10', modelo: 'Empleado' },
    APELLIDO: { value: rol.apel_em, name: 'apel_em', maxlength: '30', modelo: 'Empleado' },
    NOMBRES: { value: rol.nom_em, name: 'nom_em', maxlength: '30', modelo: 'Empleado' },
    'FECHA INGRESO': { value: rol.fecha_ing_em, type: 'date', name: 'fecha_ing_em', modelo: 'Empleado' },
    'FECHA SALIDA': { value: '', blockEdit: true },
    CARGO: {
      value: rol.CargoEmpleado.map(caremp => ({
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
    'TIEMPO EN LA INSTITUCION': { value: 0, blockEdit: true },
    'SUELDO MESUAL': { value: 0, blockEdit: true },
    'SUELDO NOMINAL': { value: 0, blockEdit: true },
    'HORAS EXTRAS': { value: 0, blockEdit: true },
    RECNOCIMIENTO: { value: 0, blockEdit: true },
    'REMUNERACION VARIABLE': { value: 0, blockEdit: true },
    'TOTAL INGRESOS': { value: 0, blockEdit: true },
    'APORTE IESS': { value: 0, blockEdit: true },
    'APORTE PATRONAL': { value: 0, blockEdit: true },
    '13° SUELDO': { value: 0, blockEdit: true },
    '14° SUELDO': { value: 0, blockEdit: true },
    'FONDO DE RESERVA': { value: 0, blockEdit: true },
    VACACIONES: { value: 0, blockEdit: true },
    UTILIDADES: { value: 0, blockEdit: true }
  }))

  res.status(200).json(infoFormater)
}

const createAllEmpeladosRoles = async (req, res) => {
  try {
    const { anio, mes } = req.body
    const mesLower = mes.toLowerCase()
    const fechaDesde = new Date(anio, (mesNumero[mesLower]) - 1, 1).toISOString()
    const fechaHasta = new Date(anio, (mesNumero[mesLower]), 0).toISOString()
    const mesPago = String(mesNumero[mesLower]).padStart(2, '0')
    const fechaPago = `${anio}-${mesPago}-01`

    if (mes === '...') return res.status(400).json({ msg: 'Formato de mes invalido' })
    const existeRegistro = await prisma.rolesPago.findFirst({
      where: {
        fecha_pago: {
          gte: fechaDesde,
          lte: fechaHasta
        }
      }
    })
    if (existeRegistro) return res.status(400).json({ errors: [{ msg: 'Ya existen el rol para esta fecha' }] })

    const [empleados, ingresos, egresos] = await Promise.all([
      prisma.empleado.findMany(
        {
          where: {
            CargoEmpleado: {
              some: {
                estado_cargo: true
              }
            }
          }
        }
      ),
      prisma.ingreso.findMany({
        where: {
          es_defecto: true
        }
      }),
      prisma.egreso.findMany({
        where: {
          es_defecto: true
        }
      })
    ])
    for (const emp of empleados) {
      const rol = await prisma.rolesPago.create({
        data: {
          ci_em: emp.ci_em,
          fecha_pago: fechaPago
        }
      })
      const detalleIngreso = ingresos.map(ing => ({
        id_rol: rol.id_rol,
        id_ingr: ing.id_ingr,
        monto: encrypt('0')
      }))
      const detalleEgreso = egresos.map(egr => ({
        id_rol: rol.id_rol,
        id_egrs: egr.id_egrs,
        monto: encrypt('0')
      }))
      await prisma.detalleIngreso.createMany({
        data: detalleIngreso
      })
      await prisma.detalleEgreso.createMany({
        data: detalleEgreso
      })
    }
    res.status(200).json({ msg: 'Roles creados' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ errors: [{ msg: 'Error al crear roles' }] })
  }
}

const getAnioRoles = async (req, res) => {
  const roles = await prisma.rolesPago.findMany()
  const anios = roles.map(rol => new Date(rol.fecha_pago).getFullYear())
  const aniosUnicos = [...new Set(anios)]
  res.status(200).json(aniosUnicos)
}

const getParams = async (req, res) => {
  const params = await prisma.parametros.findMany({
    include: {
      ParametrosDetalle: true
    }
  })
  const paramsFormater = params.map(param => ({
    label: param.nom_param,
    values: param.ParametrosDetalle.map(det => ({
      detalle: det.nom_param_det,
      icon: det.icon,
      value: det.valor,
      type: 'number',
      name: det.id_param_det
    }))
  }))
  res.status(200).json(paramsFormater)
}

const updateParams = async (req, res) => {
  const kesy = Object.keys(req.body)
  kesy.map(async key => (
    await prisma.parametrosDetalle.update({
      where: {
        id_param_det: +key
      },
      data: {
        valor: req.body[key]
      }
    })
  ))
  res.status(200).json({ msg: 'Parametros actualizados' })
}

export {
  getAllRoles,
  getConsVac,
  getConsGen,
  createAllEmpeladosRoles,
  getAnioRoles,
  getParams,
  updateParams
}
