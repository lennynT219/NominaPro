import { ListViews } from '../../views/index'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Routes, Route } from 'react-router-dom'
import { useSection } from '@assets/context/SectionData'
import './Dashboard.css'

const Dashboard = () => {
  const { sections } = useSection()
  return (
    <DashboardLayout>
      <Routes>
        {sections.map(section =>
          section.opciones.map(opcion => (
            <Route key={opcion.url} path={opcion.url} element={ListViews(opcion.component)} />
          ))
        )}
      </Routes>
    </DashboardLayout>
  )
}

export default Dashboard
