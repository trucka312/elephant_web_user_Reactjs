import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Input, Row, Select, Space } from "antd";
import PropTypes from "prop-types";
import { useState } from "react";
import { useProductsStore } from "../../../../store/productsStore";
import { getPathByIndex } from "../../../../utils";

export default function DropdownAddAttribute({
  attribute,
  attributeList,
  setAttributeList,
}) {
  const { productById } = useProductsStore();
  const productId = getPathByIndex(3);
  const { drop_options, name, required } = attribute;
  const [dropOptionsArray, setDropOptionsArray] = useState(
    drop_options.split(",")
  );
  const [nameAttribute, setNameAttribute] = useState("");

  const addItem = () => {
    setDropOptionsArray((prev) => [...prev, nameAttribute.trim()]);
    dropOptionsArray.push(nameAttribute.trim());
    setNameAttribute("");
  };

  const onChangeAttribute = (name, value) => {
    const newAttributeList = [...attributeList];
    const attributeIndex = newAttributeList.findIndex(
      (item) => item.name === name.trim()
    );

    if (attributeIndex === -1) newAttributeList.push({ name, value });
    else newAttributeList[attributeIndex].value = value;

    setAttributeList(newAttributeList);
  };

  const getDefaultValue = () => {
    let nameDefault = "";
    productById?.attributes &&
      productById?.attributes.map((item) => {
        if (item.name === name) {
          nameDefault = item.value;
        }
      });

    return nameDefault;
  };

  if (!productById?.attributes && productId) return null;

  return (
    <Col span={12} key={name} className="flex justify-between">
      <Row className="flex w-full">
        <Col span={24}>
          <Form.Item
            name={name.trim()}
            label={name.trim()}
            labelAlign="left"
            rules={[
              {
                required: required,
                message: `Vui lòng chọn ${name}!`,
              },
            ]}
            labelCol={{ span: 10 }}
            initialValue={getDefaultValue()}
          >
            <Select
              mode={name === "Màu" ? "tags" : ""}
              style={{ width: 250 }}
              placeholder="Vui lòng chọn"
              onChange={(value) => onChangeAttribute(name, value)}
              defaultValue={getDefaultValue()}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  {name.trim() !== "Thương hiệu" && (
                    <div>
                      <Divider style={{ margin: "8px 0" }} />
                      <Space style={{ padding: "0 8px 4px" }}>
                        <Input
                          placeholder="Thuộc tính tùy chỉnh"
                          // ref={inputRef}
                          value={nameAttribute}
                          onChange={(e) => setNameAttribute(e.target.value)}
                        />
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={addItem}
                        >
                          Thêm
                        </Button>
                      </Space>
                    </div>
                  )}
                </>
              )}
              options={dropOptionsArray.map((item) => ({
                label: item,
                value: item,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>
    </Col>
  );
}

DropdownAddAttribute.propTypes = {
  attribute: PropTypes.object,
  attributeList: PropTypes.array,
  setAttributeList: PropTypes.func,
};
