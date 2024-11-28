import { ISelloCoopHv } from '@assets/icon/ISelloCoopHv'
import './style.css'

export function FondoLogo () {
  return (
    <div className='fondoLogo'>
      {Array.from({ length: 80 }).map((_, i) => <ISelloCoopHv key={i} size='120px' />)}
    </div>
  )
}
