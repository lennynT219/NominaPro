/* eslint-disable camelcase */
import { FondoLogo } from '@components/FondoLogo/FondoLogo'
import { ModulosMain } from '@components/ModulosMain/ModulosMain'
import UpBar from '@components/UpBar/UpBar'
import './Main.css'
import { url_moduls } from '@assets/api/empleado.routes'
import { useGet } from '@assets/hook/useData'
import { useSection } from '@assets/context/SectionData'
import { useNavigate } from 'react-router-dom'

function MainPage () {
  const { response } = useGet(url_moduls)
  const { setSections } = useSection()
  const navigate = useNavigate()

  const handleModuleClick = (sections) => {
    setSections(sections)
    navigate('/dashboard')
  }

  return (
    <>
      <UpBar showMenuIcon={false} />
      <div className='contenido-interno'>
        <FondoLogo />
        <section>
          {response && response.map(modulo => (
            <ModulosMain
              key={modulo.label}
              icon={modulo.icon}
              iconColor='#0C5795'
              bgc='#0C5795'
              label={modulo.label}
              onClick={() => handleModuleClick(modulo.secciones)}
            />
          ))}
        </section>
      </div>
    </>
  )
}

export default MainPage
