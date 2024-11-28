/* eslint-disable camelcase */
import { useEffect, useState } from 'react'
import { BotonFooter } from '../BotonGuardar/BotonGuardar'
import { InputGeneral } from '../InputGeneral/InputGeneral'
import { usePost } from '@assets/hook/useData'
import './style.css'
import { toast } from 'sonner'

export function FormModul ({ data: { label, values }, url, valores, setValores, params }) {
  const [activarPeticion, setActivarPeticion] = useState(false)
  const { response, error } = usePost(url, valores, activarPeticion, setActivarPeticion)
  const [disableBotonParams, setDisableBotonParams] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    setActivarPeticion(true)
  }

  useEffect(() => {
    if (error?.response.data.errors) {
      error.response.data.errors.map(error => (
        toast.error(error.msg, {
          duration: 2000
        })
      ))
    } else if (error?.response.data.message === 'Not Found') {
      toast.error('Selecione un empleado')
    }
  }, [error])

  useEffect(() => {
    if (response) {
      toast.success(response?.msg)
      values.forEach(({ name }) => {
        localStorage.removeItem(name)
      })
      setValores({})
    }
  }, [response])

  const handleSelect = (value, plh, name) => {
    setValores(valoresPrevios => ({
      ...valoresPrevios,
      [name]: value
    }))
  }
  const handleCheck = (e) => {
    setValores(valoresPrevios => ({
      ...valoresPrevios,
      [e.target.name]: e.target.checked
    }))
  }

  const createJson = (name, value, type, numberToString) => {
    setValores(valoresPrevios => ({
      ...valoresPrevios,
      [name]: type === 'number' && !numberToString ? +(value) : String(value)
    }))
    setDisableBotonParams(false)
  }

  const allFieldsFilled = valores && values.every(({ name, type }) => {
    if (type === 'check') return true
    return valores[name]
  })
  console.log(valores)
  return (
    <>
      <form className='parammodul' onSubmit={handleSubmit}>
        <h2 className='letra-bold'>{label}</h2>
        {values && values.map(({ detalle, icon, name, type, opciones, numberToString, value }) => (
          <div key={name + detalle} className='input-param'>
            {opciones
              ? (
                <>
                  <p>{detalle}</p>
                  <select value={valores[name] || ''} onChange={e => createJson(name, e.target.value, type)}>
                    <option value='' disabled>...</option>
                    {opciones.map((opcion, index) => (
                      <option value={opcion} key={opcion + index}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </>
                )
              : type === 'check'
                ? (
                  <>
                    <input type='checkbox' className='check' name={name} id={name} onChange={handleCheck} />
                    <label htmlFor={name} className='labelCheck'>{detalle}</label>
                  </>
                  )
                : (
                  <>
                    <p>{detalle}</p>
                    <InputGeneral
                      value={value || valores[name] || ''}
                      name={name}
                      type={type || 'text'}
                      inheight='50px'
                      plhSize='15px'
                      iconColor='#0C5795'
                      iconSize='20px'
                      icon={icon}
                      createJson={createJson}
                      numberToString={numberToString}
                    />
                  </>
                  )}
          </div>
        ))}
        {!params ? <BotonFooter form disabled={!allFieldsFilled} /> : <BotonFooter form disabled={disableBotonParams} />}
      </form>
    </>
  )
}
