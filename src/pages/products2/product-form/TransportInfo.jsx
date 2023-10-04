import { Checkbox, Col, Form, Input, Row } from "antd";
import PropTypes from "prop-types";
import { useProductsStore } from "../../../store/productsStore";
import { getPathByIndex } from "../../../utils";
import { tooltipDescription } from "../../../constants/product";
import React from "react";

const TransportInfo = React.memo(
  ({ shipments, setShipments, selectedCategory, setSelectedTooltip }) => {
    const productId = getPathByIndex(3);
    const { productById } = useProductsStore();

    const handleChangeShipments = (id) => {
      const updated = [...shipments];
      const index = updated.indexOf(id);
      if (index === -1) {
        updated.push(id);
      } else {
        updated.splice(index, 1);
      }
      setShipments(updated);
    };

    if (!selectedCategory && !selectedCategory?.length)
      return (
        <div
          className="bg-white p-4 mt-4"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}
        >
          <p className="text-[20px] font-bold text-[#999]">Vận chuyển</p>
          <p className="text-[#999] mt-4">
            Có thể điều chỉnh sau khi chọn ngành hàng
          </p>
        </div>
      );
    if (!productById?.weight && productId) return null;
    return (
      <div
        className="bg-white p-4 mt-8"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,.12)" }}
      >
        <p className="text-[20px] font-bold mb-3">Vận chuyển</p>
        <div className="pl-4">
          <Form.Item
            name="weight"
            label="Cân nặng"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập cân nặng!",
              },
            ]}
            onClick={() => setSelectedTooltip(tooltipDescription.WEIGHT)}
            initialValue={
              productById?.weight && productId ? productById?.weight : ""
            }
          >
            <Input
              placeholder="nhập vào(gram)"
              type="number"
              className="w-[300px] ml-[9.5px]"
              value={productById?.weight}
              suffix={
                <span className="text-[#ccc] border-l-[1px] border-solid border-t-0 border-r-0 border-b-0 pl-2 my-1">
                  gr
                </span>
              }
            />
          </Form.Item>

          <Row
            gutter={[15, 15]}
            className="items-center gap-2 justify-start break-words flex-nowrap"
            onClick={() => setSelectedTooltip(tooltipDescription.SIZE)}
          >
            <Col span={4}>
              Kích thước đóng gói (Phí vận chuyển thực tế sẽ thay đổi nếu bạn
              nhập sai kích thước)
            </Col>
            <Col>
              <div className="flex justify-between items-center h-[30px]">
                <Form.Item
                  name="width"
                  className="break-words flex-nowrap mb-0"
                  initialValue={productById?.width}
                >
                  <Input
                    style={{ height: "30px", width: "150px" }}
                    placeholder="R"
                    suffix={
                      <span className="text-[#ccc] border-l-[1px] border-solid border-t-0 border-r-0 border-b-0 pl-1">
                        cm
                      </span>
                    }
                    defaultValue={productById?.width}
                  />
                </Form.Item>
                <p className="mx-2 text-[#ccc]">X</p>
                <Form.Item
                  name="length"
                  className="break-words flex-nowrap mb-0"
                  initialValue={productById?.length}
                >
                  <Input
                    style={{ height: "30px", width: "150px" }}
                    placeholder="D"
                    suffix={
                      <span className="text-[#ccc] border-l-[1px] border-solid border-t-0 border-r-0 border-b-0 pl-1">
                        cm
                      </span>
                    }
                    defaultValue={productById?.length}
                  />
                </Form.Item>
                <p className="mx-2 text-[#ccc]">X</p>
                <Form.Item
                  name="height"
                  className="break-words flex-nowrap mb-0"
                  initialValue={productById?.height}
                >
                  <Input
                    style={{ height: "30px", width: "150px" }}
                    placeholder="C"
                    suffix={
                      <span className="text-[#ccc] border-l-[1px] border-solid border-t-0 border-r-0 border-b-0 pl-1">
                        cm
                      </span>
                    }
                    defaultValue={productById?.height}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>

          <Row className="mt-3" gutter={[15, 15]}>
            <Col span={4}>Chọn kiểu giao hàng</Col>
            <Col className="ml-[10px]">
              <Checkbox
                checked={shipments.includes(0)}
                onChange={() => handleChangeShipments(0)}
              >
                Tự vận chuyển
              </Checkbox>
              <Checkbox
                checked={shipments.includes(1)}
                onChange={() => handleChangeShipments(1)}
              >
                Cho phép đơn đặt DROPSHIP
              </Checkbox>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
);

TransportInfo.displayName = "TransportInfo";
export default TransportInfo;

TransportInfo.propTypes = {
  selectedCategory: PropTypes.array,
  setSelectedTooltip: PropTypes.func,
  shipments: PropTypes.array,
  setShipments: PropTypes.func,
};
