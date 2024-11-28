/* eslint-disable camelcase */
import { CabReport, Tabla, BotonFooter } from '@components'
import { HoverDescarga } from '@components/HoverBoton/hover'
import { DoubleClickTd } from '@assets/context/DoubleClickTd'
import { url_getConsGen } from '@assets/api/empleado.routes'
import { useGet } from '@assets/hook/useData'
import { useState, useContext } from 'react'

export function ConsoGen () {
  const [showDeleteBoton, setShowDeleteButton] = useState({ id: '', show: false })
  const [moreInformation, setMoreInformation] = useState()
  const [updateData, setUpdateData] = useState([])
  const { values, modelo, response } = useGet(url_getConsGen)
  const [showData, setShowData] = useState([])
  const { doubleClick } = useContext(DoubleClickTd)
  const newShowData = showData.length > 0 ? showData : response
  const displayData = moreInformation && doubleClick ? moreInformation.value : newShowData
  const displayModelo = moreInformation && doubleClick ? moreInformation.modelo : modelo
  const handleUpdateData = (cedula, value) => {
    setUpdateData(prevData => {
      const index = prevData.findIndex(item => item.ci_em === cedula)
      if (index !== -1) {
        return prevData.map((item, idx) => idx === index ? { ...item, value: { ...item.value, ...value } } : item)
      } else {
        return [...prevData, { ci_em: cedula, value }]
      }
    })
  }
  return (
    <>
      {typeof response !== 'function' && (
        <>
          <CabReport
            showDeleteBoton={showDeleteBoton}
            showdDownloadButton
            descargas={HoverDescarga}
            setShowData={setShowData}
            displayData={displayData}
            modelo={displayModelo}
          />
          <Tabla
            data={displayData}
            moreInformation={setMoreInformation}
            setUpdateData={handleUpdateData}
            setShowDeleteButton={setShowDeleteButton}
            recoveryId={showDeleteBoton}
          />
        </>
      )}
    </>
  )
}
