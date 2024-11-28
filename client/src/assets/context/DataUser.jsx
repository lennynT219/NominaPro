/* eslint-disable camelcase */
import { createContext, useContext, useEffect } from 'react'
import { url_getDataUser } from '../api/empleado.routes'
import { useGet } from '../hook/useData'
const DataUser = createContext()

export function DataUserProvider({ children }) {
  const { response, error } = useGet(url_getDataUser)
  useEffect(() => {
    if (error?.response.data?.message === 'Token no válido') {
      localStorage.removeItem('token')
    }
  }, [error])
  return (
    <DataUser.Provider value={{ response }}>
      {children}
    </DataUser.Provider>
  )
}

export function useDataUser() {
  return useContext(DataUser)
}
