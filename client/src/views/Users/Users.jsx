/* eslint-disable camelcase */
import { BotonFooter, CabReport, Tabla, FormModul, DragAndDrop } from '@components'
import { newUser } from '@components/FormModul/forms'
import { useGet } from '@assets/hook/useData'
import { DoubleClickTd } from '@assets/context/DoubleClickTd'
import { url_getEmpleadoUsers, url_createUser, url_getUsers, url_getRoles } from '@assets/api/empleado.routes'
import { useContext, useEffect, useState } from 'react'
import { ButtonIcon } from '../../components/ButtonIcon/ButtonIcon'
import { icons } from '../../assets/icon/icons'
import './Users.css'
import { url_assignRol } from '../../assets/api/empleado.routes'

export function Users () {
  const [isActiveNew, setIsActiveNew] = useState(false)
  const [showDeleteBoton, setShowDeleteButton] = useState({ id: '', show: null })
  const [moreInformation, setMoreInformation] = useState()
  const [updateData, setUpdateData] = useState([])
  const [url, setUrl] = useState(() => (isActiveNew ? url_getEmpleadoUsers : url_getUsers))
  const { values, modelo } = useGet(url)
  const [showData, setShowData] = useState([])
  const [valores, setValores] = useState({})
  const [isEdit, setIsEdit] = useState(false)

  const { doubleClick } = useContext(DoubleClickTd)
  const newShowData = showData.length > 0 ? showData : values
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
  useEffect(() => {
    setValores(prev => ({
      ...prev,
      ci_em: showDeleteBoton.id
    }))
  }, [showDeleteBoton])

  const findUser = data => data.find(user => user.ID.value === showDeleteBoton.id)

  useEffect(() => setUrl(() => (isActiveNew ? url_getEmpleadoUsers : url_getUsers)), [isActiveNew])

  return (
    <>
      {typeof values !== 'function' && (
        <>
          {isEdit
            ? (
              <div className='container-dad'>
                <ButtonIcon
                  icon={icons.IAtras}
                  onClick={() => setIsEdit(false)}
                  width='21px'
                  height='21px'
                />
                <DragAndDrop
                  label='Roles'
                  firstData={findUser(values)}
                  urlSecondData={url_getRoles(findUser(values).ID.value)}
                  urlUpdate={url_assignRol}
                  id={findUser(values).ID.value}
                />
              </div>
              )
            : (
              <>
                <CabReport
                  showDeleteBoton={showDeleteBoton}
                  showCreateUserButton
                  handleClickCreateVac={() => { setIsActiveNew(!isActiveNew) }}
                  setShowData={setShowData}
                  displayData={displayData}
                  modelo={displayModelo}
                  activeUser={isActiveNew}
                  user={!isActiveNew}
                  handleEdit={() => setIsEdit(true)}
                />
                <div className={`table-form ${isActiveNew && 'activeNew'}`}>
                  {isActiveNew
                    ? (
                      <>
                        <Tabla
                          data={displayData}
                          moreInformation={setMoreInformation}
                          setUpdateData={handleUpdateData}
                          setShowDeleteButton={setShowDeleteButton}
                          recoveryId={showDeleteBoton}
                        />
                        <FormModul
                          data={newUser}
                          url={url_createUser}
                          valores={valores}
                          setValores={setValores}
                        />
                      </>
                      )
                    : (
                      <>
                        <Tabla
                          data={displayData}
                          moreInformation={setMoreInformation}
                          setUpdateData={handleUpdateData}
                          setShowDeleteButton={setShowDeleteButton}
                          recoveryId={showDeleteBoton}
                        />
                        <BotonFooter updateData={updateData} />
                      </>)}
                </div>
              </>
              )}
        </>
      )}
    </>
  )
}
