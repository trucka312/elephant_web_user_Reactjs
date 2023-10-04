import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
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
    Tooltip
} from "antd";
import { useEffect, useState } from "react";
import { CreditCardIcon } from "../../assets/icons";
import { useAddressStore } from "../../store/addressStore";
import { useIdentityRequestsStore } from "../../store/identityRequestStore";
import { alerts } from "../../utils/alerts";

const bankData = [
    {
      "en_name": "Visa",
      "vn_name": "Visa",
      "bankId": "4",
      "atmBin": "4",
      "cardLength": 13,
      "shortName": "Visa",
      "bankCode": "",
      "type": "",
      "napasSupported": true
    },
    {
      "en_name": "MasterCard",
      "vn_name": "MasterCard",
      "bankId": "5",
      "atmBin": "5",
      "cardLength": 16,
      "shortName": "MasterCard",
      "bankCode": "",
      "type": "",
      "napasSupported": true
    },
    {
      "en_name": "An Binh Commercial Joint stock  Bank",
      "vn_name": "Ngân hàng An Bình",
      "bankId": "970425",
      "atmBin": "970425",
      "cardLength": 16,
      "shortName": "ABBank",
      "bankCode": "323",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Asia Commercial Bank",
      "vn_name": "Ngân hàng Á Châu",
      "bankId": "970416",
      "atmBin": "970416",
      "cardLength": 0,
      "shortName": "ACB",
      "bankCode": "307",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Vienam Bank for Agriculture and Rural Development",
      "vn_name": "Ngân hàng NN & PTNT VN",
      "bankId": "970405",
      "atmBin": "970499",
      "cardLength": 16,
      "shortName": "Agribank, VBARD",
      "bankCode": "204",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Baoviet Joint Stock Commercial Bank",
      "vn_name": "Ngân hàng TMCP Bảo Việt",
      "bankId": "970438",
      "atmBin": "970438",
      "cardLength": 20,
      "shortName": "Baoviet Bank",
      "bankCode": "359",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Bank for Investment and Development of Vietnam",
      "vn_name": "Ngân hàng Đầu tư và Phát triển Việt Nam",
      "bankId": "970418",
      "atmBin": "970418",
      "cardLength": 16,
      "shortName": "BIDV",
      "bankCode": "202",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Dong A Commercial Joint stock Bank",
      "vn_name": "Ngân hàng Đông Á",
      "bankId": "970406",
      "atmBin": "970406",
      "cardLength": 16,
      "shortName": "Dong A Bank, DAB",
      "bankCode": "304",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Vietnam Export Import Commercial Joint Stock Bank",
      "vn_name": "Ngân hàng Xuất nhập khẩu Việt Nam",
      "bankId": "970431",
      "atmBin": "970431",
      "cardLength": 16,
      "shortName": "Eximbank, EIB",
      "bankCode": "305",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Global Petro Commercial Joint Stock Bank",
      "vn_name": "Ngân hàng Dầu khí Toàn cầu",
      "bankId": "970408",
      "atmBin": "970408",
      "cardLength": 20,
      "shortName": "GP Bank",
      "bankCode": "320",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Housing Development Bank",
      "vn_name": "Ngân hàng Phát triển TP HCM",
      "bankId": "970437",
      "atmBin": "970437",
      "cardLength": 20,
      "shortName": "HDBank",
      "bankCode": "321",
      "type": "ACC",
      "napasSupported": true
    },
    {
  "en_name": "Hong Leong Bank Viet Nam",
      "vn_name": "Ngân hàng Hong Leong Viet Nam",
      "bankId": "970442",
      "atmBin": "970442",
      "cardLength": 20,
      "shortName": "HLO",
      "bankCode": "603",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Indovina Bank",
      "vn_name": "Indovina Bank",
      "bankId": "970434",
      "atmBin": "888999",
      "cardLength": 0,
      "shortName": "IVB",
      "bankCode": "502",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Kien Long Commercial Joint Stock Bank",
      "vn_name": "Ngân hàng Kiên Long",
      "bankId": "970452",
      "atmBin": "970452",
      "cardLength": 16,
      "shortName": "Kienlongbank",
      "bankCode": "353",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Lien Viet Post Bank",
      "vn_name": "Ngan hàng TMCP Bưu điện Liên Việt",
      "bankId": "970449",
      "atmBin": "970449",
      "cardLength": 0,
      "shortName": "Lienvietbank,  LPB",
      "bankCode": "357",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Maritime Bank",
      "vn_name": "Ngân hàng Hàng Hải Việt Nam",
      "bankId": "970426",
      "atmBin": "970426",
      "cardLength": 16,
      "shortName": "Maritime Bank, MSB",
      "bankCode": "302",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Military Commercial Joint stock Bank",
      "vn_name": "Ngân hàng Quân Đội",
      "bankId": "970422",
      "atmBin": "970422",
      "cardLength": 16,
      "shortName": "MB",
      "bankCode": "311",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Nam A Commercial Joint stock Bank",
      "vn_name": "Ngân hàng Nam Á",
      "bankId": "970428",
      "atmBin": "970428",
      "cardLength": 0,
      "shortName": "Nam A Bank, NAB",
      "bankCode": "306",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "North Asia Commercial Joint Stock Bank",
      "vn_name": "Ngân hàng Bắc Á",
      "bankId": "970409",
      "atmBin": "970409",
      "cardLength": 0,
      "shortName": "NASBank, NASB",
      "bankCode": "313",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "National Citizen Bank",
      "vn_name": "Ngân hàng Quoc Dan",
      "bankId": "970419",
      "atmBin": "970419",
      "cardLength": 16,
      "shortName": "NCB",
      "bankCode": "352",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Ocean Bank",
      "vn_name": "Ngân hàng Đại Dương",
      "bankId": "970414",
      "atmBin": "970414",
      "cardLength": 20,
      "shortName": "Ocean Bank",
      "bankCode": "319",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Orient Commercial Joint Stock Bank",
      "vn_name": "Ngân hàng Phương Đông",
      "bankId": "970448",
      "atmBin": "970448",
      "cardLength": 16,
      "shortName": "Oricombank, OCB, PhuongDong Bank",
      "bankCode": "333",
      "type": "ACC",
      "napasSupported": true
    },
    {
  "en_name": "Petrolimex group commercial Joint stock Bank",
      "vn_name": "Ngân hàng Xăng dầu Petrolimex",
      "bankId": "970430",
      "atmBin": "970430",
      "cardLength": 16,
      "shortName": "PG Bank",
      "bankCode": "341",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "PVcombank",
      "vn_name": "NH TMCP Đại Chúng Viet Nam",
      "bankId": "970412",
      "atmBin": "970412",
      "cardLength": 16,
      "shortName": "PVcombank",
      "bankCode": "360",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Saigon Thuong Tin Commercial Joint Stock Bank",
      "vn_name": "Ngân hàng Sài Gòn Thương Tín",
      "bankId": "970403",
      "atmBin": "970403",
      "cardLength": 16,
      "shortName": "Sacombank",
      "bankCode": "303",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Saigon Bank for Industry and Trade",
      "vn_name": "Ngân hàng Sài Gòn Công Thương",
      "bankId": "970400",
      "atmBin": "161087",
      "cardLength": 16,
      "shortName": "Saigonbank",
      "bankCode": "308",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Saigon Commercial Joint Stock Bank",
      "vn_name": "Ngân hàng TMCP Sài Gòn",
      "bankId": "970429",
      "atmBin": "970429",
      "cardLength": 16,
      "shortName": "SCB",
      "bankCode": "334",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "South East Asia Commercial Joint stock  Bank",
      "vn_name": "Ngân hàng TMCP Đông Nam Á",
      "bankId": "970440",
      "atmBin": "970468",
      "cardLength": 16,
      "shortName": "SeABank",
      "bankCode": "317",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Saigon - Hanoi Commercial Joint Stock Bank",
      "vn_name": "Ngân hàng Sài Gòn - Hà Nội",
      "bankId": "970443",
      "atmBin": "970443",
      "cardLength": 16,
      "shortName": "SHB",
      "bankCode": "348",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Shinhan Bank",
      "vn_name": "Ngân hàng TNHH MTV Shinhan Việt Nam",
      "bankId": "970424",
      "atmBin": "970424",
      "cardLength": 0,
      "shortName": "Shinhan Bank",
      "bankCode": "616",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Vietnam Technological and Commercial Joint stock Bank",
      "vn_name": "Ngân hàng Kỹ thương Việt Nam",
      "bankId": "970407",
      "atmBin": "970407",
      "cardLength": 16,
      "shortName": "Techcombank, TCB",
      "bankCode": "310",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "United Oversea Bank",
      "vn_name": "United Oversea Bank",
      "bankId": "970458",
      "atmBin": "970458",
      "cardLength": 0,
      "shortName": "UOB",
      "bankCode": "618",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Vietnam International Commercial Joint Stock Bank",
      "vn_name": "Ngân hàng Quốc tế",
      "bankId": "970441",
      "atmBin": "970441",
      "cardLength": 0,
  "shortName": "VIBank, VIB",
      "bankCode": "314",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "VID public",
      "vn_name": "Ngân hàng VID Public",
      "bankId": "970439",
      "atmBin": "970439",
      "cardLength": 16,
      "shortName": "VID public",
      "bankCode": "501",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Viet A Commercial Joint Stock Bank",
      "vn_name": "Ngân hàng Việt Á",
      "bankId": "970427",
      "atmBin": "970427",
      "cardLength": 0,
      "shortName": "VietA Bank, VAB",
      "bankCode": "355",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Vietnam Thương tin Commercial Joint Stock Bank",
      "vn_name": "Ngân hàng Việt Nam Thương Tín",
      "bankId": "970433",
      "atmBin": "970433",
      "cardLength": 16,
      "shortName": "Vietbank",
      "bankCode": "356",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "BanViet Commercial Jont stock Bank",
      "vn_name": "NHTMCP Bản Việt",
      "bankId": "970454",
      "atmBin": "970454",
      "cardLength": 16,
      "shortName": "VietCapital Bank",
      "bankCode": "327",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Joint Stock Commercial Bank for Foreign Trade of Vietnam",
      "vn_name": "Ngân hàng TMCP Ngoại Thương",
      "bankId": "970436",
      "atmBin": "970436",
      "cardLength": 0,
      "shortName": "Vietcombank, VCB",
      "bankCode": "203",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Vietnam Joint Stock Commercial Bank for Industry and Trade",
      "vn_name": "Ngân hàng công thương Việt Nam",
      "bankId": "970415",
      "atmBin": "970415",
      "cardLength": 16,
      "shortName": "Vietinbank",
      "bankCode": "201",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Vietnam prosperity Joint stock commercial Bank",
      "vn_name": "Ngân hàng Thương mại cổ phần Việt Nam Thịnh Vượng",
      "bankId": "970432",
      "atmBin": "970432",
      "cardLength": 16,
      "shortName": "VPBank",
      "bankCode": "309",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "Vietnam - Russia Bank",
      "vn_name": "Ngân hàng Liên doanh Việt Nga",
      "bankId": "970421",
      "atmBin": "970421",
      "cardLength": 16,
      "shortName": "VRB",
      "bankCode": "505",
      "type": "ACC",
      "napasSupported": true
    },
    {
      "en_name": "WOORI BANK Hanoi",
      "vn_name": "WOORI BANK Hà Nội",
      "bankId": "970457",
      "atmBin": "970457",
      "cardLength": 0,
      "shortName": "WHHN",
      "bankCode": "624",
      "type": "ACC",
      "napasSupported": true
    }
]

