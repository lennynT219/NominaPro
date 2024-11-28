/* eslint-disable camelcase */
import { CabReport, Tabla, BotonFooter, Modal, FormModul } from '@components'
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
    'CEDULA', 'NOMBRES', 'APELLIDOS', 'FECHA INGRESO', 'CARGO', 'DIAS TRABAJADOS', 'SUELDO', 'SUELDO NOMINAL', 'HORAS EXTRAS', 'RECONOCIMIENTO', 'REMUNERACION VARIABLE', 'SUBTOTAL', '13° SUELDO', '14° SUELDO', 'FONDOS DE RESERVA', 'TOTAL INGRESOS', 'ANTICIPO QUINCENA', 'INDIVIDUAL IESS', 'CUENTAS POR COBRAR', 'EXTENSION IESS', 'HIPOTECARIO', 'QUIROGRAFARIO', 'SEGURO MEDICO', 'TOTAL DESCUENTOS', '2° QUINCENA', 'CUENTA ACREEDORA'
  ]
}

export function RolGeneral () {
  const [key, setKey] = useState(headers[window.localStorage.getItem('selectRol')] || '')
  const [fecha, setFecha] = useState({
    mes: window.localStorage.getItem('mes') || '',
    anio: window.localStorage.getItem('anio') || ''
  })
  const [showDeleteBoton, setShowDeleteButton] = useState({ id: '', show: false })
  const [moreInformation, setMoreInformation] = useState()
  const [updateData, setUpdateData] = useState([])
  const { values, modelo, error } = useGet(url_getAllRoles, fecha)
  const { response: anios } = useGet(url_getAnioRoles)
  const [showData, setShowData] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [valores, setValores] = useState()
  const [disable, setDisable] = useState(false)
  const { doubleClick } = useContext(DoubleClickTd)
  useEffect(() => {
    setShowData(Array.isArray(values) === false ? [] : values)
    setUpdateData(pre => {
      pre = []
      return []
    })
  }, [values])
  const displayData = moreInformation && doubleClick ? moreInformation.value : showData
  const displayModelo = moreInformation && doubleClick ? moreInformation.modelo : modelo
  const handleUpdateData = (cedula, value) => {
    setUpdateData(prevData => {
      const index = prevData.findIndex(item => item.ci_em === cedula)
      if (index !== -1) {
        return prevData.map((item, idx) => idx === index ? { ...item, value: { ...item.value, ...value } } : item)
      } else {
        return [...prevData, {
          ci_em: cedula,
          mesRol: window.localStorage.getItem('mes'),
          anioRol: window.localStorage.getItem('anio'),
          value
        }]
      }
    })
    setDisable(false)
  }
  const handleSelectFiltro = (value) => {
    setKey(headers[value] || '')
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
        modelo={displayModelo}
        showCreateRolButton
        handleClikCreateRol={() => setIsModalOpen(true)}
      />
      {Array.isArray(values) && (
        <>
          <Tabla
            data={displayData}
            headers={key}
            moreInformation={setMoreInformation}
            setUpdateData={handleUpdateData}
            setShowDeleteButton={setShowDeleteButton}
            recoveryId={showDeleteBoton}

          />
          <BotonFooter
            showCerrarBoton
            updateData={updateData}
            disabled={disable}
            setDisable={() => setDisable(true)}
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
