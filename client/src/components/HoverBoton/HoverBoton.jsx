import React, { useState } from 'react'

export function HoverButton ({ label, children, text }) {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className='hover-button-container'
    >
      {!text
        ? <button className='boton-general' type='button'>{label}</button>
        : <span className='name-user letra-bold'>{label}</span>}
      {isHovered && (
        <div className='hover-content'>
          <div className='div-hover'>
            {children}
          </div>
        </div>
      )}
    </div>
  )
}
