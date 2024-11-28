/* eslint-disable camelcase */
import { useGet } from '@assets/hook/useData'
import { FormModul } from '@components'
import { useState } from 'react'
import './Param.css'
import { url_getParams, url_updateParams } from '@assets/api/empleado.routes'

export function Param () {
  const { response } = useGet(url_getParams)
  const [valores, setValores] = useState({})
  return (
    <div className='contenedor-parammoduls'>
      {response.length > 0 && response.map(formModul => (
        <FormModul
          key={formModul.label}
          data={formModul}
          valores={valores}
          setValores={setValores}
          url={url_updateParams}
          params
        />
      ))}
    </div>
  )
}
