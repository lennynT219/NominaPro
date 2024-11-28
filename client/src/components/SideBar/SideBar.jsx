import { ILogoCoop } from '@assets/icon/ILogoCoop'
import { ISelloCoop } from '@assets/icon/ISelloCoop'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListItem } from '../ListItems/ListItems'
import { useSection } from '@assets/context/SectionData'
import './style.css'

export function SideBar ({ hidenSidebar }) {
  const { sections } = useSection()
  const [activeItem, setActiveItem] = useState(null)
  const navigate = useNavigate()

  const handleLogo = () => hidenSidebar ? <ISelloCoop size='50px' /> : <ILogoCoop width='200px' height='52.72px' />
  return (
    <section className={`sidebar ${hidenSidebar ? 'hiden' : ''}`}>
      <a className='logo' onClick={() => navigate('/')}>
        {handleLogo()}
      </a>
      <ul className='side-menu'>
        {sections && sections.map(section => (
          <li key={section.label} className='contenedor-li'>
            <p>{section.label}</p>
            <ul>
              {section.opciones.map(opcion => (
                <ListItem
                  key={opcion.url}
                  opcion={opcion}
                  handleClick={() => setActiveItem(opcion.url)}
                  isActive={activeItem === opcion.url}
                />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
