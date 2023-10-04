import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Switch,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useBranchesStore } from "../../store/branchesStore";
import { useAddressStore } from "../../store/addressStore";
import { alerts } from "../../utils/alerts";
import PropTypes from "prop-types";

export default function BranchForm({ selectedAddress, onSubmit }) {
  const { loadingUpdate } = useBranchesStore((state) => state);
  const { getDistrict, districts, getWards, wards, resetDistrictAndWard } =
    useAddressStore();
  const provinces = JSON.parse(localStorage.getItem("provinces"));

  const onChangeProvince = (id) => {
    getDistrict(id, () => {
      alerts.error("Có lỗi xảy ra");
    });
    resetDistrictAndWard();
  };

  const onChangeDistrict = (id) => {
    getWards(id, () => {
      alerts.error("Có lỗi xảy ra");
    });
  };

  const transformedData = (data) => {
    return data.map((item) => {
      return { label: item.name, value: item.id };
    });
  };

  return (
    <Spin spinning={loadingUpdate}>
      <Form
        name="basic"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 24,
        }}
        onFinish={onSubmit}
        autoComplete="off"
        layout="vertical"
      >
        <Row className="justify-between" gutter={[15]}></Row>

        <Row className="justify-between" gutter={[15]}>
          <Col span={8}>
            <Form.Item
              label="Tên kho"
              name="name"
              labelAlign="left"
              className="font-medium mb-4"
              sx={{ width: "100%" }}
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn tên kho",
                },
              ]}
              initialValue={selectedAddress?.name || ""}
            >
              <Input placeholder="Nhập tên kho" />
            </Form.Item>
          </Col>
          <Col span={8}>
            {/* <Form.Item
              label="Số điện thoại"
              name="phone"
              labelAlign="left"
              className="font-medium mb-4"
              sx={{ width: "100%" }}
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại",
                },
              ]}
              initialValue={selectedAddress?.phone || ""}
            >
              <Input placeholder="Nhập số điện thoại" type="number" />
            </Form.Item> */}
          </Col>
          <Col span={8}>
            {/* <Form.Item
              label="Email"
              name="email"
              labelAlign="left"
              className="font-medium mb-4"
              sx={{ width: "100%" }}
              labelCol={{
                span: 24,
              }}
              initialValue={selectedAddress?.email || ""}
            >
              <Input placeholder="Email" />
            </Form.Item> */}
          </Col>
        </Row>
        {/* 
        <Row className="justify-start" gutter={[15]}>
          <Col span={8}>
            <Form.Item
              label="Mã kho"
              name="branch_code"
              labelAlign="left"
              className="font-medium mb-4"
              sx={{ width: "100%" }}
              labelCol={{
                span: 24,
              }}
              initialValue={selectedAddress?.branch_code || ""}
            >
              <Input placeholder="Mã kho" type="text" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Mã số thuế"
              name="txt_code"
              labelAlign="left"
              className="font-medium mb-4"
              sx={{ width: "100%" }}
              labelCol={{
                span: 24,
              }}
              initialValue={selectedAddress?.email || ""}
            >
              <Input placeholder="Nhập mã số thuế" />
            </Form.Item>
          </Col>
        </Row> */}

        <Row className="justify-between" gutter={[15]}>
          <Col span={8}>
            <Form.Item
              label="Tên người của lý kho"
              name="warehouse_manager_name"
              labelAlign="left"
              className="font-medium mb-4"
              sx={{ width: "100%" }}
              labelCol={{
                span: 24,
              }}
              initialValue={selectedAddress?.warehouse_manager_name || ""}
            >
              <Input placeholder="Tên người quản lý kho" type="text" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              labelAlign="left"
              className="font-medium mb-4"
              sx={{ width: "100%" }}
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại",
                },
              ]}
              initialValue={selectedAddress?.phone || ""}
            >
              <Input placeholder="Nhập số điện thoại" type="number" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Email"
              name="email"
              labelAlign="left"
              className="font-medium mb-4"
              sx={{ width: "100%" }}
              labelCol={{
                span: 24,
              }}
              initialValue={selectedAddress?.email || ""}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
        </Row>

        <Row className="justify-between" gutter={[15]}>
          <Col span={8}>
            <Form.Item
              label="Tỉnh/Thành phố"
              name="province"
              labelAlign="left"
              className="font-medium mb-4"
              sx={{ width: "100%" }}
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn tỉnh thành phố",
                },
              ]}
              initialValue={selectedAddress?.province}
            >
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Chọn tỉnh, thành phố"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onChange={(e) => onChangeProvince(e)}
                defaultValue={selectedAddress?.province}
                value={selectedAddress?.province}
                options={transformedData(provinces)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Quận/Huyện"
              name="district"
              labelAlign="left"
              className="font-medium mb-4"
              sx={{ width: "100%" }}
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn quận huyện",
                },
              ]}
              initialValue={selectedAddress?.district}
            >
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Chọn quận, huyện"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onChange={(e) => onChangeDistrict(e)}
                defaultValue={selectedAddress?.district}
                value={selectedAddress?.district}
                options={transformedData(districts)}
                disabled={districts.length ? false : true}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Phường/Xã"
              name="wards"
              labelAlign="left"
              className="font-medium mb-4"
              sx={{ width: "100%" }}
              labelCol={{
                span: 24,
              }}
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn phường xã",
                },
              ]}
              initialValue={selectedAddress?.wards}
            >
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Chọn phường xã"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").includes(input)
                }
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                defaultValue={selectedAddress?.wards}
                options={transformedData(wards)}
                disabled={wards.length ? false : true}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Địa chỉ chi tiết"
          name="address_detail"
          labelAlign="left"
          className="font-medium mb-4"
          sx={{ width: "100%" }}
          labelCol={{
            span: 24,
          }}
          rules={[
            {
              required: true,
              message: "Vui lòng nhập địa chỉ chi tiết",
            },
          ]}
          initialValue={selectedAddress?.address_detail}
        >
          <TextArea placeholder="Địa chỉ chi tiết" />
        </Form.Item>

        <div className="flex items-center gap-3 justify-end">
          <span className="ml-2 font-medium">Kho mặc định</span>
          <Form.Item
            label=""
            name="is_default_order_online"
            valuePropName="checked"
            labelAlign="left"
            className="font-medium flex items-center mb-0"
            sx={{ width: "100%" }}
            labelCol={{
              span: 24,
            }}
            initialValue={selectedAddress?.is_default_order_online || ""}
          >
            <Switch defaultChecked={selectedAddress?.is_default_order_online} />
          </Form.Item>
        </div>
        <div className="w-[300px] mx-auto">
          <Button
            className="mt-4"
            block
            type="primary"
            htmlType="submit"
            width={200}
          >
            {selectedAddress ? "Lưu thay đổi" : "Tạo"}
          </Button>
        </div>
      </Form>
    </Spin>
  );
}

BranchForm.propTypes = {
  selectedAddress: PropTypes.object,
  onSubmit: PropTypes.func,
};