import { Tooltip } from "antd";
import PropTypes from "prop-types";
import { IconChevronRight } from "../../../assets/icons";

export default function CategoryItem({ category, selectedId, onClick }) {
  const { display_name, main_id } = category;
  const hasChildren = category && category.children?.length ? true : false;
  return (
    <div>
      <div
        className={`flex justify-between w-[270px] text-[15px] cursor-pointer hover:bg-[#f6f8fa] py-[8px] px-[16px] group  ${
          selectedId === main_id ? "text-[#21409A] font-medium" : "text-[#333]"
        }`}
        onClick={() => onClick(main_id)}
      >
        <span className="group-hover:text-[#21409A]">
          {display_name}{" "}
        </span>
        {hasChildren ? (
          <Tooltip title="Xem danh mục con" color={"blue"}>
            <IconChevronRight
              className={`w-[18px] group-hover:text-[#21409A] ${
                selectedId === main_id ? "text-[#21409A] font-medium" : "text-[#333]"
              }`}
            />
          </Tooltip>
        ) : null}
      </div>
      {/* (
          <Tooltip title="Thêm danh mục con" color={"blue"}>
            <PlusIcon
              className={`w-[16px] h-[18px] group-hover:text-[#21409A] ${
                selectedId === id ? "text-[#21409A]" : "text-[#888]"
              }`}
            />
          </Tooltip>
        ) */}
    </div>
  );
}

CategoryItem.propTypes = {
  category: PropTypes.object,
  selectedId: PropTypes.number,
  setSelectedId: PropTypes.func,
  onClick: PropTypes.func,
};
