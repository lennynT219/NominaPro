import { useContext } from 'react'
import { DoubleClickTd } from '@assets/context/DoubleClickTd'
import { Tr } from '../Tr/Tr'
import './style.css'
import { Tdf } from '../Td/Tdf'
import { rd } from '../../assets/helpers/rd'

export function Tabla (
  {
    data,
    headers,
    moreInformation,
    setShowDeleteButton,
    recoveryId,
    tfoot
  }
) {
  const { setDoubleClick } = useContext(DoubleClickTd)
  const keys = headers || Object.keys(data[0] || {})
  const handleClikTr = id => {
    setShowDeleteButton(prev => {
      return {
        id,
        show: prev.show === id ? null : id
      }
    })
  }
  const getKey = (row) => row.CEDULA?.value || row.ID?.value

  const sumas = keys.reduce((acc, colum) => {
    let moreTotal
    const sumaColumna = data.reduce((sum, row) => {
      const currentValue = row[colum]?.value
      const currentEstado = row[colum]?.estado
      moreTotal = row[colum]?.moreTotal
      if (typeof currentValue === 'number') {
        sum.Total += currentValue // Suma al total
      }

      if (typeof currentValue === 'number' && currentEstado) {
        sum.Pagado += currentValue // Suma al pagado
      }
      return sum
    }, { Total: 0, Pagado: 0 })
    sumaColumna.Provisión = rd(sumaColumna.Total - sumaColumna.Pagado)
    sumaColumna.Total = rd(sumaColumna.Total)
    sumaColumna.Pagado = rd(sumaColumna.Pagado)
    acc[colum] = { value: sumaColumna, moreTotal }
    return acc
  }, {})

  return (
    <div className='table'>
      <table>
        <thead>
          <tr>
            {keys.map(item => <th key={item}><div>{item}</div></th>)}
          </tr>
        </thead>
        <tbody>
          {
            data.map(row => (
              <Tr
                key={getKey(row)}
                handleClick={() => handleClikTr(getKey(row))}
                isActive={recoveryId.show === getKey(row)}
                cedula={getKey(row)}
                row={row}
                keys={keys}
                moreInformation={moreInformation}
                setDoubleClick={setDoubleClick}
              />
            ))
          }
        </tbody>
        {tfoot &&
          <tfoot>
            <tr className='tfoot'>
              {keys.map((colum) => {
                return <Tdf key={colum} sumas={sumas[colum]} />
              }
              )}
            </tr>
          </tfoot>}
      </table>
    </div>
  )
}
