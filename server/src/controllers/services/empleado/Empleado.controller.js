const getRolesByEmpleadoId = async (req, res) => {
  try {
    const { ci_em } = req.params
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

export {
  getRolesByEmpleadoId
}
