import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Radio,
  Row,
  Spin,
  Tabs,
} from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import UploadOneImage from "../../components/common/upload/UploadSingle";
import { useInfoStore } from "../../store/infoStore";
import { alerts } from "../../utils/alerts";
import TabPane from "antd/es/tabs/TabPane.js";
import dayjs from "dayjs";

export default function StoreInfo() {
  const {
    getInfoStore,
    updateInfoStore,
    updateInfoProfile,
    loadingUpdate,
    storeData,
    userData
  } = useInfoStore((state) => state);

  const [storeDataInfo, setStoreDataInfo] = useState(null);
  const [logoShop, setLogoShop] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    getStoreData();
  }, []);

  const getStoreData = () => {
    getInfoStore((data) => {
      setStoreDataInfo(data);
      setLogoShop(data?.logo_url);
      setAvatar(data?.user?.avatar_image);
    });
  };

  const onSubmit = (value) => {
    const onSuccess = () => {
      alerts.success("Lưu thành công");
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    updateInfoStore(
      {
        ...value,
        logo_url: logoShop,
      },
      onSuccess,
      onFail
    );
  };

  const handleSubmitProfile = (value) => {
    const onSuccess = () => {
      alerts.success("Lưu thành công");
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    updateInfoProfile(
      {
        ...value,
        avatar_image: avatar,
      },
      onSuccess,
      onFail
    );
  };

  const { TextArea } = Input;

  if (!storeDataInfo) return null;
  const { description, name } = storeDataInfo;

  // content for "Thông tin cơ bản"
  const basicInfoContent = (
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
      <Form.Item
        label="Logo shop"
        name="images_business_registration"
        labelAlign="left"
        labelCol={{
          span: 24,
        }}
        className="font-medium mb-4"
        sx={{ justifyContent: "space-between" }}
        initialValue={storeData?.logo_url}
      >
        <UploadOneImage
          width="100px"
          height="100px"
          images={logoShop}
          setImages={setLogoShop}
          text="Sửa"
        />
      </Form.Item>

      <Form.Item
        label="Tên shop"
        name="name"
        labelAlign="left"
        className="font-medium "
        rules={[
          {
            required: true,
            message: "Vui lòng nhập tên shop!",
          },
        ]}
        sx={{ justifyContent: "space-between" }}
        initialValue={name}
      >
        <Input placeholder="Nhập tên shop" type="text" defaultValue={name} />
      </Form.Item>

      <Form.Item
        label="Mô tả shop"
        name="description"
        labelAlign="left"
        labelCol={{
          span: 24,
        }}
        className="font-medium"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập mô tả shop!",
          },
        ]}
        sx={{ justifyContent: "space-between" }}
        initialValue={description}
      >
        <TextArea
          maxLength={600}
          showCount
          style={{ height: 120, resize: "none" }}
          placeholder="Nhập địa mô tả shop"
          type="text"
        />
      </Form.Item>
      <div className="flex gap-2 justify-end">
        <Button className="mt-4 w-[150px]" type="primary" htmlType="submit">
          Lưu
        </Button>
      </div>
    </Form>
  );

  // content for "thông tin doanh nghiệp"
  const businessInfoContent = (
    <div>
      {storeData ? (
        <Row>
          <Col span={24}>
            <Form
              name="profile"
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              autoComplete="off"
              layout="vertical"
              onFinish={handleSubmitProfile}
            >
              {/* avatar */}
              <Form.Item
                label="Ảnh đại diện"
                name="avatar_image"
                labelAlign="left"
                labelCol={{
                  span: 24,
                }}
                className="font-medium mb-4"
                sx={{ justifyContent: "space-between" }}
                initialValue={userData?.user?.avatar_image}
              >
                <UploadOneImage
                  width="100px"
                  height="100px"
                  images={avatar}
                  setImages={setAvatar}
                  text="Thay đổi ảnh"
                />
              </Form.Item>

              {/* name */}
              <Form.Item
                label="Tên người dùng"
                name="name"
                labelAlign="left"
                className="font-medium w-full"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập tên người dùng!",
                  },
                ]}
                sx={{ justifyContent: "space-between" }}
                initialValue={storeData?.user?.name}
              >
                <Input
                  placeholder="Nhập tên người dùng"
                  type="text"
                  defaultValue={storeData?.user?.name}
                  value={storeData?.user?.name}
                />
              </Form.Item>

              {/* sex */}
              <Form.Item
                label="Giới tính"
                name="sex"
                labelAlign="left"
                className="font-medium w-full"
                sx={{ justifyContent: "space-between" }}
                initialValue={storeData?.user?.sex}
              >
                <Radio.Group name="sex" defaultValue={storeData?.user?.sex}>
                  <Row>
                    <Col span={12}>
                      <Radio value={0}>Nữ</Radio>
                    </Col>
                    <Col span={12}>
                      <Radio value={1}>Nam</Radio>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>

              {/* date_of_brith */}
              <Form.Item
                label="Ngày sinh nhật"
                name="date_of_brith"
                labelAlign="left"
                className="font-medium w-full"
                sx={{ justifyContent: "space-between", width: "200px" }}
                initialValue={
                  storeDataInfo?.user?.date_of_birth
                    ? dayjs(storeDataInfo?.user?.date_of_birth)
                    : ""
                }
              >
                <DatePicker
                  style={{ width: "250px " }}
                  placeholder="Ngày sinh nhật"
                  defaultValue={
                    storeData?.user?.date_of_birth
                      ? dayjs(location?.state?.start_time, "DD/MM/YYYY")
                      : ""
                  }
                />
              </Form.Item>

              <div className="flex gap-2 justify-end mt-4">
                <Button className="w-[150px]" type="primary" htmlType="submit">
                  Lưu
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      ) : (
        <p>
          Vui lòng liên hệ Nhân viên ngành hàng để được hỗ trợ trong trường hợp
          Shop muốn thay đổi Tên công ty, Địa chỉ, Mã số thuế,...
        </p>
      )}
    </div>
  );

  return (
    <div>
      <Row className="justify-center">
        <Col span={16} className="bg-white p-5">
          <>
            <p className="text-[20px] font-semibold mb-4">Thông tin shop</p>
            <Spin spinning={loadingUpdate}>
              <Tabs defaultActiveKey="businessInfo" tabPosition="top">
                <TabPane tab="Thông tin cá nhân" key="businessInfo">
                  {businessInfoContent}
                </TabPane>
                <TabPane tab="Thông tin shop" key="basicInfo">
                  {basicInfoContent}
                </TabPane>
              </Tabs>
            </Spin>
          </>
        </Col>
      </Row>
    </div>
  );
}

StoreInfo.propTypes = {
  identity: PropTypes.object,
};
