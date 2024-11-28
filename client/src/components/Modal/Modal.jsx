import { Icon } from '@iconify/react-with-api'
import './style.css'
import { icons } from '../../assets/icon/icons'

export function Modal ({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className='modalBackdrop'>
      <div className='modalContent'>
        <button onClick={onClose} className='closeButton'>
          <Icon icon={icons.IExit} />
        </button>
        {children}
      </div>
    </div>
  )
}
