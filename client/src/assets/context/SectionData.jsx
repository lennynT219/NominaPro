import { createContext, useContext, useState } from 'react'

const SectionData = createContext()

export function SectionDataProvider ({ children }) {
  const [sections, setSections] = useState([])
  return (
    <SectionData.Provider value={{ sections, setSections }}>
      {children}
    </SectionData.Provider>
  )
}

export function useSection () {
  return useContext(SectionData)
}
