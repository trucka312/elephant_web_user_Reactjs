import { Button, Col, DatePicker, Form, Input, Row, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import PropTypes from "prop-types";
import React, { useMemo, useState } from "react";
import UploadMultiple from "../../components/common/upload/UploadMutiple";
import { useIdentityRequestsStore } from "../../store/identityRequestStore";
import { alerts } from "../../utils/alerts";
import { validatePhoneNumber } from "../../utils/validate";
import BrandItem from "./BrandItem";
import CertificateItem from "./CertificateItem";
import { stepIdentityStatus } from "../../constants";

const manufacturerType = {
  VIETNAM: 0,
  INTERNATIONAL: 1,
  GENUINE: 2,
  AGENCY: 3,
};

export default function SupplierInfo({
  identity,
  manufacturerSelected,
  setTabSelected,
  isUpdate,
  setUpdate
}) {
  const { updateIdentityRequest, loadingUpdate, certificate } =
    useIdentityRequestsStore((state) => state);
  const [imagesBusinessRegistration, setImagesBusinessRegistration] = useState(
    identity?.images_business_registration || []
  );
  const [certificateData, setCertificateData] = useState([]);
  const [imagesPowerAttorney, setImagesPowerAttorney] = useState(
    identity?.images_power_attorney_contract || []
  );
  const [imagesFactory, setImagesFactory] = useState(
    identity?.images_factory || []
  );
  const [labelList, setLabelList] = useState(
    identity?.seller_label && identity?.seller_label.length
      ? identity?.seller_label
      : [
          {
            name: "",
            images: [],
          },
        ]
  );


  const inputRefs = useMemo(() => {
    return labelList.map(() => React.createRef());
  }, [labelList]);

  const onSubmit = (value) => {
    const onSuccess = () => {
      alerts.success("Lưu thành công");
      setTabSelected(1);
      setUpdate(false);
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    updateIdentityRequest(
      {
        ...value,
        brand_name: "hard code",
        list_label: labelList,
        images_business_registration: imagesBusinessRegistration,
        type_business: manufacturerSelected,
        seller_certificate: certificateData,
        images_power_attorney_contract: imagesPowerAttorney,
        images_factory: imagesFactory,
      },
      onSuccess,
      onFail
    );
  };

  const {
    company_name,
    co_cq,
    phone_number,
    date_establish,
    factory_address,
    main_business_industry,
    tax_code,
    email,
    seller_certificate,
    company_own_brandname,
    desc_factory_scale,
    production_capacity,
    factory_area,
    num_worker,
    status_supplier,
  } = identity ?? {};

  const onChange = (date, dateString) => {
    console.log(date, `${dateString}-01-01 08:59:42`);
  };

  const renderCertificate = () => {
    if (!certificate || !certificate.length)
      return <p>Không có chứng chỉ nào!</p>;
    return (
      <div className="mt-2">
        <Row className="font-medium mb-2" gutter={[26, 15]}>
          <Col span={12}>
            <Row>
              <Col span={8}>Stt</Col>
              <Col span={16}>Tên chứng chỉ</Col>
            </Row>
          </Col>
          <Col span={12}>Ảnh chứng chỉ</Col>
        </Row>
        <hr />
        {seller_certificate && seller_certificate.length
          ? seller_certificate.map((item, index) => {
              return (
                <CertificateItem
                  key={index}
                  certificate={item}
                  index={index}
                  setCertificateData={setCertificateData}
                  certificateData={certificateData}
                  // disabled={status_supplier !== stepIdentityStatus.INITIAL_VALUE}
                />
              );
            })
          : certificate.map((item, index) => {
              return (
                <CertificateItem
                  key={index}
                  certificate={item}
                  index={index}
                  setCertificateData={setCertificateData}
                  certificateData={certificateData}
                  // disabled={status_supplier !== stepIdentityStatus.INITIAL_VALUE}
                />
              );
            })}
      </div>
    );
  };

  const dataByManufacturerType = {
    labelCompany:
      manufacturerType.GENUINE === manufacturerSelected
        ? "Tên nhà phân phối"
        : manufacturerType.AGENCY === manufacturerSelected
        ? "Họ và tên cá nhân hoặc tên công ty"
        : "Tên công ty",
    isRequiredTax:
      manufacturerType.GENUINE === manufacturerSelected ||
      manufacturerType.AGENCY === manufacturerSelected
        ? false
        : true,
    isRequiredBrand:
      manufacturerType.AGENCY === manufacturerSelected ? false : true,
    labelImagesBusinessRegistration:
      manufacturerType.AGENCY === manufacturerSelected
        ? "CMND/ CCCD/ Hộ chiếu hoặc ảnh ĐKKD với doanh nghiệp hộ kinh doanh "
        : "Ảnh đăng ký kinh doanh",
  };

  return (
    <>
      <p className="text-[20px] font-semibold mb-4 text-[#0e2482]">
        Thông tin nhà cung cấp
      </p>
      <Spin spinning={loadingUpdate}>
        <Form
          // disabled={status_supplier !== stepIdentityStatus.INITIAL_VALUE}
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
            label={dataByManufacturerType.labelCompany}
            name="company_name"
            labelAlign="left"
            className="font-medium "
            rules={[
              {
                required: true,
                message: `Vui lòng nhập ${
                  manufacturerSelected === manufacturerType.GENUINE
                    ? "tên nhà phân phối"
                    : "tên công ty"
                }!`,
              },
            ]}
            labelCol={{
              span: 24,
            }}
            sx={{ justifyContent: "space-between" }}
            initialValue={company_name}
          >
            <Input
              disabled={status_supplier !== stepIdentityStatus.INITIAL_VALUE && !isUpdate}
              placeholder={`Nhập ${
                manufacturerSelected === manufacturerType.GENUINE
                  ? "tên nhà phân phối"
                  : "tên công ty"
              }`}
              type="text"
            />
          </Form.Item>

          <Row
            gutter={[15, 15]}
            className="items-start gap-[4px] justify-start break-words flex-nowrap"
          >
            <Col span={12} className="font-medium">
              <Form.Item
                label="Mã số thuế"
                name="tax_code"
                labelAlign="left"
                className="font-medium"
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: dataByManufacturerType.isRequiredTax,
                    message: "Vui lòng nhập mã số thuế!",
                  },
                ]}
                sx={{ justifyContent: "space-between" }}
                initialValue={tax_code}
              >
                <Input
                  placeholder="Nhập mã số thuế"
                  type="text"
                  disabled={
                    status_supplier !== stepIdentityStatus.INITIAL_VALUE && !isUpdate
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={
                  <span>
                    {dataByManufacturerType.isRequiredTax && (
                      <span className="text-[#ff4d4f]">* </span>
                    )}
                    {dataByManufacturerType.labelImagesBusinessRegistration}
                  </span>
                }
                name="images_business_registration"
                labelAlign="left"
                labelCol={{
                  span: 24,
                }}
                validateStatus={"error"}
                className="font-medium mb-2"
                rules={[
                  {
                    validator() {
                      if (!dataByManufacturerType.isRequiredTax)
                        return Promise.resolve();
                      if (
                        imagesBusinessRegistration &&
                        imagesBusinessRegistration.length
                      ) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Vui lòng thêm ảnh đăng ký kinh doanh")
                      );
                    },
                  },
                ]}
                sx={{ justifyContent: "space-between" }}
                initialValue={imagesBusinessRegistration}
              >
                <UploadMultiple
                  // disabled={
                  //   status_supplier !== stepIdentityStatus.INITIAL_VALUE
                  // }
                  width="70px"
                  height="70px"
                  images={imagesBusinessRegistration}
                  setImages={setImagesBusinessRegistration}
                  text="Thêm ảnh"
                />
              </Form.Item>
            </Col>
          </Row>

          {manufacturerType.GENUINE === manufacturerSelected && (
            <Row gutter={[26, 15]}>
              <Col span={12}>
                <Form.Item
                  label="Công ty/ hộ kinh doanh sở hữu nhãn hiệu"
                  name="company_own_brandname"
                  labelAlign="left"
                  labelCol={{
                    span: 24,
                  }}
                  className="font-medium"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập công ty/ hộ kinh doanh sở hữu nhãn hiệu!",
                    },
                  ]}
                  sx={{ justifyContent: "space-between" }}
                  initialValue={company_own_brandname}
                >
                  <Input placeholder="Công ty/ hộ kinh doanh sở hữu nhãn hiệu" type="text" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={
                    <span>
                      {<span className="text-[#ff4d4f]">* </span>}Ảnh hợp đồng
                      nhượng quyền/ ủy quyền
                    </span>
                  }
                  name=""
                  labelAlign="left"
                  labelCol={{
                    span: 24,
                  }}
                  rules={[
                    {
                      validator() {
                        if (imagesPowerAttorney && imagesPowerAttorney.length) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "Vui lòng thêm ảnh hợp đồng nhượng quyền/ ủy quyền"
                          )
                        );
                      },
                    },
                  ]}
                  className="font-medium mb-4"
                  sx={{ justifyContent: "space-between" }}
                  initialValue={imagesPowerAttorney}
                >
                  <UploadMultiple
                    // disabled={
                    //   status_supplier !== stepIdentityStatus.INITIAL_VALUE
                    // }
                    width="70px"
                    height="70px"
                    text="Thêm"
                    images={imagesPowerAttorney}
                    setImages={setImagesPowerAttorney}
                  />
                </Form.Item>
              </Col>
            </Row>
          )}

          {labelList && labelList.length > 0
            ? labelList.map((item, index) => (
                <BrandItem
                  ref={inputRefs[index]}
                  key={index}
                  brand={item}
                  index={index}
                  dataByManufacturerType={dataByManufacturerType}
                  labelList={labelList}
                  setLabelList={setLabelList}
                  // disabled={
                  //   status_supplier !== stepIdentityStatus.INITIAL_VALUE
                  // }
                />
              ))
            : null}
          {/* (
            <BrandItem
              dataByManufacturerType={dataByManufacturerType}
              labelList={labelList}
              setLabelList={setLabelList}
            />
          ) */}
          <Row
            gutter={[15, 15]}
            className="items-center gap-[4px] justify-start break-words flex-nowrap"
          >
            <Col span={12} className="font-medium">
              <Form.Item
                label="Số điện thoại"
                name="phone_number"
                labelAlign="left"
                labelCol={{
                  span: 24,
                }}
                className="font-medium"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    validator(_, value) {
                      if (validatePhoneNumber(value) || !value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Số điện thoại không hợp lệ!")
                      );
                    },
                  },
                ]}
                sx={{ justifyContent: "space-between" }}
                initialValue={phone_number}
              >
                <Input placeholder="Nhập số điện thoại" type="number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                labelAlign="left"
                className="font-medium"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Email không đúng định dạng!",
                  },
                ]}
                sx={{ justifyContent: "space-between" }}
                initialValue={email}
              >
                <Input placeholder="Nhập email" type="text" />
              </Form.Item>
            </Col>
          </Row>

          <Row
            gutter={[15, 15]}
            className="items-center gap-[4px] justify-start break-words flex-nowrap"
          >
            <Col span={12} className=" font-medium">
              <Form.Item
                label="Quốc gia sản xuất"
                name="type_country"
                labelAlign="left"
                className="font-medium"
                initialValue={"Việt Nam"}
                labelCol={{
                  span: 24,
                }}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng quốc gia!",
                  },
                ]}
                sx={{ justifyContent: "space-between" }}
              >
                <Input
                  placeholder="Quốc gia"
                  defaultValue={"84"}
                  type="text"
                  disabled
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="CO/ CQ"
                name="co_cq"
                labelAlign="left"
                labelCol={{
                  span: 24,
                }}
                className="font-medium"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập CO/ CQ!",
                  },
                ]}
                sx={{ justifyContent: "space-between" }}
                initialValue={co_cq}
              >
                <Input placeholder="Nhập CO/ CQ" type="text" />
              </Form.Item>
            </Col>
          </Row>

          <Row
            gutter={[15, 15]}
            className="items-center gap-[4px] justify-start break-words flex-nowrap"
          >
            <Col span={12} className="font-medium">
              <Form.Item
                label="Ngành nghề kinh doanh chính"
                name="main_business_industry"
                labelAlign="left"
                className="font-medium"
                labelCol={{
                  span: 24,
                }}
                sx={{ justifyContent: "space-between" }}
                initialValue={main_business_industry}
              >
                <Input
                  placeholder="Nhập ngành nghề kinh doanh chính"
                  type="text"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Năm thành lập"
                name="date_establish"
                labelAlign="left"
                labelCol={{
                  span: 24,
                }}
                className="font-medium"
                sx={{ justifyContent: "space-between" }}
                initialValue={date_establish}
              >
                <DatePicker
                  onChange={onChange}
                  className="w-full"
                  picker="year"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="font-medium text-[18px] mb-2">Quy mô nhà máy</Row>
          <Row
            gutter={[15, 15]}
            className="items-center gap-[4px] justify-start break-words flex-nowrap"
          >
            <Col span={12}>
              <Form.Item
                label="Số công nhân"
                name="num_worker"
                labelCol={{
                  span: 24,
                }}
                labelAlign="left"
                className="font-medium "
                initialValue={num_worker}
              >
                <Input
                  type="number"
                  placeholder="Nhập số lượng công nhận"
                  suffix={
                    <span className="text-[#ccc] font-normal">Người</span>
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Diện tích nhà máy"
                name="factory_area"
                labelAlign="left"
                className="font-medium"
                initialValue={factory_area}
                labelCol={{
                  span: 24,
                }}
              >
                <Input
                  type="number"
                  placeholder="Nhập diện tích nhà máy"
                  suffix={<span className="text-[#ccc] font-normal">m2</span>}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row
            gutter={[15, 15]}
            className="items-start gap-[4px] justify-start break-words flex-nowrap"
          >
            <Col span={12}>
              <Form.Item
                label="Năng lực sản xuất"
                name="production_capacity"
                labelAlign="left"
                className="font-medium"
                labelCol={{
                  span: 24,
                }}
                initialValue={production_capacity}
              >
                <Input
                  type="number"
                  placeholder="Số lượng sản phẩm"
                  suffix={
                    <span className="text-[#ccc] font-normal">Sản phẩm</span>
                  }
                />
              </Form.Item>
            </Col>
            {/* <Form.Item
              label="Đơn vị NLSX:"
              name="unit_production_capacity "
              labelAlign="left"
              className="font-medium "
              // rules={[
              //   {
              //     required: true,
              //     message: "Vui lòng nhập đơn vị!",
              //   },
              // ]}
              initialValue={unit_production_capacity}
            >
              <Input className="w-[100px]" type="number" />
            </Form.Item> */}

            <Col span={12}>
              <Form.Item
                label="Mô tả"
                name="desc_factory_scale"
                labelAlign="left"
                className="font-medium "
                initialValue={desc_factory_scale}
              >
                <TextArea type="text" placeholder="Thêm mô tả" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[26, 15]}>
            <Col span={12}>
              <Form.Item
                label="Địa chỉ nhà máy sản xuất"
                name="factory_address"
                labelAlign="left"
                labelCol={{
                  span: 24,
                }}
                className="font-medium"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập địa chỉ nhà máy!",
                  },
                ]}
                sx={{ justifyContent: "space-between" }}
                initialValue={factory_address}
              >
                <Input placeholder="Nhập địa chỉ nhà máy" type="text" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Ảnh nhà máy"
                name="images_factory"
                labelAlign="left"
                labelCol={{
                  span: 24,
                }}
                className="font-medium mb-4"
                sx={{ justifyContent: "space-between" }}
                initialValue={imagesFactory}
              >
                <UploadMultiple
                  // disabled={
                  //   status_supplier !== stepIdentityStatus.INITIAL_VALUE
                  // }
                  width="70px"
                  height="70px"
                  text="Thêm"
                  images={imagesFactory}
                  setImages={setImagesFactory}
                />
              </Form.Item>
            </Col>
          </Row>
          <div>
            <p className="font-medium text-[18px]">Chứng chỉ đạt được</p>
            {renderCertificate()}
          </div>
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

SupplierInfo.propTypes = {
  identity: PropTypes.object,
  manufacturerSelected: PropTypes.number,
  setTabSelected: PropTypes.func,
  isUpdate: PropTypes.bool,
  setUpdate: PropTypes.func
};
