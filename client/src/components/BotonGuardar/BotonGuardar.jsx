/* eslint-disable camelcase */
import { Icon } from '@iconify/react-with-api'
import { icons } from '@assets/icon/icons'
import { usePut } from '@assets/hook/useData'
import { url_updateEmpleados } from '@assets/api/empleado.routes'
import { useState } from 'react'

export function BotonFooter ({ disabled, showCerrarBoton, updateData, form, setDisable }) {
  const [activarPeticion, setActivarPeticion] = useState(false)
  const { response } = usePut(url_updateEmpleados, updateData, activarPeticion, setActivarPeticion)
  const handleUpdateData = () => {
    setActivarPeticion(true)
    setDisable(true)
  }
  return (
    <div className='boton-guardar'>
      <button
        className='boton-general'
        type='submit'
        disabled={disabled}
        onClick={!form ? handleUpdateData : undefined}
      >
        <Icon icon={icons.IGuardar} height='20px' width='20px' />
        Guardar
      </button>
      {showCerrarBoton && (
        <button className='boton-general' type='button'>
          <Icon icon={icons.ICerrar} height='20px' width='20px' />
          Cerrar
        </button>
      )}
    </div>
  )
}
