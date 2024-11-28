const excelEmpleado = async (req, res) => {
  try {
    res.status(200).send('Excel generado correctamente')
  } catch (err) {
    console.log(err)
  }
}

export {
  excelEmpleado
}
