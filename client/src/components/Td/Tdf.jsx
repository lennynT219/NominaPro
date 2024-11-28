import { useState } from 'react'

export function Tdf({ sumas }) {
  const [index, setIndex] = useState(0)
  const colores = ['--blue', '--red', '--green', '--yellow', '--purple']
  const handleClick = () => {
    sumas.moreTotal && setIndex(prev => (prev + 1) % sumas.moreTotal.length)
  }
  const estilos = {
    '--color': `var(${colores[index]})`
  }

  return (
    <td
      onClick={handleClick}
    >
      <div
        className={`${sumas.moreTotal ? 'td-hover' : ''}`}
        style={estilos}
        hover={sumas.moreTotal && sumas.moreTotal[index]}
      >
        {sumas.moreTotal
          ? sumas.value[sumas.moreTotal[index]] !== 0 ? sumas.value[sumas.moreTotal[index]] : ''
          : sumas.value.Total !== 0 ? sumas.value.Total : ''}
      </div>
    </td>
  )
}
