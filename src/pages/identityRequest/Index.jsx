import { Col, Modal, Progress, Row, Select, Spin, Tooltip } from "antd";
import TextArea from "antd/es/input/TextArea";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  AgencyProducerIcon,
  BankIcon,
  GenuineProducerIcon,
  HomeIcon,
  InternationalProducerIcon,
  StoreIcon,
  UserIcon,
  VietNamProducerIcon,
} from "../../assets/icons";
import Loading from "../../components/loading/Index";
import { statusIdentity, stepIdentityStatus } from "../../constants";
import { useAddressStore } from "../../store/addressStore";
import { useIdentityRequestsStore } from "../../store/identityRequestStore";
import { alerts } from "../../utils/alerts";
import PaymentAccount from "./PaymentAccount";
import ShopInfo from "./ShopInfo";
import SupplierInfo from "./SupplierInfo";
import Warehouse from "./WarehouseInfo";
import { SettingOutlined } from "@ant-design/icons";

const tabSelect = {
  SUPPLIER: 0,
  SHOP: 1,
  WAREHOUSE: 2,
  ACCOUNT: 3,
};

export default function IdentityDetail({ isHome }) {
  const {
    identityRequest,
    getIdentityRequest,
    loading,
    loadingStatus,
    getAllCertificate,
  } = useIdentityRequestsStore((state) => state);
  const { getProvinces } = useAddressStore();

  const [open, setOpen] = useState(false);
  const [reasonUnapproved, setReasonUnapproved] = useState(null);
  const [tabSelected, setTabSelected] = useState(0);
  const [manufacturerSelected, setManufacturerSelected] = useState(null);
  const [isUpdate, setUpdate] = useState(false);

  useEffect(() => {
    getAllCertificate();
    getIdentityRequest();
    const provinces = localStorage.getItem("provinces");
    if (!provinces) {
      getProvinces(
        () => {},
        () => {
          alerts.error("Có lỗi xảy ra");
        }
      );
    }
  }, []);

  useEffect(() => {
    setManufacturerSelected(identityRequest?.type_business);
  }, [identityRequest?.type_business]);

  if (loading) return <Loading />;
  if (identityRequest?.status === statusIdentity.APPROVED && isHome)
    return null;

  const {
    status_supplier,
    status_shop,
    status_account_payment,
    note_supplier,
    note_shop,
    status_warehouse,
    note_warehouse,
    note_account_payment,
  } = identityRequest ?? {};

  const progressPercent = () => {
    const total = 3;
    let count = 0;
    if (status_supplier !== stepIdentityStatus.INITIAL_VALUE) count++;
    if (status_shop !== stepIdentityStatus.INITIAL_VALUE) count++;
    if (status_warehouse !== stepIdentityStatus.INITIAL_VALUE) count++;
    return Math.floor((count / total) * 100);
  };

  const renderStep = () => {
    const stepItem = [
      {
        id: 1,
        title: "Thông tin nhà cung cấp",
        tab: tabSelect.SUPPLIER,
        status: status_supplier ?? stepIdentityStatus.INITIAL_VALUE,
        note: note_supplier,
        icon: <UserIcon className="w-[24px] h-[24px]" />,
        onClick: () => setTabSelected(tabSelect.SUPPLIER),
      },
      {
        id: 2,
        title: "Thông tin gian hàng",
        tab: tabSelect.SHOP,
        status: status_shop ?? stepIdentityStatus.INITIAL_VALUE,
        note: note_shop,
        icon: <StoreIcon className="w-[24px] h-[24px]" />,
        onClick: () => setTabSelected(tabSelect.SHOP),
      },
      {
        id: 3,
        title: "Kho nhà cung cấp",
        tab: tabSelect.WAREHOUSE,
        note: note_warehouse,
        status: status_warehouse ?? stepIdentityStatus.INITIAL_VALUE,
        icon: <HomeIcon className="w-[24px] h-[24px]" />,
        onClick: () => setTabSelected(tabSelect.WAREHOUSE),
      },
      {
        id: 4,
        title: "Tài khoản thanh toán",
        tab: tabSelect.ACCOUNT,
        note: note_account_payment,
        status: status_account_payment ?? stepIdentityStatus.INITIAL_VALUE,
        icon: <BankIcon className="w-[24px] h-[24px]" />,
        onClick: () => setTabSelected(tabSelect.ACCOUNT),
      },
    ];

    const handleGetInfoStep = (statusStep) => {
      switch (statusStep) {
        case stepIdentityStatus.PROGRESSING:
          return {
            color: "#F0AD00",
            statusText: "Đang chờ",
            showAction: [true, true],
          };
        case stepIdentityStatus.APPROVED:
          return {
            color: "#27AE60",
            statusText: "Hoàn thành!",
            showAction: [true, false],
          };
        case stepIdentityStatus.UNAPPROVED:
          return {
            color: "#E83A2F",
            statusText: "Từ chối",
            showAction: [true, true],
          };
        default:
          return {
            color: "#ccc",
            statusText: "Chưa có thông tin",
            showAction: [false, false],
          };
      }
    };

    return (
      <div className="mx-auto rounded-lg relative">
        <Spin spinning={loadingStatus}>
          {progressPercent() === 100 && (
            <div
              className={
                "w-full rounded-lg px-3 bg-[#27AE601A] text-[#27AE60] py-3 cursor-pointer group duration-300 font-medium mb-4"
              }
            >
              <span>
                Định danh thành công, hệ thống sẽ xác nhận trong 24h hành chính
              </span>
            </div>
          )}
          <div className="relative flex gap-[30px] justify-center w-full">
            {stepItem.map((item) => {
              const { id, title, status, icon, tab, onClick, onRefuse } = item;

              const { color, statusText } = handleGetInfoStep(status);
              return (
                <div
                  key={id}
                  className={`w-[170px] relative rounded-lg text-center bg-[#f5f5f5] pt-[20px] pb-[30px] cursor-pointer hover:bg-white hover:shadow-[0_0_14px_0px_rgba(22,119,255,0.3)] group duration-300 ${
                    tabSelected === tab &&
                    "bg-white shadow-[0_0_14px_0px_rgba(22,119,255,0.3)]"
                  }`}
                  onClick={onClick}
                >
                  <Tooltip title="Cập nhật thông tin" color="#0e2482" onClick={() => setUpdate(true)}>
                    <SettingOutlined
                      className="absolute top-3 right-3 text-[18px] text-[#ccc] hover:text-[#0e2482] duration-300 transition"
                      onClick={() => console.log("abc")}
                    />
                  </Tooltip>
                  <div
                    className={`text-[${color}] p-[16px] rounded-[10px]  w-[56px] h-[56px] mx-auto group-hover:bg-[#e6f7ff] ${
                      tabSelected === tab && "bg-[#e6f7ff]"
                    }  duration-300 bg-[#e9e9e9]`}
                  >
                    {icon}
                  </div>
                  <div className="text-[#0e2482] font-medium mt-[16px] mb-[16px]">
                    {title}
                  </div>
                  <p
                    className={`text-[${color}] font-medium flex items-center justify-center gap-1`}
                  >
                    {statusText}{" "}
                    {/* {note && status === stepIdentityStatus.UNAPPROVED ? (
                      <Tooltip title={note} color="#E83A2F">
                        <CircleQuestion className="w-[14px] h-[14px]" />
                      </Tooltip>
                    ) : null} */}
                  </p>
                  <Modal
                    title="Lý do từ chối"
                    open={open && tabSelected === tab}
                    onOk={onRefuse}
                    onCancel={() => {
                      setOpen(false);
                      setReasonUnapproved(null);
                    }}
                    centered
                    okText="Đồng ý"
                    cancelText="Hủy"
                  >
                    <TextArea
                      placeholder="Nhập lý do..."
                      style={{ height: 120, marginTop: 12, marginBottom: 12 }}
                      onChange={(e) => setReasonUnapproved(e.target.value)}
                      value={reasonUnapproved}
                    ></TextArea>
                  </Modal>
                </div>
              );
            })}
          </div>
          <div>
            {stepItem.map((item) => {
              const { id, status, tab, note, onClick } = item;
              if (
                status !== stepIdentityStatus.UNAPPROVED ||
                tab !== tabSelected
              )
                return null;
              return (
                <div
                  key={id}
                  className={
                    "w-full rounded-lg px-3 bg-[#E83A2F1A] text-[#E83A2F] py-3 cursor-pointer group duration-300 mt-4 font-medium"
                  }
                  onClick={onClick}
                >
                  <div>
                    <span className="font-normal">Lý do từ chối:</span> {note}
                  </div>
                </div>
              );
            })}
          </div>
        </Spin>
      </div>
    );
  };

  const manufacturerOptions = [
    {
      value: 0,
      label: (
        <div className="font-medium text-[16px] flex justify-between gap-3 items-center">
          <div className="flex gap-3 items-center">
            <VietNamProducerIcon className="w-[50px] h-[30px]" />
            <span className="text-[#0e2482] w-[250px] inline-block">
              Nhà sản xuất tại Việt Nam
            </span>
          </div>
          <span className="text-gray-600 font-normal">
            Có sở hữu nhãn hiệu hàng hóa
          </span>
        </div>
      ),
    },
    {
      value: 1,
      label: (
        <div className="font-medium text-[16px] flex justify-between gap-3 items-center">
          <div className="flex gap-3 items-center">
            <InternationalProducerIcon className="w-[50px] h-[30px]" />
            <span className="text-[#0e2482] w-[250px] inline-block">
              Nhà sản xuất quốc tế
            </span>
          </div>
          <span className="text-gray-600 font-normal">
            Có sở hữu nhãn hiệu hàng hóa
          </span>
        </div>
      ),
    },
    {
      value: 2,
      label: (
        <div className="font-medium text-[16px] flex justify-between gap-3 items-center">
          <div className="flex gap-3 items-center">
            <div className="w-[50px] flex items-center justify-start">
              <GenuineProducerIcon className="w-[30px] h-[30px]" />
            </div>
            <span className="text-[#0e2482] w-[250px] inline-block">
              Nhà phân phối chính hãng
            </span>
          </div>
          <span className="text-gray-600 font-normal">
            Độc quyền thương hiệu
          </span>
        </div>
      ),
    },
    {
      value: 3,
      label: (
        <div className="font-medium text-[16px] flex justify-between gap-3 items-center">
          <div className="flex gap-3 items-center">
            <div className="w-[50px] flex items-center justify-start">
              <AgencyProducerIcon className="w-[30px] h-[30px]" />
            </div>
            <span className="text-[#0e2482] w-[250px] inline-block">
              Nhà nhập khẩu/ đại lý/ hộ buôn
            </span>
          </div>
          <span className="text-gray-600 font-normal">
            Nhà sản xuất không sở hữu nhãn hiệu hàng hóa
          </span>
        </div>
      ),
    },
  ];

  return (
    <div
      className={`mt-4 relative bg-white ${
        !isHome && "min-h-[calc(100vh-110px)]"
      }`}
    >
      <p className="pl-5 text-[20px] font-semibold">Hoàn thiện thông tin</p>
      {progressPercent() !== 100 && (
        <div className="w-[770px] mx-auto h-[20px]">
          <Progress
            percent={progressPercent()}
            strokeColor="#0e2482"
            strokeWidth={14}
          />
        </div>
      )}
      <Row className="my-[16px] rounded-lg relative">
        <p className="pl-5 text-[20px] font-semibold absolute top-[50%] translate-y-[-50%]">
          Hồ sơ pháp lý
        </p>
        {renderStep()}
      </Row>
      <div className="h-4 w-full bg-[#F4F4F5]"></div>
      {tabSelected === tabSelect.SUPPLIER && !isHome && (
        <div>
          <Row className="bg-[#F4F4F5] justify-center">
            <Col xs={24} xl={20} xxl={16} className="bg-white p-5 rounded-lg">
              <p className="font-medium mb-4">
                <span className="text-[#ff4d4f]">* </span>
                <span className="text-[20px]">Phân loại nhà sản xuất</span>
              </p>
              <Select
                // disabled={status_supplier !== stepIdentityStatus.INITIAL_VALUE}
                size="large"
                value={manufacturerSelected}
                defaultValue={manufacturerSelected || manufacturerOptions[0]}
                style={{ width: "100%" }}
                onChange={(value) => setManufacturerSelected(value)}
                options={manufacturerOptions}
              />
            </Col>
          </Row>
          <div className="h-4 w-full bg-[#F4F4F5]"></div>
        </div>
      )}
      {!isHome && (
        <Row className="bg-[#F4F4F5] justify-center">
          <Col xs={24} xl={20} xxl={16} className="bg-white p-5 rounded-lg">
            {tabSelected === tabSelect.SUPPLIER && (
              <SupplierInfo
                identity={identityRequest}
                manufacturerSelected={manufacturerSelected}
                setTabSelected={setTabSelected}
                isUpdate={isUpdate}
                setUpdate={setUpdate}
              />
            )}
            {tabSelected === tabSelect.SHOP && (
              <ShopInfo
                identity={identityRequest}
                setTabSelected={setTabSelected}
              />
            )}
            {tabSelected === tabSelect.WAREHOUSE && <Warehouse />}
            {tabSelected === tabSelect.ACCOUNT && <PaymentAccount />}
          </Col>
        </Row>
      )}
    </div>
  );
}

IdentityDetail.propTypes = {
  isHome: PropTypes.bool,
};