export default function PaymentAccount() {
  const {
    loadingUpdate,
    getAllPaymentAccount,
    paymentACcounts,
    addPaymentAccount,
    deletePaymentAccount,
    updateAccountPayment
  } = useIdentityRequestsStore((state) => state);
  const { getDistrict, getWards } = useAddressStore();
  const [isShowModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    getAllPaymentAccount();
  }, []);

  const onSubmitAddressForm = (value) => {
    const onSuccess = () => {
      alerts.success(
        selectedAccount ? "Cập nhật thành công" : "Thêm thành công"
      );
      getAllPaymentAccount();
      setShowModal(false);
      setSelectedAccount(null);
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    selectedAccount
      ? updateAccountPayment(selectedAccount?.id, value, onSuccess, onFail)
      : addPaymentAccount(value, onSuccess, onFail);
  };

  const deleteAccount = (id) => {
    const onSuccess = () => {
      alerts.success("Xóa thành công");
      getAllPaymentAccount();
    };
    const onFail = (err) => {
      alerts.error(err);
    };
    deletePaymentAccount(id, onSuccess, onFail);
  };

  const openFormEdit = (item) => {
    setShowModal(true);
    setSelectedAccount(item);
    getDistrict(item.province, () => {
      alerts.error("Có lỗi xảy ra");
    });
    getWards(item.district, () => {
      alerts.error("Có lỗi xảy ra");
    });
  };

  const transformedData = (data) => {
    return data.map((item) => {
      return { label: item.vn_name, value: item.vn_name };
    });
  };

  const formAccount = () => {
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
          <Form.Item
            label="Thêm chủ tài khoản(Viết in hoa, không dấu - NGUYEN VAN A)"
            name="bank_account_name"
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
            initialValue={selectedAccount?.bank_account_name}
          >
            <Input
              placeholder="Nhập họ tên"
            />
          </Form.Item>

          <Form.Item
            label="Tên ngân hàng"
            name="bank_name"
            labelAlign="left"
            className="font-medium mb-4"
            sx={{ width: "100%" }}
            labelCol={{
              span: 24,
            }}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập ngân hàng",
              },
            ]}
            initialValue={selectedAccount?.bank_name}
          >
            <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Chọn tỉnh, thành phố"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label.toLowerCase() ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  options={transformedData(bankData)}
                />
          </Form.Item>

          <Form.Item
            label="Tên chi nhánh ngân hàng(Theo thông tin trên sao kê)"
            name="bank_name_branch"
            labelAlign="left"
            className="font-medium mb-4"
            sx={{ width: "100%" }}
            labelCol={{
              span: 24,
            }}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tên chi nhánh",
              },
            ]}
            initialValue={selectedAccount?.bank_name_branch}
          >
            <Input
              placeholder="Nhập tên chi nhánh"
            />
          </Form.Item>

          <Form.Item
            label="Số tài khoản"
            name="bank_account_number"
            labelAlign="left"
            className="font-medium mb-4"
            sx={{ width: "100%" }}
            labelCol={{
              span: 24,
            }}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập số tài khoản",
              },
            ]}
            initialValue={selectedAccount?.bank_account_number}
          >
            <Input
              placeholder="Nhập số tài khoản"
              // defaultValue={selectedBanner?.title}
            />
          </Form.Item>

          <Form.Item
                label=""
                name="is_default"
                valuePropName="checked"
                labelAlign="left"
                className="font-medium mb-4"
                sx={{ width: "100%" }}
                labelCol={{
                  span: 24,
                }}
                initialValue={selectedAccount?.is_default}
              >
                <Checkbox>Đặt làm mặc định</Checkbox>
              </Form.Item>
          <div className="w-[300px] mx-auto">
            <Button
              className="mt-4"
              block
              type="primary"
              htmlType="submit"
              // disabled={loading}
              width={200}
            >
              {selectedAccount ? "Lưu thay đổi" : "Tạo"}
            </Button>
          </div>
        </Form>
      </Spin>
    );
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center border-b-[1px] border-b-[#ccc] border-t-0 border-r-0 border-l-0 border-solid pb-3">
        <div className="">
          <p className="text-[18px] font-semibold text-[#0e2482]">
            Tài khoản thanh toán
          </p>
        </div>
        <Button type="primary" onClick={() => setShowModal(true)}>
          Thêm tài khoản mới
        </Button>
      </div>
      <Spin spinning={loadingUpdate}>
        {paymentACcounts && paymentACcounts.length ? (
          paymentACcounts.map((item) => {
            const {
              bank_account_name,
              bank_account_number,
              bank_name,
              bank_name_branch,
              id,
            } = item;
            return (
              <Row key={id} className="mt-[20px]">
                <Col span={4}>
                  <CreditCardIcon className="w-[20px] text-[#0e2482]" />
                </Col>
                <Col span={18}>
                  <Row>
                    <Col span={8} className="text-[#646464] mb-2">
                      Tên tài khoản:
                    </Col>
                    <Col span={12} className="font-medium">
                      {bank_account_name}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8} className="text-[#646464] mb-2">
                      Số tài khoản:
                    </Col>
                    <Col span={12}>{bank_account_number}</Col>
                  </Row>
                  <Row>
                    <Col span={8} className="text-[#646464] mb-2">
                      Ngân hàng:
                    </Col>
                    <Col span={12}>
                      <Row className="mb-1">{bank_name}</Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={8} className="text-[#646464] mb-2">
                      Chi nhánh:
                    </Col>
                    <Col span={12}>
                      <Row className="mb-1">{bank_name_branch}</Row>
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
                        onClick={() => deleteAccount(id)}
                      ></Button>
                    </Tooltip>
                  </Space>
                </Col>
              </Row>
            );
          })
        ) : (
          <p className="mt-2">Chưa có thông tin tài khoản thanh toán</p>
        )}
      </Spin>

      {isShowModal && (
        <Modal
          title={selectedAccount ? "Cập nhật tài khoản" : "Thêm tài khoản"}
          open={isShowModal}
          onCancel={() => {
            setShowModal(false);
            setSelectedAccount(null);
          }}
          footer={false}
          centered
          okText="Đồng ý"
          cancelText="Hủy"
        >
          {formAccount()}
        </Modal>
      )}
    </>
  );
}
