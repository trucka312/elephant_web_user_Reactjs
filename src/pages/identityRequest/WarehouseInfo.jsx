import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Tooltip,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import { LocationIcon } from "../../assets/icons";
import { useAddressStore } from "../../store/addressStore";
import { useIdentityRequestsStore } from "../../store/identityRequestStore";
import { alerts } from "../../utils/alerts";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function Warehouse() {
  const {
    loadingUpdate,
    addAddressWarehouse,
    getAllAddressWarehouse,
    addressList,
    deleteAddressWarehouse,
    updateAddressWarehouse,
  } = useIdentityRequestsStore((state) => state);
  const { getDistrict, districts, getWards, wards, resetDistrictAndWard } = useAddressStore();
  const provinces = JSON.parse(localStorage.getItem("provinces"));
  const [isShowModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    getAllAddressWarehouse();
  }, []);

  const onSubmitAddressForm = (value) => {
    const onSuccess = () => {
      alerts.success(
        selectedAddress ? "Cập nhật thành công" : "Thêm thành công"
      );
      getAllAddressWarehouse();
      setShowModal(false);
      setSelectedAddress(null);
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    selectedAddress
      ? updateAddressWarehouse(selectedAddress?.id, value, onSuccess, onFail)
      : addAddressWarehouse(value, onSuccess, onFail);
  };

  const transformedData = (data) => {
    return data.map((item) => {
      return { label: item.name, value: item.id };
    });
  };

  const onChangeProvince = (id) => {
    getDistrict(id, () => {
      alerts.error("Có lỗi xảy ra");
    });
    resetDistrictAndWard()
  };

  const onChangeDistrict = (id) => {
    getWards(id, () => {
      alerts.error("Có lỗi xảy ra");
    });
  };

  const deleteAddress = (id) => {
    const onSuccess = () => {
      alerts.success("Xóa thành công");
      getAllAddressWarehouse();
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    deleteAddressWarehouse({ seller_warehouse_ids: [id] }, onSuccess, onFail);
  };

  const openFormEdit = (item) => {
    setShowModal(true);
    setSelectedAddress(item);
    getDistrict(item.province, () => {
      alerts.error("Có lỗi xảy ra");
    });
    getWards(item.district, () => {
      alerts.error("Có lỗi xảy ra");
    });
  };

  const formAddress = () => {
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
          onFinish={onSubmitAddressForm}
          autoComplete="off"
          layout="vertical"
        >
          <Row className="justify-between">
            <Col span={24}>
              <Form.Item
                label="Họ và Tên"
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
                    message: "Vui lòng nhập họ tên",
                  },
                ]}
                initialValue={selectedAddress?.name}
              >
                <Input
                  placeholder="Nhập họ tên"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="justify-between" gutter={[15]}>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone_number"
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
                initialValue={selectedAddress?.phone_number}
              >
                <Input
                  placeholder="Số điện thoại"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email",
                  },
                ]}
                initialValue={selectedAddress?.email}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>

          <Row className="justify-between" gutter={[15]}>
            <Col span={12}>
              <Form.Item
                label="Đất nước"
                name="country"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn đất nước",
                  },
                ]}
                initialValue="84"
              >
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Chọn đất nước"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  defaultValue="Việt Nam"
                  options={[
                    {
                      value: "84",
                      label: "Việt Nam",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
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
          </Row>

          <Row className="justify-between" gutter={[15]}>
            <Col span={12}>
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
            <Col span={12}>
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
          <Row className="justify-between">
            <Col span={8}>
              <Form.Item
                label=""
                name="is_default"
                valuePropName="checked"
                labelAlign="left"
                className="font-medium mb-4 flex"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                initialValue={selectedAddress?.is_default}
              >
                <Checkbox>Địa chỉ mặc định</Checkbox>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label=""
                name="is_default_pickup"
                valuePropName="checked"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                initialValue={selectedAddress?.is_default_pickup}
              >
                <Checkbox>Địa chỉ lấy hàng</Checkbox>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label=""
                name="is_default_return"
                valuePropName="checked"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                initialValue={selectedAddress?.is_default_return}
              >
                <Checkbox>Địa chỉ trả hàng</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <div className="w-[300px] mx-auto">
            <Button
              className="mt-4"
              block
              type="primary"
              htmlType="submit"
              // disabled={loading}
              width={200}
            >
              {selectedAddress ? "Lưu thay đổi" : "Tạo"}
            </Button>
          </div>
        </Form>
      </Spin>
    );
  };

  return (
    <>
      <div className="text-[20px] font-semibold mb-4 flex text-[#0e2482]">
        Kho nhà cung cấp
      </div>
      <div className="mb-4 flex justify-between items-center border-b-[1px] border-b-[#ccc] border-t-0 border-r-0 border-l-0 border-solid pb-3">
        <div className="">
          <p className="text-[18px] font-semibold">Địa chỉ</p>
          <p>Quản lý việc vận chuyển và địa chỉ giao hàng của bạn</p>
        </div>
        <Button type="primary" onClick={() => setShowModal(true)}>
          Thêm địa chỉ mới
        </Button>
      </div>
      <Spin spinning={loadingUpdate}>
        {addressList && addressList.length ? (
          addressList.map((item) => {
            const {
              address_detail,
              district_name,
              name,
              phone_number,
              province_name,
              ward_name,
              id,
              is_default_return,
              is_default_pickup,
              is_default,
            } = item;
            return (
              <Row key={id} className="mt-[20px]">
                <Col span={4}>
                  <LocationIcon className="w-[20px] text-[#0e2482]" />
                </Col>
                <Col span={18}>
                  <Row>
                    <Col span={6} className="text-[#646464] mb-2">
                      Họ và tên:
                    </Col>
                    <Col span={6} className="font-medium">
                      {name}
                    </Col>
                    <Col span={12} className="font-medium">
                      {is_default && <span className="w-fit text-[11px] p-[4px] px-[8px] text-[#218ECB] mr-1 bg-[#218ECB1A] rounded-md">Mặc định</span>}
                      {is_default_pickup && (
                        <span className="w-fit text-[11px] p-[4px] px-[8px] text-[#F0AD00] mr-1 bg-[#F0AD001A] rounded-md">Địa chỉ lấy hàng</span>
                      )}
                      {is_default_return && (
                        <span className="w-fit text-[11px] p-[4px] px-[8px] text-[#E83A2F] mr-1 bg-[#E83A2F1A] rounded-md">Địa chỉ trả hàng</span>
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={6} className="text-[#646464] mb-2">
                      Số điện thoại:
                    </Col>
                    <Col span={12}>{phone_number}</Col>
                  </Row>
                  <Row>
                    <Col span={6} className="text-[#646464] mb-2">
                      Địa chỉ:
                    </Col>
                    <Col span={16}>
                      <Row className="mb-1">
                        {address_detail}, {ward_name}, {district_name},{" "}
                        {province_name}
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col span={2}>
                  <Space size="middle">
                    <Tooltip title="Sửa" color={"blue"}>
                      <Button
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openFormEdit(item)}
                      ></Button>
                    </Tooltip>
                    <Tooltip title="Xóa" color={"red"}>
                      <Button
                        size="small"
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => deleteAddress(id)}
                      ></Button>
                    </Tooltip>
                  </Space>
                </Col>
              </Row>
            );
          })
        ) : (
          <p className="mt-2">Chưa có địa chỉ nào!</p>
        )}
      </Spin>

      {isShowModal && (
        <Modal
          title={selectedAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
          open={isShowModal}
          onCancel={() => {
            setShowModal(false);
            setSelectedAddress(null);
            resetDistrictAndWard()
          }}
          footer={false}
          centered
          okText="Đồng ý"
          cancelText="Hủy"
        >
          {formAddress()}
        </Modal>
      )}
    </>
  );
}
