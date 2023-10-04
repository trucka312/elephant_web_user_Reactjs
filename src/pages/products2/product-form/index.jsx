import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Form, Spin, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import LightBulbIcon from "../../../assets/icons/LightBulbIcon.jsx";
import { tooltipDescription } from "../../../constants/product.js";
import { useProductsStore } from "../../../store/productsStore.js";
import { alerts } from "../../../utils/alerts.js";
import {
  findParentsByChildrenId,
  formatNumber,
  getPathByIndex,
} from "../../../utils/index.js";
import BasicInfo from "./BasicInfo.jsx";
import TransportInfo from "./TransportInfo.jsx";
import DetailInfo from "./detail-info/index.jsx";
import SellerInfo from "./seller-info/index.jsx";

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 24 } };

export default function ProductForm() {
  const productId = getPathByIndex(3);
  const navigate = useNavigate();
  const {
    createProduct,
    loadingById,
    getProductsById,
    productById,
    loading,
    updateProduct,
    getAllForbiddenWord,
    resetInitValue,
  } = useProductsStore();
  const categories = useMemo(() => {
    return JSON.parse(localStorage.getItem("categories"));
  }, []);

  // state
  const [selectedCategory, setSelectedCategory] = useState();
  const [attributeList, setAttributeList] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [videoProduct, setVideoProduct] = useState();
  const [nameProduct, setNameProduct] = useState("");
  const [property, setProperty] = useState();
  const [discountList, setDiscountList] = useState([]);
  const [selectedTooltip, setSelectedTooltip] = useState(
    tooltipDescription.IMAGE
  );
  const [sidebarWidth, setSidebarWidth] = useState();
  const [baseSellerInfo, setBaseSellerInfo] = useState(null);
  const [shipments, setShipments] = useState([0, 1]);

  // lấy danh sách từ cấm
  useEffect(() => {
    if (productId) {
      const onSuccess = () => {};
      const onFail = (err) => {
        alerts.error(err);
      };
      getProductsById(productId, onSuccess, onFail);
    }
    getAllForbiddenWord();
  }, []);

  useEffect(() => {
    const container = document.querySelector(".ant-layout-sider-children");
    if (container) {
      const containerWidth = container.clientWidth;
      setSidebarWidth(containerWidth);
    }
  }, []);

  // set các giá trị khởi tạo cho form update
  useEffect(() => {
    if (productById && productId) {
      // initial data
      const initialProductImages =
        productById?.images?.length && productId
          ? productById?.images.map((item) => item.image_url)
          : [];
      const initialVideoProduct =
        productById?.video_url && productId ? productById?.video_url : "";
      const initialSelectedCategory =
        productById?.categories?.length && productId
          ? findParentsByChildrenId(
              categories,
              productById?.categories[0]?.main_id
            )
          : [];
      const initialNameProduct =
        productById?.name && productId ? productById?.name : "";
      const initialProperty =
        productById?.distributes && productById?.distributes.length && productId
          ? {
              ...handleConvertProperty(productById?.distributes[0]),
              property_name: productById?.distributes[0]?.name,
              sub_property_name:
                productById?.distributes[0]?.sub_element_distribute_name,
            }
          : null;
      const initialDiscountList =
        productById?.product_retail_steps?.length && productId
          ? productById?.product_retail_steps.map((item) => {
              const { from_quantity, to_quantity, price } = item;
              return {
                from: from_quantity,
                to: to_quantity,
                price: formatNumber(price),
              };
            })
          : [];
      const initialAttributeList =
        productById?.attributes?.length && productId
          ? [...productById.attributes]
          : [];
      const initialBaseSellerInfo =
        productById?.distributes && !productById?.distributes.length
          ? {
              price: formatNumber(productById?.price),
              stock: formatNumber(productById?.stock),
            }
          : null;
      const initialShipments =
        productById?.product_shipments?.length && productId
          ? productById?.product_shipments.map((item) => item.id)
          : [0, 1];

      setNameProduct(initialNameProduct);
      setSelectedCategory(initialSelectedCategory);
      setProductImages(initialProductImages);
      setVideoProduct(initialVideoProduct);
      setProperty(initialProperty);
      setDiscountList(initialDiscountList);
      setAttributeList(initialAttributeList);
      setBaseSellerInfo(initialBaseSellerInfo);
      setShipments(initialShipments);
    }
  }, [productById]);

  // lấy id của category cuối cùng
  const mainIdFinalSelectedCategory =
    selectedCategory && selectedCategory.length
      ? selectedCategory[selectedCategory.length - 1]?.id
      : null;

  // tìm category cha theo id của category con cuối cùng
  const findCategoryByIdRecursive = (categories, targetId) => {
    for (const category of categories) {
      if (category.main_id === targetId) {
        return category.id;
      }

      if (category.children) {
        const foundInChildren = findCategoryByIdRecursive(
          category.children,
          targetId
        );
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }

    return null;
  };

  // chuyển đổi dữ liệu discount đến api
  const convertDiscount = () => {
    const retailSteps =
      discountList && discountList.length
        ? discountList.map((item) => {
            const { from, to, price } = item;
            return {
              from_quantity: from,
              to_quantity: to,
              price: price.toString()?.replace(/\./g, ""),
            };
          })
        : [];

    return retailSteps;
  };

  // hàm bỏ dấu chấm ở số của property để chuyển đến api
  const handleParseProperty = (property) => {
    if (property) {
      const newProperty = JSON.parse(JSON.stringify(property));

      if (property.element_distributes?.length > 0) {
        property.element_distributes.forEach((element, i) => {
          newProperty.element_distributes[i].price = element.price
            ? element.price?.toString()?.replace(/\./g, "")
            : 0;
          newProperty.element_distributes[i].supplier_price =
            element.supplier_price
              ? element.supplier_price?.toString()?.replace(/\./g, "")
              : 0;
          newProperty.element_distributes[i].quantity_in_stock =
            element.quantity_in_stock
              ? element.quantity_in_stock?.toString()?.replace(/\./g, "")
              : 0;
          if (element.sub_element_distributes?.length > 0) {
            element.sub_element_distributes.forEach(
              (elementChild, indexChild) => {
                newProperty.element_distributes[i].sub_element_distributes[
                  indexChild
                ].price = elementChild.price
                  ? elementChild.price?.toString()?.replace(/\./g, "")
                  : 0;
                newProperty.element_distributes[i].sub_element_distributes[
                  indexChild
                ].supplier_price = elementChild.supplier_price
                  ? elementChild.supplier_price?.toString()?.replace(/\./g, "")
                  : 0;
                newProperty.element_distributes[i].sub_element_distributes[
                  indexChild
                ].quantity_in_stock = elementChild.quantity_in_stock
                  ? elementChild.quantity_in_stock
                      ?.toString()
                      ?.replace(/\./g, "")
                  : 0;
              }
            );
          }
        });
      }

      return newProperty;
    }
    return {};
  };

  // hàm chuyển đổi dữ liệu từ api về property(thêm dấu . vào số)
  const handleConvertProperty = (property) => {
    if (property) {
      const newProperty = JSON.parse(JSON.stringify(property));
      if (property?.element_distributes?.length > 0) {
        property?.element_distributes.forEach((element, i) => {
          newProperty.element_distributes[i].price = element.price
            ? formatNumber(element.price)
            : "";
          newProperty.element_distributes[i].supplier_price =
            element.supplier_price ? formatNumber(element.supplier_price) : "";
          newProperty.element_distributes[i].quantity_in_stock =
            element.quantity_in_stock
              ? formatNumber(element.quantity_in_stock)
              : "";
          if (element.sub_element_distributes?.length > 0) {
            element.sub_element_distributes.forEach(
              (elementChild, indexChild) => {
                newProperty.element_distributes[i].sub_element_distributes[
                  indexChild
                ].price = elementChild.price
                  ? formatNumber(elementChild.price)
                  : "";
                newProperty.element_distributes[i].sub_element_distributes[
                  indexChild
                ].supplier_price = elementChild.supplier_price
                  ? formatNumber(elementChild.supplier_price)
                  : "";
                newProperty.element_distributes[i].sub_element_distributes[
                  indexChild
                ].quantity_in_stock = elementChild.quantity_in_stock
                  ? formatNumber(elementChild.quantity_in_stock)
                  : "";
              }
            );
          }
        });
      }

      // setProperty(newProperty);
      return newProperty;
    }
    return {};
  };

  // hàm submit form
  const onSubmit = (value) => {
    const params = {
      ...value,
      images: productImages,
      video_url: videoProduct,
      list_attribute: attributeList,
      list_distribute: property?.element_distributes
        ? [
            {
              ...handleParseProperty(property),
              name: property?.property_name,
              sub_element_distribute_name: property?.sub_property_name,
            },
          ]
        : [],
      categories: [
        findCategoryByIdRecursive(categories, mainIdFinalSelectedCategory),
      ],
      product_retail_steps: convertDiscount(),
      name: nameProduct,
      is_product_retail_step:
        discountList && discountList.length ? true : false,
      price: !property
        ? baseSellerInfo?.price.toString()?.replace(/\./g, "")
        : "",
      stock: !property
        ? baseSellerInfo?.stock.toString()?.replace(/\./g, "")
        : "",
      shipments: shipments,
    };
    const onSuccess = () => {
      alerts.success(productId ? "Cập nhật thành công" : "Thêm thành công");
      navigate(-1);
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    productId
      ? updateProduct(productId, params, onSuccess, onFail)
      : createProduct(params, onSuccess, onFail);
  };

  if (loading || productById === {})
    return (
      <Spin spinning={loading}>
        <div className="h-[50vh] w-full bg-[#F5f5f5]"></div>
      </Spin>
    );

  return (
    <div className="bg-[#F4F4F4] relative">
      <Spin spinning={loadingById}>
        <div className="w-[1156px] mx-auto flex justify-center">
          <div className="w-[256px] relative"></div>
          <div
            className="fixed top-[250px]"
            style={{
              left: `calc((100vw - 1170px - ${sidebarWidth}px)/2 + 256px + ${sidebarWidth}px)`,
            }}
          >
            <Tooltip
              zIndex={0}
              title={() => (
                <div className="w-[236px] p-0 rounded-md overflow-hidden h-fit">
                  <div className="h-1 w-full bg-[#2673DD] text-end">
                    <LightBulbIcon className="w-[30px] h-[30px] mt-3 mr-2 text-[#21409A]" />
                  </div>
                  <div className=" bg-[#E5EEFB] w-full text-[18px] font-medium text-[#333] px-5 py-3">
                    {selectedTooltip.title}
                  </div>
                  <pre
                    className="w-full bg-white text-[#666] p-3 leading-[20px]"
                    style={{ whiteSpace: "pre-wrap", wordSpacing: "0px" }}
                  >
                    {selectedTooltip.content}
                  </pre>
                </div>
              )}
              overlayClassName=""
              overlayInnerStyle={{ padding: "0" }}
              placement="left"
              color="white"
              open={true}
            ></Tooltip>
          </div>
          <div className="w-[900px] relative">
            <p className="text-[20px] font-semibold flex gap-3 items-center bg-[#f5f5f5]">
              <ArrowLeftOutlined
                onClick={() => {
                  navigate(-1);
                  resetInitValue();
                }}
              />
              {productId ? "Cập nhật" : "Thêm"} sản phẩm
            </p>
            <div className="h-4 bg-[#f5f5f5]"></div>
            <Form
              {...formItemLayout}
              className="bg-[#f5f5f5] mb-[64px]"
              onFinish={onSubmit}
              autoComplete="off"
            >
              {/* Thông tin cơ bản */}
              <BasicInfo
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                productImages={productImages}
                setProductImages={setProductImages}
                videoProduct={videoProduct}
                setVideoProduct={setVideoProduct}
                nameProduct={nameProduct}
                setNameProduct={setNameProduct}
                setSelectedTooltip={setSelectedTooltip}
              />
              {/* Thông tin chi tiết */}
              <DetailInfo
                selectedCategory={selectedCategory}
                attributeList={attributeList}
                setAttributeList={setAttributeList}
                setSelectedTooltip={setSelectedTooltip}
              />
              {/* Thông tin bán hàng */}
              <SellerInfo
                selectedCategory={selectedCategory}
                property={property}
                setProperty={setProperty}
                discountList={discountList}
                setDiscountList={setDiscountList}
                setSelectedTooltip={setSelectedTooltip}
                setBaseSellerInfo={setBaseSellerInfo}
                baseSellerInfo={baseSellerInfo}
              />
              {/* Thông tin vận chuyển */}
              <TransportInfo
                selectedCategory={selectedCategory}
                setSelectedTooltip={setSelectedTooltip}
                shipments={shipments}
                setShipments={setShipments}
              />
              <div
                className="mt-4 z-10 right-2 flex justify-end fixed bottom-0 bg-white w-full py-4 px-10"
                style={{ boxShadow: "0 -2px 6px 0 rgba(0,0,0,.12)" }}
              >
                <Button style={{ width: "70px" }} block>
                  Hủy
                </Button>
                <Button style={{ width: "90px", margin: "0 10px" }} block>
                  Lưu & Ẩn
                </Button>
                <Button type="primary" htmlType="submit">
                  Lưu & Hiển Thị
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Spin>
    </div>
  );
}
