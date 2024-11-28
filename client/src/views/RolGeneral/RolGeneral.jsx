/* eslint-disable camelcase */
import { CabReport, Tabla, Modal, FormModul } from '@components'
import { HoverDescarga, HoverFiltro } from '@components/HoverBoton/hover'
import { DoubleClickTd } from '@assets/context/DoubleClickTd'
import { newRol } from '@components/FormModul/forms'
import { url_getAllRoles, url_createAllEmpeladosRoles, url_getAnioRoles } from '@assets/api/empleado.routes'
import { useGet } from '@assets/hook/useData'
import { useContext, useEffect, useState } from 'react'
import './RolGeneral.css'

const headers = {
  'Primera Quincena': [
    'CEDULA', 'NOMBRES', 'APELLIDOS', 'FECHA INGRESO', 'CARGO', 'DIAS TRABAJADOS', 'SUELDO', 'SUELDO NOMINAL', 'ANTICIPO QUINCENA'
  ],
  'Segunda Quincena': [
    'CEDULA', 'NOMBRES', 'APELLIDOS', 'FECHA INGRESO', 'CARGO', 'DIAS TRABAJADOS', 'SUELDO', 'SUELDO NOMINAL', 'HORAS EXTRAS', 'RECONOCIMIENTO', 'REMUNERACION VARIABLE', 'ALIMENTACIÓN', 'SUBTOTAL', '13° SUELDO', '14° SUELDO', 'FONDOS DE RESERVA', 'TOTAL INGRESOS', 'ANTICIPO QUINCENA', 'INDIVIDUAL IESS', 'ANTICIPO A SUELDO', 'CUENTAS POR COBRAR', 'EXTENSION IESS', 'HIPOTECARIO', 'QUIROGRAFARIO', 'SEGURO MEDICO', 'TOTAL DESCUENTOS', '2° QUINCENA', 'CUENTA ACREEDORA'
  ]
}

export function RolGeneral () {
  const [key, setKey] = useState(headers[window.localStorage.getItem('selectRol')] || '')
  const [url, setUrl] = useState(url_getAllRoles(window.localStorage.getItem('selectRol') === 'Segunda Quincena' ? '2' : '1'))
  const [fecha, setFecha] = useState({
    mes: window.localStorage.getItem('mes') || '',
    anio: window.localStorage.getItem('anio') || ''
  })
  const [showDeleteBoton, setShowDeleteButton] = useState({ id: '', show: false })
  const [moreInformation, setMoreInformation] = useState()
  const { response, error } = useGet(url, fecha)
  const { response: anios } = useGet(url_getAnioRoles)
  const [showData, setShowData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [valores, setValores] = useState({})
  const { doubleClick } = useContext(DoubleClickTd)
  useEffect(() => {
    setShowData(Array.isArray(response) === false ? [] : response)
  }, [response])
  const displayData = moreInformation && doubleClick ? moreInformation.value : showData

  const handleSelectFiltro = (value) => {
    setKey(headers[value] || '')
    if (value === 'Segunda Quincena') {
      setUrl(url_getAllRoles('2'))
    } else {
      setUrl(url_getAllRoles('1'))
    }
  }
  const handleSelectFecha = (value, plh, name) => {
    setFecha(prev => ({
      ...prev,
      [name]: value
    }))
  }
  return (
    <>
      <CabReport
        showDeleteBoton={showDeleteBoton}
        filtro={HoverFiltro(handleSelectFecha, handleSelectFiltro, anios)}
        showdDownloadButton
        descargas={HoverDescarga}
        setShowData={setShowData}
        displayData={displayData}
        showCreateRolButton
        handleClikCreateRol={() => setIsModalOpen(true)}
      />
      {Array.isArray(response) && response.length > 0 && (
        <>
          <Tabla
            data={displayData}
            headers={key}
            moreInformation={setMoreInformation}
            setShowDeleteButton={setShowDeleteButton}
            recoveryId={showDeleteBoton}
            tfoot
          />
        </>)}
      {error && <h1 className='errorMesange'>{error.response.data.msg}</h1>}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false) }}>
        <FormModul
          data={newRol}
          url={url_createAllEmpeladosRoles}
          valores={valores}
          setValores={setValores}
        />
      </Modal>
    </>
  )
}
