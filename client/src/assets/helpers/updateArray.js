export const updateArray = (setArrayLocal, setArrayDestino, rol) => {
  setArrayLocal(prevArray => prevArray.filter(item => item.NOMBRE.value !== rol.NOMBRE.value))
  // Añade el rol al array solo si no está ya presente
  setArrayDestino(prevArray => {
    if (!prevArray.some(item => item.NOMBRE.value === rol.NOMBRE.value)) {
      return [...prevArray, rol]
    }

    return prevArray
  })
}
