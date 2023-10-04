import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import PropTypes from "prop-types";
import { v4 } from "uuid";
import ImageAttribute from "./ImageAttribute";
import { tooltipDescription } from "../../../../constants/product";
import CustomInput from "../../../../components/common/custom-input";
import { formatNumber } from "../../../../utils";

const mainPropertyDefault = {
  property_name: "",
  sub_property_name: "",
  element_distributes: [
    {
      id: v4(),
      name: "",
      image_url: "",
      price: "",
      supplier_price: "",
      quantity_in_stock: "",
      sub_element_distributes: [],
    },
  ],
};

export default function Property({
  property,
  setProperty,
  setSelectedTooltip,
  baseSellerInfo,
  setBaseSellerInfo,
}) {
  const handleAddMainProperty = () => {
    setProperty(mainPropertyDefault);
  };

  const addProperty = () => {
    const newProperty = cloneProperty(property);
    if (newProperty.element_distributes?.length === 0) {
      newProperty.element_distributes?.push({
        id: v4(),
        name: "",
        image_url: "",
        price: "",
        supplier_price: "",
        quantity_in_stock: "",
        sub_element_distributes: [],
      });
    } else {
      const newProductSubProperty =
        newProperty.element_distributes?.[0].sub_element_distributes;
      newProperty.element_distributes?.push({
        id: v4(),
        name: "",
        image_url: "",
        price: "",
        supplier_price: "",
        quantity_in_stock: "",
        sub_element_distributes: newProductSubProperty.map(
          (productSubProperty) => ({
            id: v4(),
            name: productSubProperty.name,
            image_url: "",
            price: "",
            supplier_price: "",
            quantity_in_stock: "",
          })
        ),
      });
    }

    setProperty(newProperty);
  };

  const addSubProperty = () => {
    const newProperty = cloneProperty(property);
    property.element_distributes.forEach((element, index) => {
      newProperty.element_distributes[index].sub_element_distributes.push({
        id: v4(),
        name: "",
        image_url: element.image_url,
        price: "",
        supplier_price: "",
        quantity_in_stock: "",
      });
    });

    setProperty(newProperty);
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    const name = e.target.name;
    if (name === "property_name") {
      setProperty((prevProperty) => ({ ...prevProperty, [name]: value }));
    } else {
      const _value =
        value !== "" &&
        (name === "price" ||
          name === "supplier_price" ||
          name === "quantity_in_stock")
          ? formatNumber(value)
          : value;
      const newProperty = cloneProperty(property);
      newProperty.element_distributes[index][name] = _value;

      setProperty(newProperty);
    }
  };

  const handleChangeImage = (file, index) => {
    const newProperty = cloneProperty(property);
    if (
      !newProperty.element_distributes &&
      !newProperty.element_distributes.length
    )
      return;
    newProperty.element_distributes[index].image_url = file;
    if (
      property.element_distributes[index]?.sub_element_distributes?.length > 0
    ) {
      property.element_distributes[index]?.sub_element_distributes.forEach(
        (element, i) => {
          newProperty.element_distributes[index].sub_element_distributes[
            i
          ].image_url = file;
        }
      );
    }

    setProperty(newProperty);
  };

  const handleChangeSub = (e, index, indexParent) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "sub_property_name") {
      setProperty((prevProperty) => ({ ...prevProperty, [name]: value }));
    } else {
      const newProperty = cloneProperty(property);

      if (indexParent === undefined) {
        property.element_distributes?.forEach((element, i) => {
          newProperty.element_distributes[i].sub_element_distributes[index][
            name
          ] = value;
          newProperty.element_distributes[i].price = "";
          newProperty.element_distributes[i].supplier_price = "";
          newProperty.element_distributes[i].quantity_in_stock = "";
        });
      } else {
        const _value =
          value !== "" &&
          (name === "price" ||
            name === "supplier_price" ||
            name === "quantity_in_stock")
            ? formatNumber(value)
            : value;
        newProperty.element_distributes[indexParent].sub_element_distributes[
          index
        ][name] = _value;
      }

      setProperty(newProperty);
    }
  };

  const onChangeInfoBase = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setBaseSellerInfo((prev) => ({ ...prev, [name]: formatNumber(value) }));
  };

  const handleAddSubProperty = () => {
    const newProperty = cloneProperty(property);
    property.element_distributes.forEach((element, index) => {
      newProperty.element_distributes[index].sub_element_distributes.push({
        id: v4(),
        name: "",
        image_url: element.image_url,
        price: "",
        supplier_price: "",
        quantity_in_stock: "",
      });
    });

    setProperty(newProperty);
  };

  const removeSubProperty = (index) => {
    const newProperty = cloneProperty(property);
    if (
      property.element_distributes?.[0]?.sub_element_distributes?.length === 1
    ) {
      newProperty.sub_property_name = "";
      property.element_distributes.forEach((element, i) => {
        newProperty.element_distributes[i] = {
          id: v4(),
          price: "",
          supplier_price: "",
          quantity_in_stock: "",
          sub_element_distributes: [],
          name: newProperty.element_distributes[i].name,
          image_url: newProperty.element_distributes[i].image_url,
        };
      });

      setProperty(newProperty);
    } else {
      property.element_distributes.forEach((element, indexDefault) => {
        const newProductSubProperty = element.sub_element_distributes.filter(
          (propertySub, i) => i !== index
        );
        newProperty.element_distributes[indexDefault].sub_element_distributes =
          newProductSubProperty;
      });

      setProperty(newProperty);
    }
  };

  const removeProperty = (index) => {
    if (property.element_distributes?.length === 1) {
      setProperty();
    } else {
      const newProperty = cloneProperty(property);
      const newListProperties = property.element_distributes?.filter(
        (property, i) => i !== index
      );
      newProperty.element_distributes = newListProperties;

      setProperty(newProperty);
    }
  };

  const cloneProperty = (property) => {
    return JSON.parse(JSON.stringify(property));
  };

  const validatePrice = (e) => {
    const value = e.target.value;
    let textError = "";
    if (!value) {
      textError = "Vui lòng nhập giá!";
    } else if (parseInt(value.toString()?.replace(/\./g, "")) < 1000) {
      textError = "Giá trị phải ít nhất 1.000";
    } else if (parseInt(value.toString()?.replace(/\./g, "")) > 120000000) {
      textError = "Giá đã vượt quá giá trị tối đa 120.000.000";
    } else {
      textError = "";
    }
    return textError;
  };

  const validateInventory = (e) => {
    const value = e.target.value;
    let textError = "";
    if (!value) {
      textError = "Vui lòng nhập số lượng!";
    } else if (value <= 0) {
      textError = "Giá trị phải ít nhất là 1";
    } else if (value > 10000000) {
      textError = "Số lượng kho phải lớn hơn 0 và nhỏ hơn 10000000.";
    } else {
      textError = "";
    }
    return textError;
  };

  return (
    <div className="py-4 rounded-xl bg-[#fff] pb-0">
      <div
        className="flex"
        onClick={() => setSelectedTooltip(tooltipDescription.DISTRIBUTE)}
      >
        <h4 className="text-[16px] text-[#21409A] w-[200px]">
          Phân loại sản phẩm
        </h4>
        <div className="w-full">
          {property ? (
            <>
              <div className="flex bg-[#E2E8F04D] rounded-t-md w-full py-2 border-b border-gray-200 font-semibold">
                <div className="w-[35%] pr-4 pl-4">Tên phân loại chính</div>
                <div className="w-full flex">
                  <div className="w-[50%] pr-4">Giá trị</div>
                  <div className="w-[35%] pr-4 text-center">Hình ảnh</div>
                  <div className="w-[15%]">Hành động</div>
                </div>
              </div>
              <div className="flex w-full py-5 bg-[#E2E8F04D] rounded-b-md">
                <div className="w-[35%] pr-4 h-[34px] flex pl-4">
                  <Input
                    required
                    showCount
                    maxLength={14}
                    value={property.property_name || ""}
                    name="property_name"
                    placeholder="VD Màu sắc v.v"
                    onChange={(e) => handleChange(e)}
                  />
                </div>
                <div className="w-full flex flex-col gap-y-5">
                  {property.element_distributes?.length > 0
                    ? property.element_distributes?.map((p, index) => (
                        <div className="w-full flex items-start" key={p.id}>
                          <div className="w-[50%] pr-4">
                            <Input
                              required
                              showCount
                              maxLength={20}
                              name="name"
                              placeholder="VD Trắng, Đỏ v.v"
                              value={p.name}
                              onChange={(e) => handleChange(e, index)}
                            />
                          </div>
                          <div className="w-[35%] pr-4 text-center flex justify-center">
                            <ImageAttribute
                              defaultImage={p.image_url || ""}
                              handleChangeImage={handleChangeImage}
                              index={index}
                            />
                          </div>
                          <div className="w-[15%] pr-4 text-center">
                            {" "}
                            <Button
                              color="red"
                              appearance="primary"
                              onClick={() => removeProperty(index)}
                              icon={<DeleteOutlined />}
                              danger
                            ></Button>
                          </div>
                        </div>
                      ))
                    : null}
                  <div className="w-full flex items-center">
                    <Button
                      // type="primary"
                      className="font-medium rounded-md text-sm text-center"
                      onClick={addProperty}
                      icon={<PlusOutlined />}
                      type="primary"
                      ghost
                    >
                      Thêm
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {!property ? (
            <Button
              type="primary"
              className="font-medium rounded-md text-sm text-center"
              onClick={handleAddMainProperty}
            >
              Thêm nhóm phân loại
            </Button>
          ) : null}
          {property &&
          property.element_distributes?.[0]?.sub_element_distributes?.length >
            0 ? (
            <div className="mt-4 bg-[#E2E8F04D] rounded-md">
              <div className="flex w-full py-2 border-b border-gray-200">
                <div className="w-[35%] pr-4 font-medium pl-4">
                  Tên phân loại phụ
                </div>
              </div>
              <div className="flex w-full py-5 ">
                <div className="w-[35%] pr-4 flex items-start pl-4">
                  <Input
                    required
                    showCount
                    maxLength={14}
                    value={property.sub_property_name || ""}
                    name="sub_property_name"
                    placeholder="VD Size v.v"
                    onChange={(e) => handleChangeSub(e)}
                  />
                </div>
                <div className="w-full flex flex-col gap-y-5">
                  {property.element_distributes[0]?.sub_element_distributes
                    ?.length > 0 &&
                    property.element_distributes[0]?.sub_element_distributes?.map(
                      (p, index) => (
                        <div className="w-full flex " key={p.id}>
                          <div className="w-[50%] pr-4">
                            {" "}
                            <Input
                              required
                              showCount
                              maxLength={20}
                              name="name"
                              placeholder="VD S, M v.v"
                              value={p.name}
                              onChange={(e) => handleChangeSub(e, index)}
                            />
                          </div>
                          <div className="w-[35%] pr-4"></div>
                          <div className="w-[15%]  text-center pr-4">
                            {" "}
                            <Button
                              color="red"
                              appearance="primary"
                              onClick={() => removeSubProperty(index)}
                              icon={<DeleteOutlined />}
                              danger
                            ></Button>
                          </div>
                        </div>
                      )
                    )}
                  <div className="w-full flex items-center">
                    <Button
                      className="font-medium rounded-md text-sm text-center"
                      onClick={addSubProperty}
                      icon={<PlusOutlined />}
                      type="primary"
                      ghost
                    >
                      Thêm
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {property &&
          property.element_distributes?.[0]?.sub_element_distributes?.length ===
            0 ? (
            <Button
              type="primary"
              className="font-medium rounded-md text-sm text-center mt-3"
              onClick={handleAddSubProperty}
            >
              Thêm nhóm phân loại phụ
            </Button>
          ) : null}
        </div>
      </div>
      {property ? (
        <>
          <div className="mt-10 flex">
            <h4 className="text-[16px] text-[#21409A] w-[200px]">
              Thuộc tính sản phẩm
            </h4>
            <div className="w-full bg-[#E2E8F04D] rounded-md">
              <div className="flex w-full py-2 border-b border-gray-200 font-semibold pl-4">
                <div className="w-[25%] pr-4">Tên thuộc tính</div>
                <div className="w-[35%] pr-4">Giá bán lẻ</div>
                {/* <div className="w-[25%] pr-4">Giá nhập</div> */}
                <div className="w-[35%]">
                  Số lượng tồn kho
                  <p className="text-[12px] font-normal text-gray-500 ">
                    (Số lượng sẽ được thêm vào kho mặc định)
                  </p>
                </div>
              </div>
              {property ? (
                <>
                  <div className="flex w-full pb-5 flex-col gap-y-3 pl-4">
                    {property.element_distributes?.length > 0
                      ? property.element_distributes?.map((p, index) => {
                          if (
                            p.name !== "" &&
                            p.name !== null &&
                            (p.sub_element_distributes?.length === 0 ||
                              (p.sub_element_distributes?.length > 0 &&
                                p.sub_element_distributes.some(
                                  (productChild) =>
                                    productChild.name !== "" &&
                                    productChild.name !== null
                                ) === false))
                          ) {
                            return (
                              <div
                                className="w-full flex items-center"
                                key={p.id}
                              >
                                <div className="w-[25%] pr-4">{p.name}</div>
                                <div className="w-[35%] pr-4">
                                  <Input
                                    required
                                    prefix="₫"
                                    name="price"
                                    placeholder="Nhập giá bán lẻ..."
                                    value={p.price}
                                    onChange={(e) => handleChange(e, index)}
                                  />
                                </div>
                                {/* <div className="w-[25%] pr-4">
                              <Input
                                name="supplier_price"
                                placeholder="Nhập giá nhập..."
                                value={p.supplier_price}
                                onChange={(e) => handleChange(e, index)}
                              />
                            </div> */}
                                <div className="w-[35%] pr-4">
                                  <Input
                                    required
                                    name="quantity_in_stock"
                                    placeholder="Nhập số lượng tồn kho..."
                                    value={p.quantity_in_stock}
                                    onChange={(e) => handleChange(e, index)}
                                  />
                                </div>
                              </div>
                            );
                          } else if (p.name !== "" && p.name !== null) {
                            return p.sub_element_distributes.map(
                              (productChild, indexChild) => {
                                return (
                                  <div
                                    className="w-full flex items-center"
                                    key={productChild.id}
                                  >
                                    <div className="w-[25%] pr-4">{`${p.name}${
                                      productChild.name
                                        ? ` - ${productChild.name}`
                                        : ""
                                    }`}</div>
                                    <div className="w-[35%] pr-4">
                                      {" "}
                                      <Input
                                        required
                                        prefix="₫"
                                        name="price"
                                        placeholder="Nhập giá bán lẻ..."
                                        value={productChild.price}
                                        onChange={(e) =>
                                          handleChangeSub(e, indexChild, index)
                                        }
                                      />
                                    </div>
                                    {/* <div className="w-[25%] pr-4">
                                    
                                 <Input
                                    showCount
                                    maxLength={20}
                                    name="supplier_price"
                                    placeholder="Nhập giá nhập..."
                                    value={productChild.supplier_price}
                                    onChange={(e) =>
                                      handleChangeSub(e, indexChild, index)
                                    }
                                  />
                                </div> */}
                                    <div className="w-[35%] pr-4">
                                      {" "}
                                      <Input
                                        required
                                        showCount
                                        maxLength={20}
                                        name="quantity_in_stock"
                                        placeholder="Nhập số lượng tồn kho..."
                                        value={productChild.quantity_in_stock}
                                        onChange={(e) =>
                                          handleChangeSub(e, indexChild, index)
                                        }
                                      />
                                    </div>
                                  </div>
                                );
                              }
                            );
                          } else {
                            return <div key={p.id}></div>;
                          }
                        })
                      : null}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </>
      ) : null}
      {!property ? (
        <div className="flex mt-5">
          <h4 className="text-[16px] text-[#21409A] w-[160px]">
            {<span className="text-[#ff4d4f]">* </span>}Giá
          </h4>
          <CustomInput
            placeholder="Nhập giá"
            name="price"
            // type="number"
            className="w-[300px]"
            value={baseSellerInfo?.price}
            validate={validatePrice}
            onChange={onChangeInfoBase}
            prefix="₫"
          />
        </div>
      ) : null}
      {!property ? (
        <div className="flex mt-5">
          <h4 className="text-[16px] text-[#21409A] w-[160px]">
            {<span className="text-[#ff4d4f]">* </span>}Kho hàng
          </h4>
          <div>
            <CustomInput
              placeholder="Nhập số lượng kho"
              name="stock"
              // type="number"
              className="w-[300px]"
              value={baseSellerInfo?.stock}
              validate={validateInventory}
              onChange={onChangeInfoBase}
            />
            <p className="text-[#999] mt-1">
              Lưu ý: số lượng sẽ được thêm vào kho mặc định
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

Property.propTypes = {
  property: PropTypes.object,
  setProperty: PropTypes.func,
  setSelectedTooltip: PropTypes.func,
  baseSellerInfo: PropTypes.object,
  setBaseSellerInfo: PropTypes.func,
};
