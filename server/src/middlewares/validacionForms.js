import { check, validationResult } from 'express-validator'

const validaciones = {
  nom_area: check('nom_area').isLength({ min: 3, max: 50 }).withMessage('El campo "nombre de area" debe tener entre 3 y 50 caracteres').customSanitizer(value => value?.trim()),
  descripcion: check('descripcion').isLength({ min: 3, max: 100 }).withMessage('El campo "descripción" debe tener entre 3 y 100 caracteres').customSanitizer(value => value?.trim()),
  nom_cargo: check('nom_cargo').isLength({ min: 3, max: 50 }).withMessage('El campo "nombre de cargo" debe tener entre 3 y 50 caracteres').customSanitizer(value => value?.trim()),
  fecha_inicio: check('fecha_inicio').isLength({ min: 3, max: 11 }).withMessage('El campo "fecha de inicio" debe tener entre 3 y 11 caracteres').customSanitizer(value => value?.trim()),
  fecha_fin: check('fecha_fin').isLength({ min: 3, max: 11 }).withMessage('El campo "fecha de fin" debe tener entre 3 y 11 caracteres').customSanitizer(value => value?.trim()),
  sueldo: check('sueldo').isLength({ max: 6 }).withMessage('El campo "sueldo" debe tener entre 3 y 6 dígitos').isNumeric().withMessage('El campo "sueldo" debe contener solo números'),
  ci_em: check('ci_em').isLength({ min: 10, max: 10 }).withMessage('El campo "cedula" debe tener 10 dígitos').isNumeric().withMessage('El campo "cedula" debe contener solo números').customSanitizer(value => value?.trim()),
  nom_em: check('nom_em').isLength({ min: 3, max: 30 }).withMessage('El campo "nombre" debe tener entre 3 y 30 caracteres').customSanitizer(value => value?.trim()),
  apel_em: check('apel_em').isLength({ min: 3, max: 30 }).withMessage('El campo "apellido" debe tener entre 3 y 30 caracteres').customSanitizer(value => value?.trim()),
  fecha_nace_em: check('fecha_nace_em').isLength({ min: 3, max: 11 }).withMessage('El campo "fecha de nacimiento" debe tener entre 3 y 11 caracteres').customSanitizer(value => value?.trim()),
  dir_domicilio_em: check('dir_domicilio_em').isLength({ min: 3, max: 80 }).withMessage('El campo "direccion" debe tener entre 3 y 80 caracteres').customSanitizer(value => value?.trim()),
  correo_em: check('correo_em').isLength({ min: 3, max: 50 }).withMessage('El campo "email" debe tener entre 3 y 50 caracteres').isEmail().withMessage('El campo "email" no es correcto').customSanitizer(value => value?.trim()),
  celular_em: check('celular_em').isLength({ min: 10, max: 10 }).withMessage('El campo "celular" debe tener 10 dígitos').isNumeric().withMessage('El campo "celular" debe contener solo números').customSanitizer(value => value?.trim()),
  telefono_em: check('telefono_em').isLength({ max: 10 }).withMessage('El campo "telefono" debe tener 10 dígitos').isNumeric().withMessage('El campo "telefono" debe contener solo números').customSanitizer(value => value?.trim()),
  est_civil_em: check('est_civil_em').isLength({ min: 3, max: 10 }).withMessage('El campo "estado civil" debe tener entre 3 y 10 caracteres').customSanitizer(value => value?.trim()),
  genero: check('genero').isLength({ min: 3, max: 10 }).withMessage('El campo "genero" debe tener entre 3 y 10 caracteres').customSanitizer(value => value?.trim()),
  cuenta_em: check('cuenta_em').isLength({ min: 4, max: 5 }).withMessage('El campo "cuenta" debe tener entre 4 y 5 dígitos').isNumeric().withMessage('El campo "cuenta" debe contener solo números').customSanitizer(value => value?.trim()),
  fecha_ing_em: check('fecha_ing_em').isLength({ min: 3, max: 11 }).withMessage('El campo "fecha de ingreso" debe tener entre 3 y 11 caracteres').customSanitizer(value => value?.trim()),
  nom_carga: check('nom_carga').isLength({ min: 3, max: 30 }).withMessage('El campo "nombres" debe tener entre 3 y 30 caracteres').customSanitizer(value => value?.trim()),
  apel_cargo: check('apel_cargo').isLength({ min: 3, max: 30 }).withMessage('El campo "apellidos" debe tener entre 3 y 30 caracteres').customSanitizer(value => value?.trim()),
  parentesco: check('parentesco').isLength({ min: 3, max: 30 }).withMessage('El campo "parentesco" debe tener entre 3 y 30 caracteres').customSanitizer(value => value?.trim()),
  fecha_nace: check('fecha_nace').isLength({ min: 3, max: 11 }).withMessage('El campo "fecha de nacimiento" debe tener entre 3 y 11 caracteres').customSanitizer(value => value?.trim()),
  titulo: check('titulo').isLength({ min: 3, max: 50 }).withMessage('El campo "titulo" debe tener entre 3 y 50 caracteres').customSanitizer(value => value?.trim()),
  institucion: check('institucion').isLength({ min: 3, max: 80 }).withMessage('El campo "institución" debe tener entre 3 y 80 caracteres').customSanitizer(value => value?.trim()),
  empresa: check('empresa').isLength({ min: 3, max: 50 }).withMessage('El campo "empresa" debe tener entre 3 y 50 caracteres').customSanitizer(value => value?.trim()),
  cargo: check('cargo').isLength({ min: 3, max: 50 }).withMessage('El campo "nombre de cargo" debe tener entre 3 y 50 caracteres').customSanitizer(value => value?.trim()),
  nom_cur: check('nom_cur').isLength({ min: 3, max: 50 }).withMessage('El campo "nombre del curso" debe tener entre 3 y 50 caracteres').customSanitizer(value => value?.trim()),
  ini_vac: check('ini_vac').isLength({ min: 3, max: 11 }).withMessage('El campo "inicio de vacaciones" debe tener entre 3 y 11 caracteres').customSanitizer(value => value?.trim()),
  fin_vac: check('fin_vac').isLength({ min: 3, max: 11 }).withMessage('El campo "fin de vacaciones" debe tener entre 3 y 11 caracteres').customSanitizer(value => value?.trim()),
  dias: check('dias').isNumeric().withMessage('El campo "dias" debe contener solo numeros'),
  tipo_contrato: check('tipo_contrato').isLength({ min: 3, max: 20 }).withMessage('El campo "tipo de contrato" debe tener entre 3 y 20 caracteres').customSanitizer(value => value?.trim()),
  jornada: check('jornada').isLength({ min: 3, max: 10 }).withMessage('El campo "jornada" debe tener entre 3 y 10 caracteres').customSanitizer(value => value?.trim()),
  estado_cargo: check('estado_cargo').isBoolean().withMessage('El campo "estado" solo puede ser activo o inactivo').custom(value => value === true || value === false).withMessage('El campo "jornada" solo puede ser activo o inactivo'),
  mes_tercero: check('mes_tercero').isBoolean().withMessage('El campo "mes tercero" solo puede ser activo o inactivo').custom(value => value === true || value === false).withMessage('El campo "jornada" solo puede ser activo o inactivo'),
  mes_cuarto: check('mes_cuarto').isBoolean().withMessage('El campo "mes cuarto" solo puede ser activo o inactivo').custom(value => value === true || value === false).withMessage('El campo "jornada" solo puede ser activo o inactivo'),
  mes_fondo: check('mes_fondo').isBoolean().withMessage('El campo "mes fondo" solo puede ser activo o inactivo').custom(value => value === true || value === false).withMessage('El campo "jornada" solo puede ser activo o inactivo'),
  fecha_atem: check('fecha_aten').isLength({ min: 3, max: 11 }).withMessage('El campo "fecha del llamado" debe tener entre 3 y 11 caracteres').customSanitizer(value => value?.trim()),
  des_aten: check('des_aten').isLength({ min: 3, max: 150 }).withMessage('El campo "motivo del llamado" debe tener entre 3 y 150 caracteres').customSanitizer(value => value?.trim()),
  tipo_aten: check('tipo_aten').isLength({ min: 3, max: 20 }).withMessage('El campo "tipo de llamado" debe tener entre 3 y 20 caracteres').customSanitizer(value => value?.trim())
}

const validacionForm = (req, res, next) => {
  console.log(req.body)
  const validacionesActivas = Object.keys(req.body)
    .filter(campo => validaciones[campo])
    .map(campoValido => validaciones[campoValido])
  Promise.all(validacionesActivas.map(validation => validation.run(req)))
    .then(() => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }
      next()
    })
    .catch(next)
}

export {
  validacionForm
}
