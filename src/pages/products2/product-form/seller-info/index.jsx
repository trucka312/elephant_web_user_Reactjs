import PropTypes from "prop-types";
import Discount from "./Discount";
import Property from "./Property";
import React from "react";

const SellerInfo = React.memo(({
  selectedCategory,
  property,
  setProperty,
  discountList,
  setDiscountList,
  setSelectedTooltip,
  baseSellerInfo,
  setBaseSellerInfo,
}) => {
  const checkAllPricesAreEqual = (data) => {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }

    let firstPrice = null;
    let hasSubProperty = false;

    for (const item of data) {
      const subProperty = item.sub_element_distributes;

      if (Array.isArray(subProperty) && subProperty.length > 0) {
        const subPrices = subProperty.map((subItem) =>
          subItem.price?.toString()
        );
        if (subPrices.some((subPrice) => subPrice !== subPrices[0])) {
          return false;
        }
        hasSubProperty = true;
      } else if (firstPrice === null) {
        const price = item.price?.toString();
        if (price === "") {
          return false;
        }
        firstPrice = price;
      } else {
        const price = item.price?.toString();
        if (price !== firstPrice) {
          return false;
        }
      }
    }

    return hasSubProperty || firstPrice !== null;
  };

  const getRetailPrice = () => {
    const getPrice = (data) => {
      if (data.price !== null && data.price !== undefined && data.price) {
        return data.price;
      } else {
        const subElementWithPrice =
          data.sub_element_distributes &&
          data.sub_element_distributes.length &&
          data.sub_element_distributes.find(
            (subElement) =>
              subElement.price !== null && subElement.price !== undefined
          );
        return subElementWithPrice ? subElementWithPrice.price : null;
      }
    };
    if (!property && !property?.element_distributes?.length) return baseSellerInfo?.price;
    else {
      let price = 0;
      for (const item of property?.element_distributes) {
        const price = getPrice(item);
        if (price) return price;
      }
      return price;
    }
  };

  if (!selectedCategory && !selectedCategory?.length)
    return (
      <div
        className="bg-white rounded-sm p-4 mt-4"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}
      >
        <p className="text-[20px] font-bold text-[#999]">Thông tin bán hàng</p>
        <p className="text-[#999] mt-4">
          Có thể điều chỉnh sau khi chọn ngành hàng
        </p>
      </div>
    );

  return (
    <div
      className="bg-white rounded-sm p-4 mt-8"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}
    >
      <p className="text-[20px] font-bold">Thông tin bán hàng</p>
      <Property
        property={property}
        setProperty={setProperty}
        setSelectedTooltip={setSelectedTooltip}
        baseSellerInfo={baseSellerInfo}
        setBaseSellerInfo={setBaseSellerInfo}
      />
      <div className=" mt-4 flex">
        <h4 className="text-[16px] mb-3 text-[#21409A] w-[200px]">
          Mua nhiều giảm giá
        </h4>
        {!property || checkAllPricesAreEqual(property?.element_distributes) ? (
          <Discount
            retailPrice={getRetailPrice()}
            discountList={discountList}
            setDiscountList={setDiscountList}
          />
        ) : (
          <p className="text-[#999] ml-[-40px] mt-[2px]">
            Giá sỉ chỉ có thể được thiết lập khi các phân loại hàng đồng giá.
          </p>
        )}
      </div>
    </div>
  );
})

SellerInfo.displayName = 'SellerInfo';
export default SellerInfo;

SellerInfo.propTypes = {
  selectedCategory: PropTypes.array,
  property: PropTypes.object,
  setProperty: PropTypes.func,
  discountList: PropTypes.array,
  setDiscountList: PropTypes.func,
  setSelectedTooltip: PropTypes.func,
  baseSellerInfo: PropTypes.object,
  setBaseSellerInfo: PropTypes.func,
};
