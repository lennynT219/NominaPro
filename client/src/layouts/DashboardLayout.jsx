import { SideBar, UpBar } from '@components'
import { useEffect, useState } from 'react'
import { useResize } from '../assets/hook/useResize'

export function DashboardLayout ({ children }) {
  const [activeSideBar, setActiveSideBar] = useState(false)
  const { width } = useResize()
  const handleShowSideBar = () => {
    setActiveSideBar(!activeSideBar)
  }
  useEffect(() => {
    if (width < 800) {
      setActiveSideBar(true)
    }
  }, [width])
  return (
    <main className='dashboard'>
      <SideBar hidenSidebar={activeSideBar} />
      <div className='all-content'>
        <UpBar showMenuIcon onMenuClick={handleShowSideBar} />
        <div className='content'>{children}</div>
      </div>
    </main>
  )
}
