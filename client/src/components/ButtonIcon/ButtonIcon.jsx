import { Icon } from '@iconify/react-with-api'

export const ButtonIcon = ({ icon, height, width, onClick, children, type }) => (
  <button className='boton-general' onClick={onClick} type={type}>
    <Icon icon={icon} height={height} width={width} />
    {children}
  </button>
)
