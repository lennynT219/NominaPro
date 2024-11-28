import Excel from 'exceljs'

const createSendExcel = async (data, res, creador, nameWorksheet) => {
  console.log(data)
  const workbook = new Excel.Workbook()
  workbook.creator = creador || 'Anonimo'
  workbook.created = new Date()

  const worksheet = workbook.addWorksheet(nameWorksheet || 'Sheet 1', {
    properties: { tabColor: { argb: 'FF00FF00' } },
    views: [{ state: 'frozen', ySplit: 1 }]
  })

  const keys = Object.keys(data[0])
  worksheet.columns = keys.map(key => {
    return { header: key, key, width: 20 }
  })

  data.forEach(element => {
    const row = {}
    keys.forEach(key => {
      if (Array.isArray(element[key].value)) {
        row[key] = countValues(element[key].value, key)
      } else {
        row[key] = element[key].value
      }
    })
    worksheet.addRow(row)
  })

  // Configura los encabezados para la descarga
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  )
  res.setHeader('Content-Disposition', 'attachment; filename=data.xlsx')

  // Envía el archivo Excel
  await workbook.xlsx.write(res)
  res.end()
}

const countValues = (list, head) => {
  switch (head) {
    case 'CARGAS FAMILIARES':
      return list.length
    case 'CARGO':
      return list[list.length - 1]?.CARGO.value
    default:
      return list.length > 0 ? 'SI' : 'NO'
  }
}

export {
  createSendExcel
}
