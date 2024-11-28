import { Td } from '../Td/Td'

export function Tr (
  {
    handleClick,
    isActive,
    row,
    keys,
    moreInformation,
    setDoubleClick
  }
) {
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

  const handleClikTd = (list) => {
    moreInformation(list)
    setDoubleClick(true)
  }

  return (
    <tr
      onClick={handleClick}
      className={isActive ? 'activeBag' : ''}
    >
      {keys.map((key) => (
        <Td
          key={key}
          handleClickTd={
            Array.isArray(row[key]?.value) && row[key]?.value.length > 0
              ? () => handleClikTd(row[key])
              : undefined
          }
          type={row[key]?.type}
          name={row[key]?.name}
          estado={row[key]?.estado}
          childrenIsArray={Array.isArray(row[key]?.value) || row[key]?.blockEdit}
          minlength={row[key]?.minlength}
          maxlength={row[key]?.maxlength}
          id={row[key]?.id || row.CEDULA?.value || row.ID?.value || row.NOMBRE?.value}
          modelo={row[key]?.modelo}
          opciones={row[key]?.opciones}
        >
          {Array.isArray(row[key]?.value) ? countValues(row[key]?.value, key) : row[key]?.value}
        </Td>
      ))}
    </tr>
  )
}
