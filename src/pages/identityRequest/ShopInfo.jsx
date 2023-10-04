import { Button, Col, Form, Input, Row, Spin, Switch } from "antd";
import TextArea from "antd/es/input/TextArea";
import PropTypes from "prop-types";
import { useState } from "react";
import { useIdentityRequestsStore } from "../../store/identityRequestStore";
import { alerts } from "../../utils/alerts";
import Upload from "../../components/common/upload";

export default function ShopInfo({ identity, setTabSelected }) {
  const { updateIdentityRequest, loadingUpdate } = useIdentityRequestsStore(
    (state) => state
  );
  const [shopLogo, setShopLogo] = useState(identity?.shop_logo || "");

  const onSubmit = (value) => {
    const onSuccess = () => {
      alerts.success("Lưu thành công");
      setTabSelected(2);
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    updateIdentityRequest(
      { ...value, status_legal_record: 1, shop_logo: shopLogo },
      onSuccess,
      onFail
    );
  };

  const {
    shop_name,
    title_meta,
    is_refund_poor_quality,
    indemnify,
    free_warranty,
    desc_cargo_insurance_policy,
    desc_meta,
  } = identity ?? {};

  return (
    <>
      <p className="text-[20px] font-semibold mb-4 text-[#0e2482]">
        Thông tin gian hàng
      </p>
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
        >
          <Form.Item
            label="Tên gian hàng"
            name="shop_name"
            labelAlign="left"
            className="font-medium "
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên gian hàng!",
              },
            ]}
            initialValue={shop_name}
          >
            <Input
              showCount
              maxLength={30}
              placeholder="Nhập tên gian hàng"
              type="text"
            />
          </Form.Item>

          <Form.Item
            label="Biểu trưng gian hàng"
            name="images_branch"
            labelAlign="left"
            className="font-medium mb-4"
            initialValue={shopLogo}
          >
            <Upload
              width="100px"
              height="100px"
              images={shopLogo}
              setImages={setShopLogo}
              text="Thêm ảnh"
            />
          </Form.Item>

          <Form.Item
            label="Mô tả ngắn"
            name="title_meta"
            labelAlign="left"
            className="font-medium"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả ngắn!",
              },
            ]}
            initialValue={title_meta}
          >
            <Input
              showCount
              maxLength={120}
              placeholder="Nhập mô tả ngắn"
              type="text"
            />
          </Form.Item>

          <Form.Item
            label="Mô tả dài"
            name="desc_meta"
            labelAlign="left"
            className="font-medium "
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mô tả dài!",
              },
            ]}
            initialValue={desc_meta}
          >
            <TextArea
              showCount
              maxLength={3000}
              placeholder="Nhập mô tả dài"
              type="text"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>

          <Row>
            <Col span={6} className="font-medium">
              Chính sách bảo hiểm hàng hóa:
            </Col>
            <Col span={18}>
              <Form.Item
                label="Hoàn tiền hàng kém chất lượng"
                name="is_refund_poor_quality"
                labelAlign="left"
                className="font-medium"
                valuePropName="checked"
                labelCol={14}
                initialValue={is_refund_poor_quality}
              >
                <Switch defaultChecked={is_refund_poor_quality} checked={is_refund_poor_quality}/>
              </Form.Item>
              <Form.Item
                label="Bồi thường"
                name="indemnify"
                labelAlign="left"
                className="font-medium"
                rules={[
                  {
                    validator(_, value) {
                      if (value > 0 && value <= 100) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Tỉ lệ bồi thường phải lớn hơn 0 và nhỏ hơn hoặc bằng 100!")
                      );
                    },
                  },
                ]}
                initialValue={indemnify}
              >
                <Input
                  className=""
                  type="number"
                  suffix={
                    <span className="text-[#ccc] font-normal">
                      % giá trị hàng hóa nếu hàng giả hàng nhái
                    </span>
                  }
                />
              </Form.Item>
              <Form.Item
                label="Bảo hành miễn phí"
                name="free_warranty"
                labelAlign="left"
                className="font-medium"
                rules={[
                  {
                    validator(_, value) {
                      if (value > 0 && value <= 12) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Giá trị phải từ 1 đến 12!")
                      );
                    },
                  },
                ]}
                initialValue={free_warranty}
              >
                <Input
                  className=""
                  type="number"
                  suffix={
                    <span className="text-[#ccc] font-normal">tháng</span>
                  }
                />
              </Form.Item>

              <Form.Item
                label="Mô tả"
                name="desc_cargo_insurance_policy"
                labelAlign="left"
                className="font-medium "
                initialValue={desc_cargo_insurance_policy}
              >
                <TextArea
                  type="text"
                  showCount
                  maxLength={30}
                  placeholder="Thêm mô tả"
                />
              </Form.Item>
            </Col>
          </Row>
          <div className="flex gap-2 justify-end">
            <Button className="mt-4 w-[150px]" type="primary" htmlType="submit">
              Lưu và tiếp
            </Button>
            {/* <Button className="mt-4 w-[150px]" type="primary">
              Tiếp theo
            </Button> */}
          </div>
        </Form>
      </Spin>
    </>
  );
}

ShopInfo.propTypes = {
  identity: PropTypes.object,
  setTabSelected: PropTypes.func,
};
