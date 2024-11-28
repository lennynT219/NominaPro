import { Icon } from '@iconify/react-with-api'
import { useState, useEffect } from 'react'
import './style.css'

function Option ({ opcion, onClick }) {
  return (
    <div className='option' onClick={() => onClick(opcion)}>
      <span className='label'>{opcion}</span>
    </div>
  )
}

export function SelectBox ({ opciones, plh, handleSelect, nameLocalStorage, inHeight, sizePlh }) {
  const [selectedValue, setSelectedValue] = useState(() => {
    const storedValue = window.localStorage.getItem(nameLocalStorage)
    return storedValue !== null ? storedValue : plh
  })

  useEffect(() => {
    window.localStorage.setItem(nameLocalStorage, selectedValue)
  }, [selectedValue])

  const handleOptionClick = value => {
    const newValue = selectedValue === value ? plh : value
    setSelectedValue(newValue)
    handleSelect(newValue, plh, nameLocalStorage)
  }

  return (
    <div className='select-box' style={{ height: inHeight }}>
      <input type='checkbox' className='options-view-button' />
      <div className='select-button brd' style={{ height: inHeight }}>
        <div className='selected-value' style={{ fontSize: sizePlh }}>
          <span>{selectedValue}</span>
        </div>
        <div className='chevrons'>
          <Icon icon='charm:chevrons-up-down' />
        </div>
      </div>
      <div className='options'>
        {opciones.map((opcion, index) => (
          <Option
            opcion={opcion}
            onClick={handleOptionClick}
            key={opcion + index}
          />
        ))}
        <div className='option-bg' />
      </div>
    </div>
  )
}
