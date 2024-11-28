import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { UpdateData } from '../context/UpdateData'

const useGet = (url, query) => {
  const { updateDataTrigger } = useContext(UpdateData)
  const [response, setResponse] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          params: query
        })
        setResponse(res.data)
        setError(null)
      } catch (err) {
        setError(err)
        setResponse([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [url, updateDataTrigger, query])
  const { values, modelo } = response
  return { response, values, modelo, isLoading, error }
}

const usePost = (url, data, activarPeticion, setActivarPeticion) => {
  const { setUpdateDataTrigger } = useContext(UpdateData)
  const [response, setResponse] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!activarPeticion) return
      setIsLoading(true)
      try {
        const res = await axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setResponse(res.data)
        setUpdateDataTrigger(prev => !prev)
      } catch (err) {
        console.log('Error al enviar la información:', err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
    setActivarPeticion(false)
  }, [activarPeticion])
  return { response, isLoading, error }
}

const usePut = (url, data, activarPeticion, setActivarPeticion) => {
  const { setUpdateDataTrigger } = useContext(UpdateData)
  const [response, setResponse] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      if (!activarPeticion) return
      setIsLoading(true)
      try {
        const res = await axios.put(url, data, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        setResponse(res.data)
        setUpdateDataTrigger(prev => !prev)
      } catch (err) {
        console.log('Error al enviar la información:', err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
    setActivarPeticion(false)
  }, [activarPeticion])
  return { response, isLoading, error }
}

const useDelete = async (url, activarPeticion, setActivarPeticion) => {
  const { setUpdateDataTrigger } = useContext(UpdateData)
  const [response, setResponse] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      if (!activarPeticion) return
      setIsLoading(true)
      try {
        const res = await axios.delete(url, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        setResponse(res.data)
        setUpdateDataTrigger(prev => !prev)
      } catch (err) {
        console.log('Error al enviar la información:', err)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
    setActivarPeticion(false)
  }, [activarPeticion])
  return { response, isLoading, error }
}

const useGetFile = async (url, query, fileName) => {
  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      params: query,
      responseType: 'blob'
    })

    let fileExtension = ''
    let mimeType = ''

    switch (query.download) {
      case 'Excel':
        fileExtension = 'xlsx'
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        break
      case 'PDF':
        fileExtension = 'pdf'
        mimeType = 'application/pdf'
        break
      case 'Texto':
        fileExtension = 'txt'
        mimeType = 'text/plain'
        break
      default:
        throw new Error('Tipo de archivo no soportado')
    }

    const date = new Date().toISOString().split('T')[0] // Formato YYYY-MM-DD
    const completeFileName = `${fileName}_${date}.${fileExtension}`

    const blob = new Blob([res.data], { type: mimeType })
    const downloadUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = completeFileName
    a.click()
    window.URL.revokeObjectURL(downloadUrl)
  } catch (err) {
    console.log(err)
  }
}

export {
  useGet,
  usePost,
  usePut,
  useDelete,
  useGetFile
}
