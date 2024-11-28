import { useState } from 'react'
import { InputGeneral } from '../InputGeneral/InputGeneral'
import { BotonGuardar } from '../BotonGuardar/BotonGuardar'

export function Pruebas () {
  const [valores, setValores] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const createJson = (name, value) => {
    setValores({
      ...valores,
      [name]: value
    })
  }
  return (
    <form onSubmit={handleSubmit}>
      <InputGeneral
        // plh={plh}
        // value={valor}
        // onChange={}
        plh='Ingresa datos'
        name='PRUEBA'
        type='text'
        inheight='50px'
        plhSize='15px'
        iconColor='#0C5795'
        iconSize='20px'
        icon='material-symbols:percent'
        createJson={createJson}
      />
      <InputGeneral
        // plh={plh}
        // value={valor}
        // onChange={}
        plh='Ingresa datos'
        name='PRUEBA2'
        type='email'
        inheight='50px'
        plhSize='15px'
        iconColor='#0C5795'
        iconSize='20px'
        icon='material-symbols:percent'
        createJson={createJson}
      />
      <BotonGuardar />
    </form>
  )
}
