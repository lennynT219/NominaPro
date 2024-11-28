import { useEffect, useRef, useState } from 'react'
import { usePut } from '../../assets/hook/useData'
import { url_updateOne } from '../../assets/api/empleado.routes'
import { toast } from 'sonner'

export function Td ({
  children,
  handleClickTd,
  type,
  name,
  estado,
  childrenIsArray,
  minlength,
  maxlength,
  modelo,
  id,
  opciones

}) {
  const [valor, setValor] = useState(children)
  const [isEditing, setIsEditing] = useState(false)
  const [valorUpdate, setValorUpdate] = useState()
  const [activarPeticion, setActivarPeticion] = useState(false)
  const { response, error } = usePut(url_updateOne, valorUpdate, activarPeticion, setActivarPeticion)
  const leftClickHold = useRef(null)
  const leftClickHoldP = useRef(null)

  useEffect(() => {
    setValor(children)
  }, [children])

  useEffect(() => {
    if (error?.response.data.errors) {
      error.response.data.errors.map(error => (
        toast.error(error.msg, {
          duration: 2000
        })
      ))
    }
  }, [error])

  useEffect(() => {
    response && toast.success(response?.msg)
  }, [response])

  const handleValorChange = (event) => {
    setValor(event.target.value)
    setValorUpdate({
      modelo,
      [name]: type === 'number' ? +event.target.value : event.target.value,
      id,
      name
    })
  }

  const handleMouseDownP = (e) => {
    if (e.button === 0) {
      leftClickHoldP.current = setTimeout(() => {
        setIsEditing(!childrenIsArray)
      }, 1000)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && valor.trim() !== children) {
      if (error?.response.data.errors) {
        setIsEditing(false)
      }
      setActivarPeticion(true)
    } else if (e.key === 'Enter' && valor.trim() === children) {
      setIsEditing(false)
      toast.warning('No se detectaron cambios')
    }
  }
  const handleBlur = () => {
    if (typeof valor === 'string' && valor.trim() === children) {
      setIsEditing(false)
    } else if (valor === children) {
      setIsEditing(false)
    }
  }

  const handleValorChangeSelect = e => {
    setValorUpdate({
      modelo,
      [name]: handleValue(e.target.value),
      id,
      name
    })
    setActivarPeticion(true)
    !error?.response.data.errors && setIsEditing(false)
  }

  const handleValue = opcion => {
    if (opcion === 'ACTIVO' || opcion === 'SI') {
      return true
    } else if (opcion === 'INACTIVO' || opcion === 'NO') {
      return false
    }
    return opcion
  }

  const handleDefaultValue = valor => {
    if (valor === true) {
      return 'SI'
    } else if (valor === false) {
      return 'NO'
    }
  }

  const handleMouseDown = e => {
    if (e.button === 0) {
      leftClickHold.current = setTimeout(() => {
        handleClickTd !== undefined && handleClickTd()
      }, 1000)
    }
  }

  const handleMouseUp = () => {
    clearTimeout(leftClickHold.current)
  }

  const handleMouseUpP = () => {
    clearTimeout(leftClickHoldP.current)
  }
  return (
    <td onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      {!isEditing
        ? (
          <p
            className={estado && name !== 'quincena' ? 'trueStatus' : undefined}
            onMouseDown={handleMouseDownP}
            onMouseUp={handleMouseUpP}
          >
            {valor}
          </p>
          )
        : type === 'select'
          ? (
            <select
              defaultValue={estado === undefined ? valor : handleDefaultValue(estado)}
              onChange={handleValorChangeSelect}
              name={name}
              autoFocus
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
            >
              {opciones?.map(opcion => <option key={opcion} value={opcion}>{opcion}</option>)}
            </select>
            )
          : (
            <input
              type={type || 'text'}
              value={valor}
              onChange={handleValorChange}
              name={name}
              autoFocus
              maxLength={maxlength}
              minLength={minlength}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
            />
            )}
    </td>
  )
}
