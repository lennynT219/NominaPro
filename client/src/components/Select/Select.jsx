import { useState } from 'react'
import './style.css'
import { Icon } from '@iconify/react-with-api'

export function Select ({ opciones, click }) {
  const handleOptionClick = value => {
    click(value)
  }

  return (
    <div className='options-select'>
      {opciones.map((opcion, index) => (
        <p
          key={index + opcion}
          className='label-select'
          onClick={() => handleOptionClick(opcion.label)}
        >
          <Icon icon={opcion.icon} />
          {opcion.label}
        </p>
      ))}
      <div className='option-bg-select' />
    </div>

  )
}
