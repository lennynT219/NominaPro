/* eslint-disable camelcase */
import { InputGeneral } from '../InputGeneral/InputGeneral'
import { HoverButton } from '../HoverBoton/HoverBoton'
import { ButtonIcon } from '../ButtonIcon/ButtonIcon'
import { DoubleClickTd } from '@assets/context/DoubleClickTd'
import { icons } from '@assets/icon/icons'
import { useCallback, useContext, useState, useEffect } from 'react'
import { Icon } from '@iconify/react-with-api'
import { useResize } from '@assets/hook/useResize'
import { useDelete } from '@assets/hook/useData'
import { url_deleteAll } from '@assets/api/empleado.routes'
import { toast } from 'sonner'

export function CabReport ({
  filtro,
  descargas,
  nuevoPersonal,
  nuevoEmpresa,
  showCreateButton,
  showdDownloadButton,
  showNewCargoButton,
  showCreateUserButton,
  showDeleteBoton,
  showCreateVacButton,
  showCreateRolButton,
  handleClickCreateVac,
  handleClikCreateRol,
  handleEdit,
  displayData,
  setShowData,
  modelo,
  activeUser,
  user
}) {
  const [activarPeticion, setActivarPeticion] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const { response, error } = useDelete(
    url_deleteAll(showDeleteBoton.id, modelo),
    activarPeticion,
    setActivarPeticion
  )
  const { doubleClick, setDoubleClick } = useContext(DoubleClickTd)
  const { width } = useResize()
  const toggleDoubleClick = useCallback(() => setDoubleClick(false), [setDoubleClick])

  useEffect(() => {
    if (error?.message === 'Network Error') {
      toast.error('Selecione un empleado')
    }
  }, [error])
  useEffect(() => {
    response && toast.success(response?.msg)
  }, [response])
  const handleSearch = (name, value) => {
    if (value === '') return setShowData([])
    if (Array.isArray(displayData)) {
      setBusqueda(value)
      const newData = displayData.filter(employe =>
        Object.keys(employe).some(key =>
          String(employe[key].value).toLowerCase().includes(value.toLowerCase())
        )
      )
      setShowData(newData)
    }
  }
  const handleDelete = () => {
    setActivarPeticion(true)
  }

  return (
    <div className='cabecera'>
      <section>
        {doubleClick && (
          <ButtonIcon icon={icons.IAtras} height='21px' width='21px' onClick={toggleDoubleClick} />
        )}
        <InputGeneral
          icon={icons.ILupa}
          type='search'
          inheight='35px'
          plh='Buscar...'
          plhSize='14px'
          iconColor='#0C5795'
          iconSize='25px'
          value={busqueda}
          name='busqueda'
          createJson={handleSearch}
        />
        <HoverButton label={<Icon icon={icons.IFiltro} height='25px' width='23px' />}>
          {filtro}
        </HoverButton>
      </section>
      <div className='contenedor-botones'>
        {showDeleteBoton.show && user && (
          <ButtonIcon
            icon={icons.IEditar}
            height='21px'
            width='21px'
            onClick={handleEdit}
          >
            {width < 920 ? '' : 'Editar'}
          </ButtonIcon>)}

        {showDeleteBoton.show && (
          <ButtonIcon
            icon={icons.IEliminar}
            height='21px'
            width='21px'
            onClick={handleDelete}
          >
            {width < 920 ? '' : 'Eliminar'}
          </ButtonIcon>)}
        {showCreateButton && (
          <HoverButton
            label={
              <>
                <Icon icon={icons.ICrear} height='25px' width='21px' />
                {width < 920 ? '' : 'Nuevo'}
              </>
            }
          >
            {nuevoPersonal}
          </HoverButton>
        )}
        {showCreateVacButton && (
          <ButtonIcon icon={icons.ICrear} height='21px' width='21px' onClick={handleClickCreateVac}>
            {width < 920 ? '' : 'Nueva Vacación'}
          </ButtonIcon>
        )}
        {showCreateUserButton && (
          <ButtonIcon icon={icons.ICrear} height='21px' width='21px' onClick={handleClickCreateVac}>
            {width < 920 ? '' : activeUser ? 'Cancelar' : 'Nuevo Usuario'}
          </ButtonIcon>
        )}
        {showNewCargoButton && (
          <HoverButton
            label={
              <>
                <Icon icon={icons.ICrear} height='25px' width='23px' />
                {width < 920 ? '' : 'Nuevo'}
              </>
            }
          >
            {nuevoEmpresa}
          </HoverButton>
        )}
        {showCreateRolButton && (
          <ButtonIcon icon={icons.INewRol} height='21px' width='21px' onClick={handleClikCreateRol}>
            {width < 920 ? '' : 'Nuevo Rol'}
          </ButtonIcon>
        )}
        {showdDownloadButton && (
          <HoverButton
            label={
              <>
                <Icon icon={icons.IDescarga} height='25px' width='23px' />
                {width < 920 ? '' : 'Descargar'}
              </>
            }
          >
            {descargas}
          </HoverButton>)}
      </div>
    </div>
  )
}
