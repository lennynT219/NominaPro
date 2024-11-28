import { createContext, useState } from 'react'

export const DoubleClickTd = createContext()

export function DoubleClickTdProvider ({ children }) {
  const [doubleClick, setDoubleClick] = useState(false)

  return (
    <DoubleClickTd.Provider value={{
      doubleClick,
      setDoubleClick
    }}
    >
      {children}
    </DoubleClickTd.Provider>
  )
}
