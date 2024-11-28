/* eslint-disable camelcase */
import { BotonFooter, CabReport, Tabla, FormModul } from '@components'
import { HoverDescarga, HoverNuevo } from '@components/HoverBoton/hover'
import { newEmpelado, newCarga, newFacademica, newElaboral, newCurso } from '@components/FormModul/forms'
import { useGet } from '@assets/hook/useData'
import { DoubleClickTd } from '@assets/context/DoubleClickTd'
import { url_getAllEmpleados, url_ingresarEmpleado, url_ingresarAll } from '@assets/api/empleado.routes'
import { useContext, useEffect, useState } from 'react'
import './Personal.css'

export function Personal () {
  const [isActiveNew, setIsActiveNew] = useState(false)
  const [showDeleteBoton, setShowDeleteButton] = useState({ id: '', show: null })
  const [formData, setFormData] = useState([])
  const [value, setValue] = useState(false)
  const [moreInformation, setMoreInformation] = useState()
  const [updateData, setUpdateData] = useState([])
  const { response, modelo } = useGet(url_getAllEmpleados)
  const [showData, setShowData] = useState([])
  const [valores, setValores] = useState({})
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
  const handleSelectNew = (value, plh) => {
    setValue(value !== plh)
    setIsActiveNew(value === 'Empleado')
    setValores({})
    setFormData(() => {
      switch (value) {
        case 'Carga Familiar':
          return { formData: newCarga, modelo: 'CargosFamiliares' }
        case 'Formacion Academica':
          return { formData: newFacademica, modelo: 'FormacionAcademica' }
        case 'Experiencia Laboral':
          return { formData: newElaboral, modelo: 'ExperienciaLaboral' }
        case 'Curso':
          return { formData: newCurso, modelo: 'Cursos' }
      }
    })
  }

  useEffect(() => {
    const preValue = window.localStorage.getItem('HoverNuevo') || 'Ingresar'
    handleSelectNew(preValue, 'Ingresar')
  }, [])

  return (
    <>
      {Array.isArray(response) && (
        <>
          <CabReport
            showDeleteBoton={showDeleteBoton}
            showCreateButton
            showdDownloadButton
            setShowData={setShowData}
            displayData={displayData}
            descargas={HoverDescarga}
            nuevoPersonal={HoverNuevo(handleSelectNew)}
            modelo={displayModelo}
          />
          <div className='contenido-interno-dashboard'>
            {
              isActiveNew
                ? (
                  <FormModul
                    data={newEmpelado}
                    url={url_ingresarEmpleado}
                    valores={valores}
                    setValores={setValores}
                  />
                  )
                : (
                  <>
                    <div className={`table-form-100 ${value && 'activeNew'}`}>
                      <Tabla
                        data={displayData}
                        moreInformation={setMoreInformation}
                        setUpdateData={handleUpdateData}
                        setShowDeleteButton={setShowDeleteButton}
                        recoveryId={showDeleteBoton}
                      />
                      {value && (
                        <FormModul
                          data={formData.formData}
                          url={url_ingresarAll(showDeleteBoton.id, formData.modelo)}
                          valores={valores}
                          setValores={setValores}
                        />)}
                    </div>
                  </>
                  )
            }
          </div>
        </>
      )}
    </>
  )
}
