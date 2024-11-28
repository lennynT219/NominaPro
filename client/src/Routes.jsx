import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { DoubleClickTdProvider } from './assets/context/DoubleClickTd'
import { SectionDataProvider } from './assets/context/SectionData'
import { UpdateDataProvaider } from './assets/context/UpdateData'
import Dashboard from './pages/DashboardPage/Dashboard'
import Login from './pages/LoginPage/Login'
import MainPage from './pages/MainPage/Main'
import { PrivateRoute } from './routes/PrivateRoute'
import { DataUserProvider } from './assets/context/DataUser'

function App () {
  return (
    <Router>
      <Toaster richColors position='top-right' />
      <SectionDataProvider>
        <UpdateDataProvaider>
          <DataUserProvider>
            <Routes>
              <Route
                index path='/' element={
                  <PrivateRoute>
                    <MainPage />
                  </PrivateRoute>
                }
              />
              <Route
                path='/login' element={<Login />}
              />
              <Route
                path='/dashboard/*' element={
                  <DoubleClickTdProvider>
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  </DoubleClickTdProvider>
                }
              />
            </Routes>
          </DataUserProvider>
        </UpdateDataProvaider>
      </SectionDataProvider>
    </Router>
  )
}

export default App
