import { useEffect, useState } from "react";
import CategoriesListItem from "./CategoriesListItem";
import { useCategoriesStore } from "../../../store/categoriesStore";
import Loading from "../../loading/Index";
import { alerts } from "../../../utils/alerts";
import PropTypes from "prop-types";
import { Button } from "antd";
import Scrollbars from "react-custom-scrollbars";

export default function Categories({
  selectedCategory,
  handleSelectCategory,
  onCancel,
}) {
  const { getAllCategories, loading } = useCategoriesStore((state) => state);
  const categories = JSON.parse(localStorage.getItem("categories"));
  const initialSelectedList =
  selectedCategory && selectedCategory?.length && selectedCategory[0].name
      ? selectedCategory
      : selectedCategory?.slice(0) || [];

  const [selectedList, setSelectedList] = useState([
    {
      id: null,
      name: null,
      children: categories,
    },
    ...initialSelectedList,
  ]);

  useEffect(() => {
    if (!categories) {
      const onSuccess = (res) => {
        console.log(res);
      };
      const onFail = (err) => {
        alerts.error(err);
      };
      getAllCategories(onSuccess, onFail);
    }
  }, []);

  return (
    <div className="mt-4 px-5">
      <p className="my-5 font-semibold text-[20px]">Danh mục sản phẩm</p>
      {loading ? <Loading /> : null}
      <Scrollbars style={{ height: "500px" }}>
        <div className="flex">
          {selectedList && selectedList.length
            ? selectedList.map((item, index) => {
                const nextId = selectedList[index + 1]?.id;
                if (index !== 0 && item.id === null) return null;
                return (
                  <CategoriesListItem
                    key={index}
                    id={nextId}
                    categoriesList={item?.children}
                    setSelectedList={setSelectedList}
                    selectedList={selectedList}
                    pos={index}
                  />
                );
              })
            : null}
        </div>
      </Scrollbars>
      <div className="flex gap-2 justify-end w-full mt-4">
        <Button onClick={onCancel}>Hủy</Button>
        <Button
          type="primary"
          disabled={selectedList[selectedList.length - 1]?.children?.length}
          onClick={() => handleSelectCategory(selectedList)}
        >
          Đồng ý
        </Button>
      </div>
    </div>
  );
}

Categories.propTypes = {
  selectedCategory: PropTypes.array,
  handleSelectCategory: PropTypes.func,
  onCancel: PropTypes.func,
};
