const newEmpelado = {
  label: 'Ingresar los datos',
  values: [
    {
      detalle: 'Cedula',
      name: 'ci_em',
      type: 'number',
      numberToString: true
    },
    {
      detalle: 'Nombres',
      name: 'nom_em'
    },
    {
      detalle: 'Apellidos',
      name: 'apel_em'
    },
    {
      detalle: 'Fecha de nacimiento',
      name: 'fecha_nace_em',
      type: 'date'
    },
    {
      detalle: 'Direcion Domicilio',
      name: 'dir_domicilio_em'
    },
    {
      detalle: 'Correo',
      name: 'correo_em',
      type: 'email'
    },
    {
      detalle: 'Celular',
      name: 'celular_em',
      type: 'number',
      numberToString: true
    },
    {
      detalle: 'Telefono',
      name: 'telefono_em',
      type: 'number',
      numberToString: true
    },
    {
      detalle: 'Estado Civil',
      name: 'est_civil_em',
      opciones: ['Casado', 'Soltero', 'Divorciado', 'Viudo', 'Otro']
    },
    {
      detalle: 'Genero',
      name: 'genero_em',
      opciones: ['Masculino', 'Femenino']
    },
    {
      detalle: 'Cuenta de empresa',
      name: 'cuenta_em',
      type: 'number',
      numberToString: true
    },
    {
      detalle: 'Fecha Ingreso',
      name: 'fecha_ing_em',
      type: 'date'
    }
  ]
}

const newCarga = {
  label: 'Datos Carga Familiar',
  values: [
    {
      detalle: 'Nombres',
      name: 'nom_carga'
    },
    {
      detalle: 'Apellidos',
      name: 'apel_cargo'
    },
    {
      detalle: 'Parentesco',
      name: 'parentesco',
      opciones: ['Hijo', 'Hija', 'Esposo/a']
    },
    {
      detalle: 'Fecha de nacimiento',
      name: 'fecha_nace',
      type: 'date'
    }
  ]
}

const newFacademica = {
  label: 'Datos Formacion Academica',
  values: [
    {
      detalle: 'Titulo',
      name: 'titulo'
    },
    {
      detalle: 'Institucion',
      name: 'institucion'
    }
  ]
}

const newElaboral = {
  label: 'Datos Experiencia Laboral',
  values: [
    {
      detalle: 'Empresa',
      name: 'empresa'
    },
    {
      detalle: 'Cargo',
      name: 'cargo'
    },
    {
      detalle: 'Fecha de inicio',
      name: 'fecha_inicio',
      type: 'date'
    },
    {
      detalle: 'Fecha de fin',
      name: 'fecha_fin',
      type: 'date'
    }
  ]
}

const newCurso = {
  label: 'Datos Curso',
  values: [
    {
      detalle: 'Nombre del curso',
      name: 'nom_cur'
    },
    {
      detalle: 'Institucion',
      name: 'institucion'
    }
  ]
}

const newVacation = dias => {
  return {
    label: 'Detalle de vacaciones',
    values: [
      {
        detalle: 'Inicio de vacaciones',
        name: 'ini_vac',
        type: 'date'
      },
      {
        detalle: 'Fin de vacaciones',
        name: 'fin_vac',
        type: 'date'
      },
      {
        detalle: 'Dias disponibles',
        name: 'ini_vac_period',
        opciones: dias.map(dia => `${dia?.diasAcumulados} | ${dia?.periodo}`)
      },
      {
        detalle: 'Dias de vacaciones',
        name: 'dias',
        type: 'number'
      }
    ]
  }
}

const newDetCargo = (cargo) => {
  return {
    label: 'Detalle de Cargo',
    values: [
      {
        detalle: 'Cargo',
        name: 'nom_cargo',
        opciones: cargo.map(cargo => cargo.nom_cargo)
      },
      {
        detalle: 'Inicio en cargo',
        name: 'fecha_inicio',
        type: 'date'
      },
      {
        detalle: 'Tipo de Contrato',
        name: 'tipo_contrato',
        opciones: ['Periodo a prueba', 'Indefinido']
      },
      {
        detalle: 'Sueldo',
        name: 'sueldo',
        type: 'number'
      },
      {
        detalle: 'Jornada',
        name: 'jornada',
        opciones: ['Matutina', 'Vespertina']
      }
    ]
  }
}

const newCargo = (area) => {
  return {
    label: 'Nuevo Cargo',
    values: [
      {
        detalle: 'Area',
        name: 'nom_area',
        opciones: area.map(area => area.nom_area)
      },
      {
        detalle: 'Nombre de cargo',
        name: 'nom_cargo'
      },
      {
        detalle: 'Descripción',
        name: 'descripcion'
      }
    ]
  }
}

const newArea = {
  label: 'Nueva Area',
  values: [
    {
      detalle: 'Nombre de Area',
      name: 'nom_area'
    },
    {
      detalle: 'Descripción',
      name: 'descripcion'
    }
  ]
}

const newRol = {
  label: 'Detalle de Rol',
  values: [
    {
      detalle: 'Mes',
      name: 'mes',
      opciones: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
    },
    {
      detalle: 'Año',
      name: 'anio',
      type: 'number'
    }
  ]
}

const newLlamado = {
  label: 'Nuevo Llamado de Atencion',
  values: [
    {
      detalle: 'Fecha del llamado',
      name: 'fecha_aten',
      type: 'date'
    },
    {
      detalle: 'Tipo de llamado',
      name: 'tipo_aten',
      opciones: ['Verbal', 'Escrito']
    },
    {
      detalle: 'Motivo del llamado',
      name: 'des_aten',
      type: 'text'
    }
  ]
}

const newUser = {
  label: 'Nuevo Usuario',
  values: [
    {
      detalle: 'Username',
      name: 'username'
    },
    {
      detalle: 'Contraseña',
      name: 'password',
      type: 'password'
    }
  ]
}

export {
  newEmpelado,
  newCarga,
  newFacademica,
  newElaboral,
  newCurso,
  newVacation,
  newDetCargo,
  newCargo,
  newArea,
  newRol,
  newLlamado,
  newUser
}
