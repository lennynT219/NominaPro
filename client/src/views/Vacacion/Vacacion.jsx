/* eslint-disable camelcase */
import { CabReport, Tabla, FormModul } from '@components'
import { DoubleClickTd } from '@assets/context/DoubleClickTd'
import { HoverDescarga } from '@components/HoverBoton/hover'
import { useGet } from '@assets/hook/useData'
import { useContext, useState } from 'react'
import { url_vacaciones, url_ingresarAll } from '@assets/api/empleado.routes'
import { newVacation } from '@components/FormModul/forms'
import './Vacacion.css'
import { url_diasVacacionesByCi } from '../../assets/api/empleado.routes'

export function Vacacion () {
  const [showDeleteBoton, setShowDeleteButton] = useState({ id: '', show: false })
  const [moreInformation, setMoreInformation] = useState()
  const { values, modelo } = useGet(url_vacaciones)
  const { response } = useGet(url_diasVacacionesByCi(showDeleteBoton.id))
  const [showData, setShowData] = useState([])
  const [valores, setValores] = useState({})
  const { doubleClick } = useContext(DoubleClickTd)
  const newShowData = showData.length > 0 ? showData : values
  const displayData = moreInformation && doubleClick ? moreInformation.value : newShowData
  const displayModelo = moreInformation && doubleClick ? moreInformation.modelo : modelo

  return (
    <>
      {typeof values !== 'function' && (
        <>
          <CabReport
            showDeleteBoton={showDeleteBoton}
            setShowData={setShowData}
            displayData={displayData}
            showdDownloadButton
            descargas={HoverDescarga}
            modelo={displayModelo}
          />

          <div className={`table-form ${showDeleteBoton.show && 'activeNew'}`}>
            <Tabla
              data={displayData}
              moreInformation={setMoreInformation}
              setShowDeleteButton={setShowDeleteButton}
              recoveryId={showDeleteBoton}

            />
            {showDeleteBoton.show && !doubleClick && showDeleteBoton.id && (
              <FormModul
                data={newVacation(response)}
                url={url_ingresarAll(showDeleteBoton.id, 'Vacaciones')}
                valores={valores}
                setValores={setValores}
              />)}
          </div>
        </>)}
    </>
  )
}
