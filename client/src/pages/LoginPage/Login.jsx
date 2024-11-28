/* eslint-disable camelcase */
import { ILogoCoop } from '@assets/icon/ILogoCoop'
import { InputGeneral } from '@components/InputGeneral/InputGeneral'
import { icons } from '@assets/icon/icons'
import './style.css'
import { useEffect, useState } from 'react'
import { usePost } from '@assets/hook/useData'
import { url_login } from '@assets/api/empleado.routes'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

function MainPage() {
  const [valores, setValores] = useState({ username: '', password: '' })
  const [activarPeticion, setActivarPeticion] = useState(false)
  const { response, error } = usePost(url_login, valores, activarPeticion, setActivarPeticion)
  const navigate = useNavigate()
  const iconProps = {
    iconColor: '#0C5795',
    inheight: '50px',
    plhSize: '15px'
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      navigate('/')
    }
  }, [])

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
    if (response) {
      toast.success(response?.msg)
      localStorage.setItem('token', response?.token)
      navigate('/')
    }
  }, [response])
  const createJson = (name, value, type, numberToString) => {
    setValores(valoresPrevios => ({
      ...valoresPrevios,
      [name]: type === 'number' && !numberToString ? +(value) : String(value)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setActivarPeticion(true)
  }

  const disableButton = valores?.username !== '' && valores?.password !== ''
  return (
    <main className='login'>
      <div className='formulario-login contenido-centrado'>
        <h1>Iniciar Sesion</h1>
        <form className='contenedor-interno' onSubmit={handleSubmit}>
          <InputGeneral
            {...iconProps}
            plh='Usuario'
            iconSize='28px'
            icon={icons.IUserLogin}
            createJson={createJson}
            name='username'
          />
          <InputGeneral
            {...iconProps}
            type='password'
            plh='Contraseña'
            iconSize='25px'
            icon={icons.ILockLogin}
            createJson={createJson}
            name='password'
          />
          <a href='#'>Olvidé mi contraseña</a>
          <button type='submit' className='boton-general' disabled={!disableButton}>Ingresar</button>
        </form>
      </div>
      <div className='marca-agua'>
        <ILogoCoop width='200px' height='60px' />
      </div>
    </main>
  )
}

export default MainPage
