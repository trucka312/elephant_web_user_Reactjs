import { CloseCircleFilled, PlusCircleFilled } from "@ant-design/icons";
import { Col, Form, Input, Row, Tooltip } from "antd";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import UploadMultiple from "../../components/common/upload/UploadMutiple";

export default function BrandItem({
  ref,
  index,
  dataByManufacturerType,
  brand,
  labelList,
  setLabelList,
  disabled
}) {
  const [imagesBrand, setImagesBrand] = useState(
    brand?.images && brand?.images.length ? brand?.images : []
  );

  useEffect(() => {
    setLabelList((prev) =>
      prev.map((item, i) => {
        if (i === index) return { ...item, images: imagesBrand };
        return item;
      })
    );
  }, [imagesBrand]);

  const handleInsertBrand = () => {
    setLabelList((prev) => [...prev, { name: "", images: [] }]);
  };

  const handleDeleteBrand = () => {
    setLabelList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChangeBrandName = (e) => {
    const value = e.target.value;
    setLabelList((prev) =>
      prev.map((item, i) => {
        if (i === index) return { ...item, name: value };
        return item;
      })
    );
  };

  const isFinalItem = useMemo(
    () => index === labelList.length - 1,
    [labelList, index]
  );

  return (
    <Row
      gutter={[15, 15]}
      className={`mt-1 relative items-start gap-[4px] justify-start break-words flex-nowrap border-b-[1px] border-[#e6e6e6] border-solid border-t-0 border-l-0 border-r-0 ${
        isFinalItem && "border-none"
      }`}
    >
      <Col span={12}>
        <Form.Item
          key={ref}
          label={
            <span>
              {dataByManufacturerType.isRequiredBrand && (
                <span className="text-[#ff4d4f]">* </span>
              )}
              Tên thương hiệu/ nhãn hiệu {index + 1}
            </span>
          }
          name={ref}
          labelAlign="left"
          labelCol={{
            span: 24,
          }}
          className="font-medium mb-0"
          rules={[
            {
              required: dataByManufacturerType.isRequiredBrand,
              message: "Vui lòng nhập tên thương hiệu/ nhãn hiệu!",
            },
          ]}
          initialValue={brand?.name}
        >
          <Input
            placeholder="Nhập tên thương hiệu/ nhãn hiệu sở hữu"
            type="text"
            onChange={handleChangeBrandName}
            value={brand?.name}
            ref={ref}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label={
            <span>
              {dataByManufacturerType.isRequiredBrand && (
                <span className="text-[#ff4d4f]">* </span>
              )}
              Ảnh thương hiệu/ nhãn hiệu {index + 1}
            </span>
          }
          name="images_branch"
          labelAlign="left"
          labelCol={{
            span: 24,
          }}
          className="font-medium mb-3"
          rules={[
            {
              validator() {
                if (!dataByManufacturerType.isRequiredBrand)
                  return Promise.resolve();
                if (imagesBrand && imagesBrand.length) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Vui lòng chọn ảnh thương hiệu/ nhãn hiệu!")
                );
              },
            },
          ]}
          initialValue={imagesBrand}
        >
          <UploadMultiple
            width="70px"
            height="70px"
            images={imagesBrand}
            setImages={setImagesBrand}
            text="Thêm ảnh"
            disabled={disabled}
          />
        </Form.Item>
      </Col>
      {isFinalItem && !disabled ? (
        <div
          className="absolute left-[8px] bottom-[10px] font-medium cursor-pointer text-[#0e2482] hover:opacity-90"
          onClick={handleInsertBrand}
        >
          <PlusCircleFilled /> Thêm thương hiệu/ nhãn hiệu
        </div>
      ) : null}
      {index && index !== 0 && !disabled ? (
        <div
          className="absolute right-[8px] top-[4px] font-medium cursor-pointer text-[#0e2482] hover:text-red-500"
          onClick={handleDeleteBrand}
        >
          <Tooltip title="Bỏ thương hiệu/ nhãn hiệu này" color="red">
            <CloseCircleFilled className="text-[18px]" />
          </Tooltip>
        </div>
      ) : null}
    </Row>
  );
}

BrandItem.propTypes = {
  ref: PropTypes.string,
  index: PropTypes.number,
  dataByManufacturerType: PropTypes.object,
  brand: PropTypes.object,
  labelList: PropTypes.array,
  setLabelList: PropTypes.func,
  disabled: PropTypes.bool
};
