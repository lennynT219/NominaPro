import { SelectBox } from '@components'
import { InputGeneral } from '../InputGeneral/InputGeneral'

const HoverDescarga = (handleSelect) => {
  // <SelectBox
  //   handleSelect={() => { }}
  //   plh='Formato'
  //   opciones={['PDF', 'Exel', 'Texto']}
  //   nameLocalStorage='HoverDescarga'
  // />
  return (
    <select defaultValue='' onChange={handleSelect}>
      <option value='' disabled>Formato</option>
      <option value='Excel'>Excel</option>
      <option value='PDF'>PDF</option>
      <option value='Texto'>Texto</option>
    </select>
  )
}

const HoverNuevo = (handleSelect) => (
  <SelectBox
    handleSelect={handleSelect}
    plh='Ingresar'
    opciones={['Empleado', 'Carga Familiar', 'Formacion Academica', 'Experiencia Laboral', 'Curso']}
    nameLocalStorage='HoverNuevo'
  />
)

const HoverFiltro = (handleSelectFecha, handleSelectRol, anio) => (
  <>
    <SelectBox
      handleSelect={handleSelectFecha}
      plh='Mes'
      opciones={['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']}
      nameLocalStorage='mes'
    />
    <SelectBox
      handleSelect={handleSelectFecha}
      plh='Año'
      opciones={anio}
      nameLocalStorage='anio'
    />
    <SelectBox
      handleSelect={handleSelectRol}
      plh='Tipo de rol'
      opciones={['General', 'Primera Quincena', 'Segunda Quincena']}
      nameLocalStorage='selectRol'
    />
  </>
)

const HoverNuevoEmp = (handleSelect) => (
  <SelectBox
    handleSelect={handleSelect}
    plh='Ingresar'
    opciones={['Detalle de Cargo', 'Nuevo Cargo', 'Nueva Area', 'Llamado de Atencion']}
    nameLocalStorage='HoverNuevoEmp'
  />
)

const HoverFiltroVac = (handleSelectFecha) => (
  <>
    <div className='filterVac'>
      <p>Desde</p>
      <InputGeneral
        label='Desde'
        name='fechaDesde'
        type='date'
        inheight='35px'
        plhSize='13px'
        iconColor='#0C5795'
        iconSize='20px'
        createJson={handleSelectFecha}
        filtro
      />
    </div>
    <div className='filterVac'>
      <p>Hasta</p>
      <InputGeneral
        name='fechaHasta'
        type='date'
        inheight='35px'
        plhSize='13px'
        iconColor='#0C5795'
        iconSize='20px'
        createJson={handleSelectFecha}
        filtro
      />
    </div>
  </>
)

export {
  HoverDescarga,
  HoverNuevo,
  HoverFiltro,
  HoverNuevoEmp,
  HoverFiltroVac
}
