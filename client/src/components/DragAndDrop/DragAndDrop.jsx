import { useEffect, useState } from 'react'
import './DragAndDrop.css'
import { updateArray } from '../../assets/helpers/updateArray'
import { useGet, usePut } from '../../assets/hook/useData'
import { toast } from 'sonner'

export function DragAndDrop ({ firstData, urlSecondData, label, id, urlUpdate }) {
  const [roles, setRoles] = useState(firstData.ROL?.value)
  const [activate, setActivate] = useState(false)
  const { response: msg } = usePut(urlUpdate, { id, roles }, activate, setActivate)
  const { response: secondData } = useGet(urlSecondData)
  const [noRoles, setNoRoles] = useState(secondData)
  const startDrag = (e, rol) => {
    e.dataTransfer.setData('rol', JSON.stringify(rol))
  }
  const draggingOver = (e) => {
    e.preventDefault()
  }

  useEffect(() => {
    msg && toast.success('Actualizado correctamente')
  }, [msg])

  useEffect(() => setNoRoles(secondData), [secondData])

  const onDrop = (e, section) => {
    const rol = JSON.parse(e.dataTransfer.getData('rol'))
    if (section === 'roles') {
      updateArray(setNoRoles, setRoles, rol)
    } else if (section === 'noRoles') {
      updateArray(setRoles, setNoRoles, rol)
    }
    setActivate(true)
  }
  return (
    <div className='drag-and-drop'>
      <h2>{firstData.USUARIO.value}</h2>
      <hr />
      <div>
        <section>
          <p>{label} adquiridos</p>
          <div
            onDragOver={draggingOver}
            droppable='true'
            onDrop={e => { onDrop(e, 'roles') }}
          >
            {roles.map((rol, i) => (
              <span
                key={i}
                draggable
                onDragStart={e => startDrag(e, rol)}
              >
                {rol.NOMBRE.value}
              </span>
            ))}
          </div>
        </section>
        <section>
          <p>Obtener</p>
          <div
            onDragOver={draggingOver}
            droppable='true'
            onDrop={e => onDrop(e, 'noRoles')}
          >
            {noRoles.map((rol, i) => (
              <span
                key={i}
                draggable
                onDragStart={e => startDrag(e, rol)}
              >
                {rol.NOMBRE.value}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
