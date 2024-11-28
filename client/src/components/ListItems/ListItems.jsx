import { Icon } from "@iconify/react-with-api";
import { useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DoubleClickTd } from "@assets/context/DoubleClickTd";

export function ListItem({
  opcion: { listItems, icon, iarrow, label, url },
  handleClick,
  isActive,
}) {
  const [isActiveList, setIsActiveList] = useState(false);
  const { setDoubleClick } = useContext(DoubleClickTd);
  const navigate = useNavigate();

  const handleClickList = useCallback(() => {
    if (listItems) {
      setIsActiveList(!isActiveList);
    } else {
      handleClick();
      navigate(url);
    }
    setDoubleClick(false);
  }, [listItems, isActiveList, handleClick, navigate, url, setDoubleClick]);

  const liClasses = [
    listItems ? "li-desplegable" : "",
    isActive && !listItems ? "active" : "",
    isActiveList && listItems ? "active" : "",
  ].join(" ");

  return (
    <li className={liClasses}>
      <a onClick={handleClickList}>
        <Icon icon={icon} />
        <span className="text">{label}</span>
        {listItems && <Icon icon={iarrow} />}
      </a>
      {listItems && (
        <ul>
          {listItems.map(({ url, label }, i) => (
            <li key={i}>
              <a onClick={() => navigate(url)}>
                <span className="text">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
