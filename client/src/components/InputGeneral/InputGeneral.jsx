import { Icon } from '@iconify/react-with-api'
import './style.css'
import { useEffect, useState } from 'react'

export function InputGeneral ({
  type,
  plh,
  inheight,
  icon,
  iconSize,
  iconColor,
  plhSize,
  value,
  name,
  createJson,
  numberToString,
  filtro
}) {
  const [valor, setValor] = useState(() => {
    const storedValue = window.localStorage.getItem(name)
    return storedValue || value
  })

  const handleValorChange = ({ target: { name, value, type } }) => {
    setValor(value === undefined ? '' : value)
    createJson(name, value, type, numberToString)
  }
  useEffect(() => {
    if (type === 'date') {
      window.localStorage.setItem(name, valor)
    }
  }, [valor])

  useEffect(() => {
    !filtro && setValor(value)
  }, [value])

  return (
    <div className='container'>
      <label className='input'>
        <input
          value={valor}
          onChange={handleValorChange}
          type={type}
          placeholder={plh}
          style={{ height: inheight, fontSize: plhSize }}
          name={name}
        />
        {icon && <Icon icon={icon} color={iconColor} height={iconSize} width={iconSize} />}
      </label>
    </div>
  )
}
