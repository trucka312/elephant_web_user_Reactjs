import { Button, Col, Form, Input, Modal, Radio, Row, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import Categories from "../../../components/common/categories";
import UploadMultiple from "../../../components/common/upload/UploadMutiple";
import { useDebounced } from "../../../hooks/useDebounce";
import { useCategoriesStore } from "../../../store/categoriesStore";
import { findCategoryNames, getPathByIndex } from "../../../utils";
import { useProductsStore } from "../../../store/productsStore";
import { tooltipDescription } from "../../../constants/product";
import { EditOutlined } from "@ant-design/icons";
import UploadVideo from "../../../components/common/upload/UploadVideo";

const BasicInfo = React.memo(
  ({
    selectedCategory,
    setSelectedCategory,
    productImages,
    setProductImages,
    videoProduct,
    setVideoProduct,
    nameProduct,
    setNameProduct,
    setSelectedTooltip,
  }) => {
    const productId = getPathByIndex(3);
    const { getRecommendCategory, loadingRecommend, recommendCategory } =
      useCategoriesStore();
    const { productById, forbiddenWords } = useProductsStore();

    const categories = JSON.parse(localStorage.getItem("categories"));

    const [openModalCategory, setModalCategory] = useState(false);
    const [isShowRecommend, setShowRecommend] = useState(false);

    let keywordCategories = useDebounced(nameProduct, 300);

    useEffect(() => {
      if (nameProduct && nameProduct.length >= 10) {
        getRecommendCategory(nameProduct);
        setShowRecommend(true);
      }
    }, [keywordCategories]);

    const categoryNames = findCategoryNames(categories, recommendCategory);

    const handleSelectCategory = (selectedList) => {
      selectedList = selectedList.filter((item) => item.name !== null);
      setSelectedCategory(selectedList);
      setModalCategory(false);
    };

    const showCategoryName = (selectedCategory) => {
      if (!selectedCategory) return;
      if (
        selectedCategory &&
        selectedCategory.length &&
        selectedCategory[0].name
      ) {
        return selectedCategory.map((item) => item.name).join(" > ");
      }
      return selectedCategory
        .slice(1)
        .map((item) => item.name)
        .join(" > ");
    };

    const handleSelectRecommend = (recommend) => {
      setSelectedCategory(recommend);
      if (
        recommend &&
        recommend.length &&
        recommend[recommend.length - 1].children?.length
      ) {
        setModalCategory(true);
      }
      setShowRecommend(false);
    };

    const validateProductName = useCallback((_, value) => {
      const trimmedValue = value.trim();

      if (!trimmedValue) {
        return Promise.resolve();
      }
      if (value.length < 10) {
        return Promise.reject(
          new Error("Tên sản phẩm phải có ít nhất 10 ký tự!")
        );
      }
      const forbiddenWord = forbiddenWords.find((word) =>
        value.toLowerCase().includes(word.toLowerCase())
      );
      if (forbiddenWord) {
        return Promise.reject(
          `Tên sản phẩm không được chứa từ cấm: ${forbiddenWord}`
        );
      }
      if (trimmedValue !== value && value[0] === " ") {
        return Promise.reject("Không được chứa khoảng trắng ở đầu!");
      }
      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (specialCharRegex.test(value)) {
        return Promise.reject("Tên sản phẩm không được chứa ký tự đặc biệt");
      }

      return Promise.resolve();
    }, []);

    if ((!productById?.name || !productById?.description) && productId)
      return null;

    return (
      <div
        className="bg-white rounded-sm p-[1rem]"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}
      >
        <p className="text-[20px] font-bold">Thông tin cơ bản</p>
        <div className="ml-4 mt-8">
          {openModalCategory && (
            <Modal
              open={openModalCategory}
              onCancel={() => setModalCategory(false)}
              footer={null}
              width="80%"
              centered={true}
            >
              <Categories
                categories={categories}
                selectedCategory={selectedCategory}
                onCancel={() => setModalCategory(false)}
                handleSelectCategory={handleSelectCategory}
              />
            </Modal>
          )}
          <Form.Item
            name="images"
            label="Hình ảnh sản phẩm"
            labelAlign="left"
            onClick={() => setSelectedTooltip(tooltipDescription.IMAGE)}
            // rules={[
            //     {
            //         required: true,
            //         message: "Vui lòng chọn ảnh sản phẩm!",
            //     },
            // ]}
          >
            <UploadMultiple
              width="100px"
              height="100px"
              text="Thêm ảnh"
              images={productImages}
              setImages={setProductImages}
            />
          </Form.Item>

          {/* add videos */}
          <Form.Item
            label="Video sản phẩm"
            labelAlign="left"
            valuePropName="fileList"
          >
            <div className="flex">
              <UploadVideo
                video={videoProduct}
                setVideo={setVideoProduct}
                width="216px"
                height="100px"
                text="Thêm video"
              />
              <ul className="ml-4 text-[12px] max-w-[500px] text-[#999]">
                <li>
                  {" "}
                  - Kích thước: Tối đa 30Mb, độ phân giải không vượt quá
                  1280x1280px
                </li>
                <li> - Độ dài: 10s-60s</li>
                <li> - Định dạng: MP4 (không hỗ trợ vp9)</li>
                <li>
                  {" "}
                  - Lưu ý: sản phẩm có thể hiển thị trong khi video đang được xử
                  lý. Video sẽ tự động hiển thị sau khi đã xử lý thành công.
                </li>
              </ul>
            </div>
          </Form.Item>

          {/* add name */}
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            labelAlign="left"
            onClick={() => setSelectedTooltip(tooltipDescription.NAME)}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên sản phẩm!",
              },
              {
                validator: validateProductName,
              },
            ]}
            initialValue={
              productById?.name && productId ? productById.name : ""
            }
          >
            <Input
              placeholder="Nhập tên sản phẩm"
              showCount
              maxLength={250}
              onChange={(e) => {
                setNameProduct(e.target.value);
              }}
              value={nameProduct}
              defaultValue={
                productById?.name && productId ? productById.name : ""
              }
            />
          </Form.Item>

          {/* add major */}
          <Form.Item
            name="categories"
            label={
              <span>
                <span className="text-red-500 text-[18px]">* </span>Ngành hàng
              </span>
            }
            
            labelAlign="left"
            className="mb-2"
            onClick={() => setSelectedTooltip(tooltipDescription.INDUSTRY)}
            rules={[
              {
                validator() {
                  if (showCategoryName(selectedCategory)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Vui lòng chọn ngành hàng!"));
                },
              },
            ]}
            initialValue={showCategoryName(selectedCategory)}
          >
            <Input
              placeholder="Chọn tên ngành hàng"
              value={showCategoryName(selectedCategory)}
              className="cursor-pointer group"
              onClick={() => setModalCategory(true)}
              suffix={<EditOutlined className="text-[#c4c4c4] group-hover:text-[#20409A]"/>}
            />
            <Button className="hidden"></Button>
          </Form.Item>
          <Row className="mb-2">
            <Col span={4}></Col>
            <Col span={20}>
              <Spin spinning={loadingRecommend}>
                {categoryNames &&
                categoryNames.length &&
                nameProduct &&
                isShowRecommend ? (
                  <div className="bg-[#F8FBFE] px-4 py-2 rounded-md mb-4">
                    <p className="text-[#999] font-bold">
                      Ngành hàng được đề xuất
                    </p>
                    {categoryNames.map((recommend, index) => {
                      return (
                        <div
                          key={index}
                          className="flex gap-1 my-2"
                          onClick={() => handleSelectRecommend(recommend)}
                        >
                          <Radio className="flex gap-1">
                            <div className="flex gap-1 hover:text-[#0e2482] my-[2px]">
                              {recommend && recommend.length
                                ? recommend.map((item, index) => {
                                    return (
                                      <div key={item.id} className="flex gap-1">
                                        {item.name}
                                        {index !== recommend.length - 1 && (
                                          <div> &gt; </div>
                                        )}
                                      </div>
                                    );
                                  })
                                : null}
                            </div>
                          </Radio>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </Spin>
            </Col>
          </Row>

          {/* add description */}
          <Form.Item
            name="description"
            label="Mô tả sản phẩm"
            labelAlign="left"
            onClick={() => setSelectedTooltip(tooltipDescription.DESCRIPTION)}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả sản phẩm!",
              },
              {
                validator: (_, value) => {
                  const forbiddenWord = forbiddenWords.find((word) =>
                    value.toLowerCase().includes(word.toLowerCase())
                  );

                  if (forbiddenWord) {
                    return Promise.reject(
                      `Mô tả sản phẩm không được chứa từ cấm: ${forbiddenWord}`
                    );
                  }

                  return Promise.resolve();
                },
              },
            ]}
            initialValue={
              productById?.description && productId
                ? productById.description
                : ""
            }
          >
            <TextArea
              rows={4}
              placeholder="Mô tả sản phẩm"
              showCount
              maxLength={3000}
              value={
                productById?.description && productId
                  ? productById.description
                  : ""
              }
              defaultValue={
                productById?.description && productId
                  ? productById.description
                  : ""
              }
            />
          </Form.Item>
        </div>
      </div>
    );
  }
);

BasicInfo.displayName = "BasicInfo";
export default BasicInfo;

BasicInfo.propTypes = {
  selectedCategory: PropTypes.array,
  setSelectedCategory: PropTypes.func,
  productImages: PropTypes.array,
  setProductImages: PropTypes.func,
  videoProduct: PropTypes.string,
  setVideoProduct: PropTypes.func,
  productById: PropTypes.object,
  nameProduct: PropTypes.string,
  setNameProduct: PropTypes.func,
  setSelectedTooltip: PropTypes.func,
};
