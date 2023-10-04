import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import PropTypes from "prop-types";
import CustomInput from "../../../../components/common/custom-input";
import { formatNumber } from "../../../../utils";

const initPriceRange = {
  from: "",
  to: "",
  price: "",
};

export default function Discount({retailPrice, discountList, setDiscountList}) {
  console.log('retailPrice: ', retailPrice);

  const addInitPriceRange = (item) => {
    if (!item) setDiscountList([initPriceRange]);
    else {
      const { from, to } = item;
      const newPrice = {
        from: to ? (parseInt(to) + 1).toString() : parseInt(from) + 1,
        to: "",
        price: "",
      };
      setDiscountList((prev) => [...prev, newPrice]);
    }
  };

  const onDeleteItem = (index) => {
    const updatedDiscountList = [...discountList];
    updatedDiscountList.splice(index, 1);
    if (index < updatedDiscountList.length && updatedDiscountList[index].to) {
      updatedDiscountList[index].from = (
        parseFloat(updatedDiscountList[index - 1]?.to || 0) + 1
      ).toString();
    }

    let nextIndex = index + 1;
    while (
      nextIndex < updatedDiscountList.length &&
      !updatedDiscountList[nextIndex].to
    ) {
      updatedDiscountList[nextIndex].from = (
        parseFloat(updatedDiscountList[nextIndex - 1]?.to || 0) + 1
      ).toString();
      nextIndex += 1;
    }

    setDiscountList(updatedDiscountList);
  };

  const onChangeInput = (e, index) => {
    const name = e.target.name;
    const value = e.target.value;
    const updatedDiscountList = [...discountList];
    updatedDiscountList[index] = {
      ...updatedDiscountList[index],
      [name]: name === "price" ? formatNumber(value) : value,
    };

    if (name === "to") {
      let nextIndex = index + 1;
      if (nextIndex === updatedDiscountList.length && !value) {
        setDiscountList(updatedDiscountList);
        return;
      }

      if (value === "") {
        updatedDiscountList[nextIndex].from = (
          parseFloat(updatedDiscountList[index].from) + 1
        ).toString();
      } else if (
        nextIndex < updatedDiscountList.length &&
        updatedDiscountList[nextIndex].to
      ) {
        updatedDiscountList[nextIndex].from = (
          parseFloat(value) + 1
        ).toString();
      } else {
        let nextFromValue = parseFloat(value) + 1;
        const currentToValue = value;

        while (nextIndex < updatedDiscountList.length) {
          const nextToValue = updatedDiscountList[nextIndex].to;
          if (
            !nextToValue ||
            parseFloat(nextToValue) === parseFloat(currentToValue)
          ) {
            updatedDiscountList[nextIndex].from = nextFromValue.toString();
            nextFromValue += 1;
            nextIndex += 1;
          } else {
            break;
          }
        }
      }
    }
    setDiscountList(updatedDiscountList);
  };

  //validate số lượng
  const validate = (e, index) => {
    const value = e.target.value;
    const name = e.target.name;
    let textError = "";
    if (!value) {
      textError = "Không được để trống ô!";
    } else if (index === 0 && parseInt(value) < 2) {
      textError = "Số lượng ít nhất cho giá bán buôn/sỉ phải lớn hơn 1";
    } else if (parseInt(value) < parseInt(discountList[index]?.from) && name === "to") {
      textError = "Giá trị không được nhỏ hơn số lượng bắt đầu";
    } else {
      textError = "";
    }
    return textError;
  };

  //validate giá nhập
  const validatePriceRange = (e, index) => {
    const value = e.target.value;
    let textError = "";
    if (!value) {
      textError = "Không được để trống ô!";
    }
    else if (index === 0 && parseInt(value.toString()?.replace(/\./g, '')) >= parseInt(retailPrice.toString()?.replace(/\./g, ''))) {
      textError = "Giá trị phải nhỏ hơn giá bán lẻ";
    }
     else if (parseInt(value.toString()?.replace(/\./g, '')) >= parseInt(discountList[index - 1]?.price.toString()?.replace(/\./g, ''))) {
      textError = "Giá trị phải nhỏ hơn khoảng giá trước";
    } else {
      textError = "";
    }
    return textError;
  };

  if (discountList && !discountList.length)
    return (
      <div className="ml-[-40px]">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => addInitPriceRange()}
        >
          Thêm khoảng giá
        </Button>
        <p className="text-[#999] mt-1">
          Mua nhiều giảm giá sẽ bị ẩn khi sản phẩm đang tham gia Mua Kèm Deal
          Sốc hay Combo Khuyến Mãi
        </p>
      </div>
    );

  return (
    <div className="w-full bg-[#E2E8F04D] rounded-md">
      <div className="flex w-full py-2 border-b border-gray-200 font-semibold">
        <div className="w-[16%] pr-4 pl-4">Khoảng giá</div>
        <div className="w-[24%] pr-4">Từ (sản phẩm)</div>
        <div className="w-[24%] pr-4">Đến (sản phẩm)</div>
        <div className="w-[24%] pr-4">Đơn Giá</div>
        <div className="w-[12%] pr-4 text-center">Thao tác</div>
      </div>
      <div className="py-5">
        {discountList &&
          discountList.length &&
          discountList.map((item, index) => {
            const { from, to, price } = item;
            return (
              <div key={index} className="min-h-[60px]">
                <div>
                  <div className="flex w-full items-start">
                    <div className="w-[16%] pr-4 pl-4">
                      Khoảng giá {index + 1}
                    </div>
                    <div className="w-[24%] pr-4">
                      <CustomInput
                        placeholder="Từ (sản phẩm)"
                        name="from"
                        type="number"
                        value={from}
                        validate={validate}
                        onChange={onChangeInput}
                        disabled={index !== 0}
                        index={index}
                      />
                    </div>
                    <div className="w-[24%] pr-4">
                      <CustomInput
                        placeholder="Đến (sản phẩm)"
                        name="to"
                        type="number"
                        value={to}
                        validate={validate}
                        onChange={onChangeInput}
                        index={index}
                      />
                    </div>
                    <div className="w-[24%] pr-4">
                      <CustomInput
                        placeholder="Đơn Giá"
                        name="price"
                        // type="number"
                        value={price}
                        validate={validatePriceRange}
                        onChange={onChangeInput}
                        index={index}
                        prefix="₫"
                      />
                    </div>
                    <div className="w-[12%] pr-4 text-center">
                      <Button
                        color="red"
                        appearance="primary"
                        onClick={() => onDeleteItem(index)}
                        icon={<DeleteOutlined />}
                        danger
                      ></Button>
                    </div>
                  </div>
                </div>
                {index === discountList.length - 1 && index < 5 && (
                  <div>
                    <div className="flex w-full py-2">
                      <div className="w-[16%] pr-4  pl-4">
                        Khoảng giá {index + 2}
                      </div>
                      <div className="w-[24%] pr-4">
                        <Button
                          type="primary"
                          className="font-medium rounded-md text-sm text-center"
                          onClick={() => addInitPriceRange(item)}
                          icon={<PlusOutlined />}
                          ghost
                        >
                          Thêm khoảng giá
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}

Discount.propTypes = {
  retailPrice: PropTypes.number,
  discountList: PropTypes.array,
  setDiscountList: PropTypes.func,
};
