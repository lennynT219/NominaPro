/* eslint-disable camelcase */
import { CabReport, Tabla, FormModul, BotonFooter } from '@components'
import { DoubleClickTd } from '@assets/context/DoubleClickTd'
import { HoverDescarga, HoverNuevoEmp } from '@components/HoverBoton/hover'
import {
  url_cargos,
  url_createAreas,
  url_createCargos,
  url_getAreas,
  url_getCargos,
  url_createCargoEmpleado,
  url_ingresarAll
} from '@assets/api/empleado.routes'
import { newCargo, newDetCargo, newArea, newLlamado } from '@components/FormModul/forms'
import { useGet } from '@assets/hook/useData'
import { useState, useContext, useEffect } from 'react'

export function Empresa () {
  const [activeNewCargo, setActiveNewCargo] = useState(false)
  const [showDeleteBoton, setShowDeleteButton] = useState({ id: '', show: false })
  const [moreInformation, setMoreInformation] = useState()
  const [updateData, setUpdateData] = useState([])
  const [value, setValue] = useState(false)
  const [formData, setFormData] = useState([])
  const { values, modelo } = useGet(url_cargos)
  const { response: areas } = useGet(url_getAreas)
  const { response: cargos } = useGet(url_getCargos)
  const [showData, setShowData] = useState([])
  const [valores, setValores] = useState({})
  const { doubleClick } = useContext(DoubleClickTd)
  const newShowData = showData.length > 0 ? showData : values
  const displayData =
    moreInformation && doubleClick ? moreInformation.value : newShowData
  const displayModelo =
    moreInformation && doubleClick ? moreInformation.modelo : modelo

  const handleClickNewCargo = () => setActiveNewCargo(!activeNewCargo)
  // const handleUpdateData = (cedula, value) => {
  //   setUpdateData((prevData) => {
  //     const index = prevData.findIndex((item) => item.ci_em === cedula)
  //     if (index !== -1) {
  //       return prevData.map((item, idx) =>
  //         idx === index
  //           ? { ...item, value: { ...item.value, ...value } }
  //           : item
  //       )
  //     } else {
  //       return [...prevData, { ci_em: cedula, value }]
  //     }
  //   })
  // }

  const handleSelectNew = (value, plh) => {
    setValue(value !== plh)
    setFormData(() => {
      switch (value) {
        case 'Detalle de Cargo':
          return {
            formData: newDetCargo(cargos),
            url: url_createCargoEmpleado(showDeleteBoton.id)
          }
        case 'Nuevo Cargo':
          return { formData: newCargo(areas), url: url_createCargos }
        case 'Nueva Area':
          return { formData: newArea, url: url_createAreas }
        case 'Llamado de Atencion':
          return { formData: newLlamado, url: url_ingresarAll(showDeleteBoton.id, 'LlamadosAtencion') }
      }
    })
  }

  useEffect(() => setValores({}), [formData])

  useEffect(() => {
    const preValue = window.localStorage.getItem('HoverNuevoEmp') || 'Ingresar'
    handleSelectNew(preValue, 'Ingresar')
  }, [areas, cargos, showDeleteBoton.id])
  return (
    <>
      {typeof values !== 'function' && (
        <>
          <CabReport
            showNewCargoButton
            showdDownloadButton
            handleClickNewCargo={handleClickNewCargo}
            showDeleteBoton={showDeleteBoton}
            setShowData={setShowData}
            displayData={displayData}
            descargas={HoverDescarga}
            nuevoEmpresa={HoverNuevoEmp(handleSelectNew)}
            modelo={displayModelo}
          />
          <div className={`table-form ${value && 'activeNew'}`}>
            <Tabla
              data={displayData}
              moreInformation={setMoreInformation}
              // setUpdateData={handleUpdateData}
              setShowDeleteButton={setShowDeleteButton}
              recoveryId={showDeleteBoton}

            />
            {value && (
              <FormModul
                data={formData.formData}
                url={formData.url}
                valores={valores}
                setValores={setValores}
              />
            )}
          </div>
        </>
      )}
    </>
  )
}
