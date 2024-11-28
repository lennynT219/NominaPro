/* eslint-disable camelcase */
import { CabReport, Tabla } from '@components'
import { HoverDescarga, HoverFiltroVac } from '@components/HoverBoton/hover'
import { DoubleClickTd } from '@assets/context/DoubleClickTd'
import { url_getConsVac } from '@assets/api/empleado.routes'
import { useGet } from '@assets/hook/useData'
import { useState, useContext, useEffect } from 'react'
import './ConsoVac.css'
import { useGetFile } from '../../assets/hook/useData'

export function ConsoVac () {
  const [showDeleteBoton, setShowDeleteButton] = useState({ id: '', show: false })
  const [moreInformation, setMoreInformation] = useState(null)
  const [fecha, setFecha] = useState({
    fechaDesde: window.localStorage.getItem('fechaDesde') === 'undefined' ? '' : window.localStorage.getItem('fechaDesde'),
    fechaHasta: window.localStorage.getItem('fechaHasta') || ''
  })
  const { modelo, error, response } = useGet(url_getConsVac, fecha)
  const [showData, setShowData] = useState([])
  const [formato, setFormato] = useState({ ...fecha, download: '' })
  const { doubleClick } = useContext(DoubleClickTd)
  const newShowData = showData.length > 0 ? showData : response
  const displayData = moreInformation && doubleClick ? moreInformation.value : newShowData
  const displayModelo = moreInformation && doubleClick ? moreInformation.modelo : modelo

  const handleSelectFecha = (name, value) => {
    setFecha(prev => ({
      ...prev,
      [name]: value || ''
    }))
    setFormato(prev => ({
      ...prev,
      [name]: value || ''
    }))
  }

  const handleSelectDownload = (e) => {
    setFormato(prev => ({
      ...prev,
      download: e.target.value || ''
    }))
  }

  useEffect(() => {
    formato.download && useGetFile(url_getConsVac, formato, 'Consolidado_de_vacaciones')
  }, [formato])

  return (
    <>
      <CabReport
        showDeleteBoton={showDeleteBoton}
        filtro={HoverFiltroVac(handleSelectFecha)}
        showdDownloadButton
        descargas={HoverDescarga(handleSelectDownload)}
        setShowData={setShowData}
        displayData={displayData}
        modelo={displayModelo}
      />
      {Array.isArray(response) && !error
        ? (
          <Tabla
            data={displayData}
            moreInformation={setMoreInformation}
            setShowDeleteButton={setShowDeleteButton}
            recoveryId={showDeleteBoton}
          />)
        : <h1 className='errorMesange'>{error.response.data.msg}</h1>}
    </>
  )
}
