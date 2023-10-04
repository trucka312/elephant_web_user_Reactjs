import { Row, Spin } from "antd";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProductsStore } from "../../../../store/productsStore";
import DropdownAddAttribute from "./DropdownAddAtrribute";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { tooltipDescription } from "../../../../constants/product";

const DetailInfo = React.memo(({
  selectedCategory,
  attributeList,
  setAttributeList,
  setSelectedTooltip
}) => {
  const nameFinalSelectedCategory =
    selectedCategory &&
    selectedCategory.length &&
    selectedCategory[selectedCategory.length - 1]?.name;
  const { getRecommendAttributes, recommendAttributes, loadingRecommend } =
    useProductsStore();
  const [isShowMore, setShowMore] = useState();

  useEffect(() => {
    if (nameFinalSelectedCategory)
      getRecommendAttributes(nameFinalSelectedCategory);
  }, [nameFinalSelectedCategory]);

  if (!selectedCategory && !selectedCategory?.length)
    return (
      <div
        className="bg-white rounded-sm p-4 mt-4"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}
      >
        <p className="text-[20px] font-bold text-[#999]">Thông tin chi tiết</p>
        <p className="text-[#999] mt-4">
          Có thể điều chỉnh sau khi chọn ngành hàng
        </p>
      </div>
    );

  return (
    <div
      className="bg-white p-4 mt-4"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}
      onClick={() => setSelectedTooltip(tooltipDescription.ATTRIBUTE)}
    >
      <p className="text-[20px] font-bold">Thông tin chi tiết</p>
      <p>
        Hoàn thành thông tin thuộc tính để tăng mức độ hiển thị cho sản phẩm
        <Link to="#"> Xem hướng dẫn bổ sung thuộc tính</Link>.
      </p>
      <Spin spinning={loadingRecommend}>
        {recommendAttributes && recommendAttributes.length ? (
          <Row gutter={[30, 15]} className="mt-4 transition duration-300 min-h-[50px]">
            {recommendAttributes.map((item, index) => {
              if (index >= 10 && !isShowMore) return null;
              return (
                <DropdownAddAttribute
                  key={item.name}
                  attributeList={attributeList}
                  setAttributeList={setAttributeList}
                  attribute={item}
                />
              );
            })}
          </Row>
        ) : null}
      </Spin>
      {recommendAttributes && recommendAttributes.length ? (
        <div className="text-right">
          {!isShowMore ? (
            <p
              onClick={() => setShowMore(!isShowMore)}
              className="text-right ml-auto w-fit mt-5 mr-4 cursor-pointer text-[#0e2482]"
            >
              Hiển thị đầy đủ danh sách <DownOutlined className="text-[13px]" />
            </p>
          ) : (
            <p
              onClick={() => setShowMore(!isShowMore)}
              className="text-right ml-auto w-fit mt-5 mr-4 cursor-pointer text-[#0e2482]"
            >
              Rút gọn danh sách <UpOutlined className="text-[13px]" />
            </p>
          )}
        </div>
      ) : (
        <p className="mt-4">Không có thông tin thuộc tính nào</p>
      )}
    </div>
  );
})

DetailInfo.displayName = 'DetailInfo';
export default DetailInfo;

DetailInfo.propTypes = {
  selectedCategory: PropTypes.array,
  attributeList: PropTypes.array,
  setAttributeList: PropTypes.func,
  setSelectedTooltip: PropTypes.func
};
