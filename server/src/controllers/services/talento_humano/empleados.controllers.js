/* eslint-disable camelcase */
import { PrismaClient } from '@prisma/client'
import pks from '../../../helpers/pkeys.js'
import { mesNumero } from '../../../helpers/mesNumbers.js'
import { decrypt, encrypt } from '../../../helpers/metodsEncrypt.js'
import moment from 'moment'
import { generatePeriods } from '../../../helpers/metodsDate.js'
import { amountByPeriod } from '../../../helpers/metodsRol.js'
import { createSendExcel } from '../../../helpers/metodsFiles.js'

const prisma = new PrismaClient()

const ingresarEmpleado = async (req, res) => {
  try {
    const { correo_em, ci_em, cuenta_em } = req.body
    const data = req.body
    let detalleIngreso
    let detalleEgreso

    if (Object.values(req.body).includes('')) return res.status(400).json({ errors: [{ msg: 'Faltan datos' }] })
    const empleadoExistente = await prisma.empleado.findFirst({
      where: {
        OR: [
          { correo_em },
          { ci_em },
          { cuenta_em }
        ]
      }
    })
    if (empleadoExistente) {
      let campoDuplicado = ''
      if (empleadoExistente.correo_em === correo_em) campoDuplicado = 'correo'
      else if (empleadoExistente.ci_em === ci_em) campoDuplicado = 'cedula'
      else if (empleadoExistente.cuenta_em === cuenta_em) campoDuplicado = 'cuenta de empresa'
      return res.status(400).json({ errors: [{ msg: `La ${campoDuplicado} ya está registrado` }] })
    }

    const empleado = await prisma.empleado.create({ data })
    const anio = new Date(empleado.fecha_ing_em).getFullYear()
    const mes = String(new Date(empleado.fecha_ing_em).getMonth() + 1).padStart(2, '0')
    const fechaInicio = new Date(`${anio}-${mes}-01`).toISOString().split('T')[0]
    const fechaFin = new Date(anio, mes, 0).toISOString().split('T')[0]
    const [ingresos, egresos] = await Promise.all([
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

    const rolExistente = await prisma.rolesPago.findFirst({
      where: {
        fecha_pago: {
          gte: fechaInicio,
          lt: fechaFin
        }
      },
      include: {
        DetalleEgreso: {
          include: {
            Egreso: true
          }
        },
        DetalleIngreso: {
          include: {
            Ingreso: true
          }
        }
      }
    })
    const rol = await prisma.rolesPago.create({
      data: {
        ci_em: empleado.ci_em,
        fecha_pago: `${anio}-${mes}-01`
      }
    })
    if (rolExistente) {
      detalleIngreso = rolExistente.DetalleIngreso.map(det => ({
        id_rol: rol.id_rol,
        id_ingr: det.Ingreso.id_ingr
      }))

      detalleEgreso = rolExistente.DetalleEgreso.map(det => ({
        id_rol: rol.id_rol,
        id_egrs: det.Egreso.id_egrs
      }))
    } else {
      detalleIngreso = ingresos.map(ing => ({
        id_rol: rol.id_rol,
        id_ingr: ing.id_ingr,
        monto: encrypt(0)
      }))
      detalleEgreso = egresos.map(egr => ({
        id_rol: rol.id_rol,
        id_egrs: egr.id_egrs,
        monto: encrypt(0)
      }))
    }
    await prisma.detalleIngreso.createMany({
      data: detalleIngreso
    })
    await prisma.detalleEgreso.createMany({
      data: detalleEgreso
    })
    res.status(201).json({ msg: 'Empleado creado' })
  } catch (err) {
    console.log(err)
    res.status(400).json({ errors: [{ msg: 'Error al crear empleado' }] })
  }
}

// const updateEmpleados = async (req, res) => {
//   req.body.forEach(async cambio => {
//     const { ci_em, mesRol, anioRol, value } = cambio
//     const numeroMes = mesNumero[mesRol.toLowerCase()]
//     const fechaDesde = new Date(anioRol, (numeroMes) - 1, 1).toISOString()
//     const fechaHasta = new Date(anioRol, (numeroMes), 0).toISOString()
//     const empleado = await prisma.empleado.findUnique({
//       where: {
//         ci_em
//       },
//       include: {
//         RolesPago: {
//           where: {
//             fecha_pago: {
//               gte: fechaDesde,
//               lt: fechaHasta
//             }
//           },
//           include: {
//             Ingresos: true,
//             Egresos: true
//           }
//         }
//       }
//     })
//     if (value.reconocimiento || value.variable || value.horas_extras || value.alimentacion) {
//       const reconocimiento = +(value.reconocimiento || empleado.RolesPago[0].Ingresos.reconocimiento)
//       const variable = +(value.variable || empleado.RolesPago[0].Ingresos.variable)
//       const horas_extras = +(value.horas_extras || empleado.RolesPago[0].Ingresos.horas_extras)
//       const alimentacion = +(value.alimentacion || empleado.RolesPago[0].Ingresos.alimentacion)
//
//       const data = { reconocimiento, variable, horas_extras, alimentacion }
//       await prisma.ingresos.update({
//         where: {
//           id_rol: empleado.RolesPago[0].id_rol
//         },
//         data
//       })
//     }
//     if (value.hipotecario || value.quirografario || value.cuentas_cobrar || value.seguro_medico || value.anticipo || value.extencion_iess) {
//       const hipotecario = +(value.hipotecario || empleado.RolesPago[0].Egresos.hipotecario)
//       const quirografario = +(value.quirografario || empleado.RolesPago[0].Egresos.quirografario)
//       const cuentas_cobrar = +(value.cuentas_cobrar || empleado.RolesPago[0].Egresos.cuentas_cobrar)
//       const seguro_medico = +(value.seguro_medico || empleado.RolesPago[0].Egresos.seguro_medico)
//       const anticipo = +(value.anticipo || empleado.RolesPago[0].Egresos.anticipo)
//       const extencion_iess = +(value.extencion_iess || empleado.RolesPago[0].Egresos.extencion_iess)
//       const data = { hipotecario, quirografario, cuentas_cobrar, seguro_medico, anticipo, extencion_iess }
//       console.log(data)
//       await prisma.egresos.update({
//         where: {
//           id_rol: empleado.RolesPago[0].id_rol
//         },
//         data
//       })
//     }
//   })
//   res.status(200).json({ msg: 'Actualizaciones correctas' })
// }

const getAllEmpleados = async (req, res) => {
  try {
    const { download } = req.query
    const empleados = await prisma.empleado.findMany({
      where: { CargoEmpleado: { some: { estado_cargo: true } } },
      include: {
        CargosFamiliares: true,
        FormacionAcademica: true,
        ExperienciaLaboral: true,
        Cursos: true
      },
      orderBy: { apel_em: 'asc' }
    })
    if (empleados.length === 0) {
      await prisma.empleado.create({
        data: {
          ci_em: '1234567890',
          nom_em: 'Admin',
          apel_em: 'Admin',
          fecha_nace_em: 'admin',
          dir_domicilio_em: 'Admin',
          correo_em: 'admin@admin',
          celular_em: '1234567890',
          est_civil_em: 'Soltero',
          genero_em: 'Masculino',
          cuenta_em: 'admin',
          fecha_ing_em: 'admin'
        }
      })
    }
    const infoFormater = empleados.map(emp => ({
      CEDULA: { value: emp.ci_em, name: 'ci_em', maxlength: '10', minlength: '10', modelo: 'Empleado' },
      APELLIDO: { value: emp.apel_em, name: 'apel_em', maxlength: '30', modelo: 'Empleado' },
      NOMBRES: { value: emp.nom_em, name: 'nom_em', maxlength: '30', modelo: 'Empleado' },
      'FECHA DE NACIMIENTO': { value: emp.fecha_nace_em, type: 'date', name: 'fecha_nace_em', modelo: 'Empleado' },
      'DIRECCION DOMICILIO': { value: emp.dir_domicilio_em, name: 'dir_domicilio_em', modelo: 'Empleado' },
      CORREO: { value: emp.correo_em, type: 'email', name: 'correo_em', modelo: 'Empleado' },
      CELULAR: { value: emp.celular_em, name: 'celular_em', modelo: 'Empleado' },
      TELEFONO: { value: emp.telefono_em || '', name: 'telefono_em', modelo: 'Empleado', maxlength: '10' },
      'ESTADO CIVIL': {
        value: emp.est_civil_em,
        name: 'est_civil_em',
        modelo: 'Empleado',
        type: 'select',
        opciones: ['Soltero', 'Casado', 'Divorciado', 'Viudo']
      },
      GENERO: {
        value: emp.genero_em,
        name: 'genero_em',
        modelo: 'Empleado',
        type: 'select',
        opciones: ['Femenino', 'Masculino', 'Otro']
      },
      CUENTA: { value: emp.cuenta_em, name: 'cuenta_em', modelo: 'Empleado' },
      'FECHA INGRESO': { value: emp.fecha_ing_em, type: 'date', name: 'fecha_ing_em', modelo: 'Empleado' },
      'CARGAS FAMILIARES': {
        value: emp.CargosFamiliares.map(carga => ({
          ID: { value: carga.id_cargo, type: 'number', name: 'id_cargo', blockEdit: true },
          NOMBRE: { value: carga.nom_carga, name: 'nom_carga', modelo: 'CargosFamiliares' },
          APELLIDO: { value: carga.apel_cargo, name: 'apel_cargo', modelo: 'CargosFamiliares' },
          PARENTESCO: {
            value: carga.parentesco,
            name: 'parentesco',
            modelo: 'CargosFamiliares',
            type: 'select',
            opciones: ['Hijo', 'Hija', 'Esposo/a']
          },
          'FECHA DE NACIMIENTO': { value: carga.fecha_nace, type: 'date', name: 'fecha_nace', modelo: 'CargosFamiliares' }
        }))
      },
      'FORMACION ACADEMICA': {
        value: emp.FormacionAcademica.map(form => ({
          ID: { value: form.id_for, type: 'number', name: 'id_for', modelo: 'FormacionAcademica', blockEdit: true },
          TITULO: { value: form.titulo, name: 'titulo', modelo: 'FormacionAcademica' },
          INSTITUCION: { value: form.institucion, name: 'institucion', modelo: 'FormacionAcademica' }
        }))
      },
      'EXPERIENCIA LABORAL': {
        value: emp.ExperienciaLaboral.map(exp => ({
          ID: { value: exp.id_exp, type: 'number', name: 'id_exp', blockEdit: true },
          EMPRESA: { value: exp.empresa, name: 'empresa', modelo: 'ExperienciaLaboral' },
          CARGO: { value: exp.cargo, name: 'cargo', modelo: 'ExperienciaLaboral' },
          'FECHA INICIO': { value: exp.fecha_inicio, type: 'date', name: 'fecha_inicio', modelo: 'ExperienciaLaboral' },
          'FECHA FIN': { value: exp.fecha_fin, type: 'date', name: 'fecha_fin', modelo: 'ExperienciaLaboral' }
        }))
      },
      CURSOS: {
        value: emp.Cursos.map(curso => ({
          ID: { value: curso.id_cur, type: 'number', name: 'id_cur', blockEdit: true },
          NOMBRE: { value: curso.nom_cur, name: 'nom_cur', modelo: 'Cursos' },
          INSTITUCION: { value: curso.institucion, name: 'institucion', modelo: 'Cursos' }
        }))
      }
    }))

    if (download === 'Excel') {
      return await createSendExcel(infoFormater, res)
    }
    res.status(200).json(infoFormater)
  } catch (err) {
    console.log(err)
    res.status(400).json({ errors: [{ msg: 'Error al traer los datos' }] })
  }
}

const deleteAll = async (req, res) => {
  let { id, modelo } = req.params
  const campo = pks[modelo]
  if (modelo !== 'Empleado') {
    id = parseInt(id)
  }
  const where = {}
  where[campo] = id

  if (modelo === 'CargoEmpleado') {
    const cargoEmpleado = await prisma.cargoEmpleado.findFirst({
      where
    })
    await prisma.cargoEmpleado.delete({
      where: {
        id_cargo_emp_ci_em_id_cargo_fecha_inicio: {
          id_cargo_emp: id,
          ci_em: cargoEmpleado.ci_em,
          fecha_inicio: cargoEmpleado.fecha_inicio,
          id_cargo: cargoEmpleado.id_cargo
        }
      }
    })
  } else {
    await prisma[modelo].delete({
      where
    })
  }

  res.status(200).json({ msg: 'Registro eliminado' })
}

const ingresarAllEmpleado = async (req, res) => {
  const { ci_em, modelo } = req.params
  const empleado = await prisma.empleado.findUnique({
    where: {
      ci_em
    }
  })
  if (!empleado) return res.status(404).json({ errors: [{ msg: 'Empleado no encontrado' }] })

  if (modelo === 'Vacaciones') {
    const diasDisponibles = +req.body.ini_vac_period.match(/^\d{1,2}/)[0]
    const year = req.body.ini_vac_period.match(/\d{4}/)[0]
    if (diasDisponibles < req.body.dias) {
      req.body.dias = diasDisponibles
    }
    req.body.ini_vac_period = empleado.fecha_ing_em.replace(/^\d{4}/, year)
  }

  await prisma[modelo].create({
    data: {
      ...req.body,
      ci_em
    }
  })
  return res.status(201).json({ msg: 'Ingresado correctamente' })
}

const getVacacionesEmpleado = async (req, res) => {
  const empleados = await prisma.empleado.findMany({
    where: { CargoEmpleado: { some: { estado_cargo: true } } },
    include: {
      Vacaciones: true
    },
    orderBy: { apel_em: 'asc' }
  })
  const infoFormater = {
    values: empleados.map(emp => ({
      CEDULA: { value: emp.ci_em, name: 'ci_em', maxlength: '10', minlength: '10', modelo: 'Empleado' },
      APELLIDO: { value: emp.apel_em, name: 'apel_em', maxlength: '30', modelo: 'Empleado' },
      NOMBRES: { value: emp.nom_em, name: 'nom_em', maxlength: '30', modelo: 'Empleado' },
      VACACIONES: {
        value: emp.Vacaciones.map(vac => ({
          ID: { value: vac.id_vac, blockEdit: true },
          'FECHA INICIO': { value: vac.ini_vac, type: 'date', name: 'ini_vac', modelo: 'Vacaciones' },
          'FECHA FIN': { value: vac.fin_vac, type: 'date', name: 'fin_vac', modelo: 'Vacaciones' },
          'PERIODO VACACIONES TOMADAS': {
            value: `${moment(vac.ini_vac_period).format('YYYY')} - ${moment(vac.ini_vac_period).add(1, 'years').format('YYYY')}`,
            type: 'date',
            name: 'ini_vac_period',
            modelo: 'Vacaciones',
            blockEdit: true
          },
          DIAS: { value: vac.dias, type: 'number', name: 'dias', modelo: 'Vacaciones' }
        }))
      }
    }))
  }
  res.status(200).json(infoFormater)
}

const getCargosEmpleados = async (req, res) => {
  const empleados = await prisma.empleado.findMany({
    include: {
      CargoEmpleado: {
        include: {
          Cargos: true
        }
      },
      LlamadosAtencion: true
    },
    orderBy: { apel_em: 'asc' }
  })
  const infoFormater = {
    values: empleados.map(emp => ({
      CEDULA: { value: emp.ci_em, name: 'ci_em', maxlength: '10', minlength: '10', modelo: 'Empleado' },
      APELLIDO: { value: emp.apel_em, name: 'apel_em', maxlength: '30', modelo: 'Empleado' },
      NOMBRES: { value: emp.nom_em, name: 'nom_em', maxlength: '30', modelo: 'Empleado' },
      CARGO: {
        value: emp.CargoEmpleado.map(caremp => ({
          ID: { value: caremp.id_cargo_emp, blockEdit: true },
          CARGO: { value: caremp.Cargos.nom_cargo, name: 'nom_cargo' },
          'FECHA DE INICIO': { value: caremp.fecha_inicio, type: 'date', name: 'fecha_inicio', modelo: 'CargoEmpleado' },
          'FECHA FIN': { value: caremp.fecha_fin, type: 'date', name: 'fecha_fin', modelo: 'CargoEmpleado' },
          SUELDO: { value: +decrypt(caremp.sueldo), type: 'number', name: 'sueldo', modelo: 'CargoEmpleado' },
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
      'LLLAMADOS DE ATENCION': {
        value: emp.LlamadosAtencion.map(llam => ({
          ID: { value: llam.id_atem, blockEdit: true },
          'FECHA DEL LLAMADO': { value: llam.fecha_aten, type: 'date', name: 'fecha_atem', modelo: 'LlamadosAtencion' },
          'MOTIVO DEL LLAMADO': { value: llam.des_aten, name: 'des_aten', modelo: 'LlamadosAtencion' },
          'TIPO DE LLAMADO': { value: llam.tipo_aten, name: 'tipo_aten', modelo: 'LlamadosAtencion' }
        }))
      }
    }))
  }
  res.status(200).json(infoFormater)
}

const getAreas = async (req, res) => {
  const areas = await prisma.area.findMany()
  res.status(200).json(areas)
}

const createAreas = async (req, res) => {
  const { nom_area } = req.body

  if (Object.values(req.body).includes('')) return res.status(400).json({ errors: [{ msg: 'Faltan datos' }] })
  const areaExistente = await prisma.area.findFirst({
    where: { nom_area }
  })
  if (areaExistente) return res.status(400).json({ errors: [{ msg: 'La area ya está registrada' }] })

  const area = await prisma.area.create({ data: req.body })

  res.status(201).json({ msg: 'Area creada', area })
}

const createCargos = async (req, res) => {
  const { nom_cargo, nom_area, descripcion } = req.body

  if (Object.values(req.body).includes('')) return res.status(400).json({ errors: [{ msg: 'Faltan datos' }] })
  const areaExistente = await prisma.area.findFirst({
    where: { nom_area }
  })
  if (!areaExistente) return res.status(400).json({ errors: [{ msg: 'El area no está registrada' }] })
  const cargoExistente = await prisma.cargos.findFirst({
    where: { nom_cargo }
  })
  if (cargoExistente) return res.status(400).json({ errors: [{ msg: 'El cargo ya está registrado' }] })

  await prisma.cargos.create({
    data: {
      nom_cargo,
      descripcion,
      id_area: areaExistente.id_area
    }
  })

  res.status(201).json({ msg: 'Crago creado' })
}

const getCargos = async (req, res) => {
  const cargos = await prisma.cargos.findMany()
  res.status(200).json(cargos)
}

const createCargoEmpleado = async (req, res) => {
  try {
    const { ci_em } = req.params
    const { nom_cargo, fecha_inicio } = req.body
    req.body.sueldo = encrypt(req.body.sueldo)
    req.body.tipo_contrato = encrypt(req.body.tipo_contrato)
    const data = ({ ...req.body, ci_em })
    delete data.nom_cargo

    if (Object.values(req.body).includes('')) return res.status(400).json({ errors: [{ msg: 'Faltan datos' }] })
    const cargo = await prisma.cargos.findFirst({
      where: { nom_cargo }
    })
    if (!cargo) return res.status(400).json({ errors: [{ msg: 'El cargo no está registrado' }] })
    const verifyPk = await prisma.cargoEmpleado.findFirst({
      where: {
        ci_em,
        id_cargo: cargo.id_cargo,
        fecha_inicio
      }
    })
    if (verifyPk) return res.status(400).json({ errors: [{ msg: 'El registro ya existe' }] })

    const ultimoCargo = await prisma.cargoEmpleado.findFirst({
      where: { ci_em, estado_cargo: true },
      orderBy: { fecha_inicio: 'desc' }
    })
    if (ultimoCargo) {
      if (new Date(ultimoCargo.fecha_inicio) > new Date(fecha_inicio)) {
        return res.status(400).json({ errors: [{ msg: 'La fecha de inicio debe ser mayor a la del ultimo cargo' }] })
      }
      await prisma.cargoEmpleado.update({
        where: {
          ci_em_id_cargo_fecha_inicio: {
            ci_em,
            id_cargo: ultimoCargo.id_cargo,
            fecha_inicio: ultimoCargo.fecha_inicio
          }
        },
        data: {
          fecha_fin: fecha_inicio,
          estado_cargo: false
        }
      })
    }
    await prisma.cargoEmpleado.create({
      data: {
        ...data,
        id_cargo: cargo.id_cargo
      }
    })
    const empleado = await prisma.empleado.findUnique({
      where: {
        ci_em
      }
    })
    res.status(200).json({ msg: `Cargo asignado al empleado ${empleado.apel_em}` })
  } catch (err) {
    console.log(err)
    res.status(500).json({ errors: [{ msg: 'Error al asignar cargo' }] })
  }
}

const updateOne = async (req, res) => {
  try {
    const { modelo, name, id, ...data } = req.body
    if (data.monto !== undefined) data.monto = encrypt(data.monto)
    if (data.sueldo !== undefined) data.sueldo = encrypt(data.sueldo)
    if (data.tipo_contrato !== undefined) data.tipo_contrato = encrypt(data.tipo_contrato)
    await prisma[modelo].update({
      where: {
        [pks[modelo]]: id
      },
      data
    })

    res.status(200).json({ msg: 'Campo actualizado correctamente' })
  } catch (err) {
    console.log(err)
    res.status(500).json({ errors: [{ msg: 'Error al actualizar' }] })
  }
}

const diasVacacionesById = async (req, res) => {
  try {
    const { ci_em } = req.params
    const fechaActual = new Date()

    if (!ci_em) return

    const empleado = await prisma.empleado.findUnique({
      where: { ci_em },
      select: {
        fecha_ing_em: true,
        Vacaciones: {
          select: {
            ini_vac_period: true,
            fin_vac_period: true,
            dias: true
          }
        }
      }
    })

    if (!empleado) return res.status(404).json({ errors: [{ msg: 'Empleado no encontrado' }] })
    const { periodos } = generatePeriods(empleado.fecha_ing_em, fechaActual)
    const montoPorPeriodo = amountByPeriod(periodos, fechaActual, empleado.fecha_ing_em, empleado.Vacaciones)
    montoPorPeriodo.forEach(periodo => {
      delete periodo.monto
      delete periodo.diasUsados
      delete periodo.valorUsados
      delete periodo.valorAcumulados
      periodo.periodo = `${moment(periodo.inicio).format('YYYY')} - ${moment(periodo.fin).format('YYYY')}`
    })

    const diasDisponibles = montoPorPeriodo.filter(periodo => periodo.diasAcumulados > 0)

    res.status(200).json(diasDisponibles)
  } catch (err) {
    console.log(err)
    res.status(500).json({ errors: [{ msg: 'Error al obtener los datos' }] })
  }
}

export {
  ingresarEmpleado,
  getAllEmpleados,
  deleteAll,
  ingresarAllEmpleado,
  getVacacionesEmpleado,
  getCargosEmpleados,
  getAreas,
  createAreas,
  createCargos,
  getCargos,
  createCargoEmpleado,
  updateOne,
  diasVacacionesById
}
