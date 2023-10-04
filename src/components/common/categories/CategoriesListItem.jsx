import PropTypes from "prop-types";
import { useState } from "react";
import Scrollbars from "react-custom-scrollbars";
import CategoryItem from "./CategoryItem";

export default function CategoriesListItem({
  id, // main_id
  categoriesList,
  setSelectedList,
  selectedList,
  pos,
}) {
  const [selectedId, setSelectedId] = useState(id);

  const getChildren = (id) => {
    const categoriesSelect =
      categoriesList && categoriesList.length
        ? categoriesList.filter((item) => item.main_id === id)
        : [];
    if (!categoriesSelect.length) return null;
    return categoriesSelect[0].children;
  };

  const getCategoryNameById = (id) => {
    const categoriesSelect =
      categoriesList && categoriesList.length
        ? categoriesList.filter((item) => item.main_id === id)
        : [];
    if (!categoriesSelect.length) return null;
    return categoriesSelect[0].name;
  };

  const handleChangeId = (id) => {
    setSelectedId(id);
    let newSelectedList = selectedList.slice();
    if (pos === 0) {
      newSelectedList = selectedList.slice(0, 1);
      if (newSelectedList.length !== 1) {
        newSelectedList = [];
        selectedList.forEach((item, index) => {
          if (index < pos) newSelectedList.push(item);
        });
      }
    } else {
      newSelectedList = selectedList.slice(0, pos + 1);
    }
    const element = {
      id: id,
      children: getChildren(id),
      name: getCategoryNameById(id),
    };
    newSelectedList.push(element);
    setSelectedList(newSelectedList);
  };

  if (!categoriesList || !categoriesList.length) return null;
  return (
    <div className="border-r-[2px] border-solid border-l-0 border-b-0 border-t-0 w-fit border-[#f5f5f5] flex">
      <Scrollbars style={{ height: "490px", width: "270px" }}>
        <div className="relative">
          {categoriesList && categoriesList.length
            ? categoriesList.map((item) => {
                return (
                  <CategoryItem
                    key={item.id}
                    category={item}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    onClick={handleChangeId}
                  />
                );
              })
            : null}
          {/* <div className="text-center absolute left-[50%] translate-x-[-50%] text-[#21409A] font-bold cursor-pointer bg-[#21409A1A] w-full py-[10px]">
            Thêm
          </div> */}
        </div>
      </Scrollbars>
    </div>
  );
}

CategoriesListItem.propTypes = {
  id: PropTypes.id,
  categoriesList: PropTypes.array,
  selectedCategory: PropTypes.array,
  setSelectedList: PropTypes.func,
  selectedList: PropTypes.array,
  pos: PropTypes.number,
};
