import { useEffect, useState } from 'react'

function useMediaQuery () {
  const [iconSize, setIconSize] = useState('150px')

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth < 450) {
        setIconSize('90px')
      } else if (window.innerWidth < 1000) {
        setIconSize('120px')
      } else {
        setIconSize('150px')
      }
    }

    window.addEventListener('resize', updateSize)
    updateSize() // Inicializar al montar

    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return iconSize
}

export {
  useMediaQuery
}
