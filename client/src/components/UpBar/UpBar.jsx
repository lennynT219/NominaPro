import React, { useState, useEffect, useCallback } from 'react'
import { Icon } from '@iconify/react-with-api'
import { ILogoCoop } from '@assets/icon/ILogoCoop'
import { ISelloCoop } from '@assets/icon/ISelloCoop'
import logo from '../../assets/img/logo.coop.politecnica.svg'
import { icons } from '@assets/icon/icons'
import './style.css'
import { useDataUser } from '../../assets/context/DataUser'
import { HoverButton } from '../HoverBoton/HoverBoton'
import { Select } from '../Select/Select'
import { useNavigate } from 'react-router-dom'

const SMALL_SCREEN_SIZE = 500

const checkScreenSize = () => window.innerWidth < SMALL_SCREEN_SIZE

const UpBar = ({ showMenuIcon, onMenuClick }) => {
  const [isScreenSmall, setIsScreenSmall] = useState(checkScreenSize())
  const { response } = useDataUser()
  const navigate = useNavigate()

  const updateScreenSize = useCallback(() => {
    setIsScreenSmall(checkScreenSize())
  }, [])
  useEffect(() => {
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [updateScreenSize])

  const username = response?.name && (response?.name.charAt(0).toUpperCase() + response?.name.slice(1).toLowerCase())

  const handleSelect = value => {
    if (value === 'Cerrar Sesión') {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }
  return (
    <div className='up-bar'>
      <a onClick={onMenuClick}>
        {showMenuIcon ? <Icon icon={icons.IMenu} /> : isScreenSmall ? <ISelloCoop size='60px' /> : <ILogoCoop width='200px' height='60px' />}
      </a>
      <div className='itens-bar contenido-centrado'>
        <Icon icon={icons.INotification} />
        <div className='profile-picture'>
          {/* <img src={response?.img || logo} alt='Perfil de usuario' /> */}
          <ISelloCoop/>
        </div>
        <HoverButton label={username} text>
          <Select
            opciones={[
              { label: 'Perfil', icon: icons.IConfigurar },
              { label: 'Cerrar Sesión', icon: icons.IExit }
            ]}
            click={handleSelect}
          />
        </HoverButton>
      </div>
    </div>
  )
}

export default UpBar
