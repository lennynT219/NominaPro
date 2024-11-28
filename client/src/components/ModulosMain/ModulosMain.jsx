import { Icon } from '@iconify/react-with-api'
import { useMediaQuery } from '../../assets/hook/useMediaQuery'
import './style.css'

export function ModulosMain ({ bgc, label, icon, iconColor, onClick }) {
  const iconSize = useMediaQuery()

  return (
    <div className='modulo' style={{ backgroundColor: bgc }} onClick={onClick}>
      <div className='circulo-modulos'>
        <Icon icon={icon} width={iconSize} height={iconSize} color={iconColor} />
      </div>
      <h5 style={{ color: iconColor }}>{label}</h5>
    </div>
  )
}
