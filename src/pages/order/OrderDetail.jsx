import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'antd';
import Link from 'antd/es/typography/Link.js';
import { useNavigate, useParams } from 'react-router-dom';

import ModalYesNo from '../../components/common/Modal/ModalYesNo';
import { useOrderStore } from '../../store/orderStore.js';
import { formatNumber } from '../../utils/index.js';
import {
  COMPLETED,
  CUSTOMER_CANCELLED,
  DELIVERED,
  PACKING,
  SHIPPER_DELIVERED,
  SHIPPING,
  WAITING_FOR_PROGRESSING,
  OUT_OF_STOCK,
  USER_CANCELLED,
  DELIVERY_ERROR,
  WAIT_FOR_PAYMENT,
} from './defineCodeOrderNum.jsx';
import ModalTypeShip from './components/ModalTypeShip.jsx';
import ContentHeader from '../../components/content-header/index.jsx';
import { EnvironmentOutlined, FileDoneOutlined } from '@ant-design/icons';
import CarShip from '../../assets/icons/CarShip.jsx';
import { alerts } from '../../utils/alerts.js';

// initial value for "phương thức vận chuyển"
const PARTNER_GHTK = 0;
const PARTNER_GHN = 1;
const PARTNER_VIETTEL_POST = 2;

// logic color
let colorWithPaymentColor = (payment_status_code) => {
  if (payment_status_code == 'WAITING_FOR_PROGRESSING') {
    return 'yellow';
  }
  if (payment_status_code == 'UNPAID') {
    return 'red';
  }
  if (payment_status_code == 'PARTIALLY_PAID') {
    return 'orange';
  }
  if (payment_status_code == 'REFUNDS') {
    return 'black';
  }
  return 'green';
};

const OrderDetail = () => {
  // logic implement
  const { order_code } = useParams();
  const navigate = useNavigate();

  const [isOpenModalShipType, setIsOpenModalShipType] = useState(false);
  const [isPreparingConfirmationVisible, setIsPreparingConfirmationVisible] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showRECEIVED_PRODUCT, setShowRECEIVED_PRODUCT] = useState(false);

  const {
    getOrderById,
    linkPDF,
    loading,
    orderExists,
    getHistoryOrderById,
    getLinkPDF,
    historyOrderById,
    changeOrderStatus,
  } = useOrderStore();

  // handle cancel order when shop delivered
  const handleCancelOrder = () => {
    // Update order status to CUSTOMER_CANCELLED here
    changeOrderStatus(
      orderExists?.order_code,
      CUSTOMER_CANCELLED,
      () => {
        // After changing the order status, re get history
        getHistoryInfo(order_code);
        getOrderInfo(order_code);
      },
      (err) => {
        alerts.error(err);
      },
    );
    setShowCancelConfirmation(false);
  };

  const handleConfirmReceivedProduct = () => {
    changeOrderStatus(
      orderExists?.order_code,
      SHIPPER_DELIVERED,
      () => {
        // After changing the order status, re get history
        getHistoryInfo(order_code);
        getOrderInfo(order_code);
      },
      (err) => {
        alerts.error(err);
      },
    );
    setShowRECEIVED_PRODUCT(false);
  };

  // re get history order when step change
  const handleReGetHistoryOrder = () => {
    getHistoryInfo(order_code);
  };

  // reget order info when complete step 4
  const handleReGetOrderInfo = () => {
    getOrderInfo(order_code);
  };

  useEffect(() => {
    getOrderInfo(order_code);
    getHistoryInfo(order_code);
  }, [navigate, orderExists?.order_status_code]);

  // fetch apis get information for card order and
  const getOrderInfo = (order_code) => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alert.error(err);
    };
    getOrderById(order_code, onSuccess, onFail);
  };

  const getHistoryInfo = (order_code) => {
    const onSuccess = () => {};
    const onFail = (err) => {
      alert.error(err);
    };
    getHistoryOrderById(order_code, onSuccess, onFail);
  };

  const handlePrinterOrder = (id) => {
    getLinkPDF(
      id,
      () => {
        const externalURL = linkPDF?.file_url; // link pdf
        window.open(externalURL, '_blank'); // Open in a new tab/window
      },
      (err) => {
        alerts.error(err);
      },
    );
  };

  return (
    // container
    <div className="bg-[#F5F5F5] pb-[20px] w-full h-auto">
      {/* header */}
      <ModalTypeShip
        orderExists={orderExists}
        open={isOpenModalShipType}
        onCancel={() => {
          setIsOpenModalShipType(false);
        }}
        onGetHistoryOrder={handleReGetHistoryOrder}
        onGetOrderInfo={handleReGetOrderInfo}
      />

      {/* show modal yes no comfirm click "chuẩn bị hàng" */}
      {isPreparingConfirmationVisible && (
        <ModalYesNo
          title="Xác nhận chuẩn bị hàng"
          text="Bạn có xác nhận chuyển trạng thái đơn hàng sang chuẩn bị hàng không?"
          handleConfirm={() => {
            changeOrderStatus(orderExists?.order_code, PACKING, () => {
              getOrderInfo(orderExists?.order_code);
            });
            setIsPreparingConfirmationVisible(false);
          }}
          handleCancel={() => {
            setIsPreparingConfirmationVisible(false);
          }}
          handleVisible={isPreparingConfirmationVisible}
        />
      )}

      {showCancelConfirmation && (
        // show modal yesno when click cancel shipping
        <ModalYesNo
          title="Xác nhận hủy đơn"
          text="Bạn có chắc chắn muốn hủy đơn hàng? Hành động này sẽ không thể hoàn tác."
          handleConfirm={() => {
            setShowCancelConfirmation(false);
            handleCancelOrder();
          }}
          handleCancel={() => setShowCancelConfirmation(false)}
          handleVisible={showCancelConfirmation}
        />
      )}

      {/* show modal confirm when click SHIPPER_DELIVERED */}
      {showRECEIVED_PRODUCT && (
        <ModalYesNo
          title="Xác nhận khách hàng đã nhận hàng"
          text="Bạn đã giao hàng thành công ? Xác nhận đơn khách hàng đã nhận hàng"
          handleConfirm={() => {
            setShowCancelConfirmation(false);
            handleConfirmReceivedProduct();
          }}
          handleCancel={() => setShowRECEIVED_PRODUCT(false)}
          handleVisible={showRECEIVED_PRODUCT}
        />
      )}

      {/* title page*/}
      <Row>
        <Col span={24} style={{ display: 'flex', alignItems: 'center', marginLeft: -30 }}>
          <ContentHeader title={`Chi tiết đơn hàng #${orderExists?.order_code}`} />
          <p className="text-[20px] font-medium mt-[16px] ml-[4px] text-[#666666]"> - {orderExists?.branch_name}</p>
        </Col>
      </Row>

      {/* content page */}
      <Row gutter={[15, 15]} className="mt-[15px] flex ">
        {/* main tabs area */}
        <Col span={16}>
          {orderExists?.order_status_code == WAITING_FOR_PROGRESSING && (
            <div>
              <Card>
                <span className="text-[16px]">
                  <b> Chờ xác nhận</b>
                  <p>Đơn hàng đang đợi bạn xác nhận và chuẩn bị hàng</p>
                </span>
                <div className={`pl-[20px] py-[30px] bg-[#f5f5f5]`}>
                  <div>TIẾP THEO BẠN CÓ THỂ</div>

                  <div className="flex justify-end">
                    <Button
                      type="default"
                      className="mt-10 mr-5"
                      loading={loading}
                      onClick={() => {
                        setShowCancelConfirmation(true);
                      }}
                    >
                      Hủy đơn hàng
                    </Button>
                    <Button
                      onClick={() => {
                        setIsPreparingConfirmationVisible(true);
                      }}
                      type="primary"
                      className="mt-10 mr-5"
                      loading={loading}
                    >
                      Chuẩn bị hàng
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {orderExists?.order_status_code == PACKING && (
            <div>
              <Card>
                <span className="text-[16px]">
                  <b> Bạn đang chuẩn bị hàng</b> <br />
                  <span className="text-gray-500"> Nếu đơn hàng đã chuẩn bị xong hãy giao hàng</span>
                </span>
                <div className={`pl-[20px] py-[30px] bg-[#f5f5f5]`}>
                  <div>TIẾP THEO BẠN CÓ THỂ</div>

                  <div className="flex justify-end">
                    <Button type="default" className="mt-10 mr-5" onClick={() => setShowCancelConfirmation(true)}>
                      Hủy đơn hàng
                    </Button>
                    <Button
                      onClick={() => {
                        setIsOpenModalShipType(true);
                      }}
                      type="primary"
                      className="mt-10 mr-5"
                    >
                      Giao hàng
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {orderExists?.order_status_code == SHIPPER_DELIVERED && (
            <div>
              <Card>
                <span className="text-[16px]">
                  <b> Khách đã nhận được hàng </b>
                  <p>Khách hàng đã nhận được kiện hàng của bạn và đang chờ khách hàng xác nhận !</p>
                </span>
              </Card>
            </div>
          )}

          {orderExists?.order_status_code == DELIVERED && (
            <div>
              <Card>
                <span className="text-[16px]">
                  <b> Giao thành công </b>
                  <p>Đơn hàng của bạn đã được khách hàng xác nhận và kiện hàng đã được giao hàng thành công.</p>
                </span>
              </Card>
            </div>
          )}

          {orderExists?.order_status_code === SHIPPING && (
            <Card>
              <span className="text-[16px]">
                <b> Đơn hàng của bạn đang được giao </b>
                <p>Trạng thái đơn hàng sẽ được đơn vị giao vận quản lí</p>
              </span>
              {!(
                orderExists?.partner_shipper_id === PARTNER_GHTK ||
                orderExists?.partner_shipper_id === PARTNER_GHN ||
                orderExists?.partner_shipper_id === PARTNER_VIETTEL_POST
              ) ? (
                <div className="flex justify-end">
                  <Button
                    type="primary"
                    className="mt-10 mr-5"
                    danger
                    ghost
                    onClick={() => {
                      setShowCancelConfirmation(true);
                    }}
                  >
                    Hủy đơn hàng
                  </Button>

                  <Button
                    onClick={() => {
                      setShowRECEIVED_PRODUCT(true);
                    }}
                    type="primary"
                    className="mt-10 mr-5"
                  >
                    Khách đã nhận được hàng
                  </Button>
                </div>
              ) : (
                ''
              )}
            </Card>
          )}

          {orderExists?.order_status_code === OUT_OF_STOCK && (
            <Card>
              <span className="text-[16px]">
                <b> Hết hàng </b>
                <p>Số lượng hàng trong kho không đủ</p>
              </span>
            </Card>
          )}

          {orderExists?.order_status_code === USER_CANCELLED && (
            <Card>
              <span className="text-[16px]">
                <b> Khách hàng đã hủy </b>
                <p>Đơn hàng của bạn đã bị hủy bởi khách hàng</p>
              </span>
            </Card>
          )}

          {orderExists?.order_status_code === DELIVERY_ERROR && (
            <Card>
              <span className="text-[16px]">
                <b>Giao hàng không thành công </b>
                <p>Đơn hàng của bạn bị lỗi giao hàng</p>
              </span>
            </Card>
          )}

          {orderExists?.order_status_code === WAIT_FOR_PAYMENT && (
            <Card>
              <span className="text-[16px]">
                <b>Chờ thanh toán </b>
                <p>Đơn hàng của bạn đang chờ khách hàng thanh toán</p>
              </span>
            </Card>
          )}

          {orderExists?.order_status_code === CUSTOMER_CANCELLED && (
            <Card>
              <span className="text-[16px]">
                <b> Đơn hàng của bạn đã bị hủy </b>
              </span>
            </Card>
          )}

          {orderExists?.order_status_code == COMPLETED && (
            <div>
              <Card>
                <span className="text-[16px]">
                  <b> Đơn hàng của bạn đã hoàn thành </b>
                </span>
              </Card>
            </div>
          )}

          {/* ship info area */}
          <Card title="Thông tin vận chuyển" className="mt-6">
            <div className=" text-[16px] mx-4 leading-8">
              <div className="flex items-center">
                <span className="font-semibold text-blue-400 text-[19px]">#</span>
                <span className=" ml-2 font-semibold">Mã đơn hàng</span>
              </div>
              <p className="text-blue-400">{orderExists?.order_code}</p>
              <div className="flex items-center">
                <EnvironmentOutlined className="text-blue-400" />
                <span className=" ml-2 font-semibold">Địa chỉ nhận hàng</span>
              </div>
              <p>
                {`${orderExists?.branch_address_detail ? orderExists?.branch_address_detail : ''}${', '}${
                  orderExists?.branch_wards_name ? orderExists?.branch_wards_name : ''
                }${', '}${orderExists?.branch_district_name ? orderExists?.branch_district_name : ''}${', '}${
                  orderExists?.branch_province_name ? orderExists?.branch_province_nam : ''
                } `}
              </p>
              <div className="flex items-center">
                <CarShip className="font-semibold text-blue-400 w-[18px]" />
                <span className=" ml-2 font-semibold">Chi tiết vận chuyển</span>
              </div>
              <p>Đơn vị vận chuyển : {orderExists?.shipper_name}</p>
              {orderExists?.order_ship_code?.from_shipper_code ? (
                <div className="flex justify-between align-middle items-center">
                  <span>
                    Mã vận đơn :{' '}
                    <span className="bg-[#0CC0A8] text-white px-[4px]">
                      {orderExists?.order_ship_code?.from_shipper_code}
                    </span>
                  </span>

                  <Button className='h-[24px] leading-[10px]' type="primary" onClick={() => {handlePrinterOrder(orderExists?.order_code)}}>
                    In hóa đơn
                  </Button>
                </div>
              ) : (
                <span>
                  Mã vận đơn : <span className="bg-[#0CC0A8] text-white px-[4px]">Đơn hàng chưa tạo mã giao vận</span>
                </span>
              )}
            </div>
          </Card>

          {/* information card order here */}
          <div className=" mt-[20px]">
            <Card title="Thông tin thanh toán">
              <span className="text-[16px]">
                Mã đơn: <span className="text-[#7e74d2]">{orderExists?.order_code} | </span>
                {orderExists?.line_items_at_time?.length > 0 ? orderExists?.line_items_at_time[0]?.quantity : ''} sản
                phẩm
              </span>{' '}
              <br />
              <span className="text-[16px]">
                Trạng thái thanh toán :{' '}
                <span
                  className={`bg-[${colorWithPaymentColor(
                    orderExists?.payment_status_code,
                  )}] text-white px-[4px] opacity-40`}
                >
                  {orderExists?.payment_status_name}
                </span>
              </span>
              {/* table products */}
              <div className="flex justify-between w-full bg-[#f5f5f5] rounded-[2px] mt-4 p-[6px] text-slate-400">
                <div className="flex">
                  <div className="mx-[6px]">STT</div>
                  <div className="mx-[6px]">Sản phẩm</div>
                </div>
                <div className="flex w-[35%] ml-2">
                  <div className="mx-[6px]">Đơn giá</div>
                  <div className="mx-[6px]">Số lượng</div>
                  <div className="mx-[6px]">Thành tiền</div>
                </div>
              </div>
              {/* map item here */}
              {orderExists?.line_items_at_time?.length > 0
                ? orderExists?.line_items_at_time?.map((item, index) => {
                    return (
                      <div className="flex justify-between flex-1 pt-[20px] items-center w-full" key={index}>
                        <div className="flex items-center">
                          <div className="mx-4 h-full">{index + 1}</div>
                          <div>
                            <img style={{ width: 70, height: 70 }} src={item.image_url} alt="ảnh sản phẩm" />
                          </div>
                          <div className="ml-[30px] text-[16px]">
                            <p>
                              <Link to={`/products/${item?.id}`}>{item?.name}</Link>
                            </p>
                            <p>
                              {item?.distributes_selected?.length ? item?.distributes_selected[0]?.name : ''}{' '}
                              {item?.distributes_selected?.length ? item?.distributes_selected[0]?.value : ''}
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-around w-[40%] pl-2">
                          <div className="">{formatNumber(item.item_price)}đ</div>
                          <div className="">{item.quantity}</div>
                          <div className="">{formatNumber(item.item_price * item.quantity)}đ</div>
                        </div>
                      </div>
                    );
                  })
                : ''}
            </Card>
          </div>

          {/* customer info area */}
          <Card title="Thông tin khách hàng" className="mt-6">
            <div className="mt-[10px] text-[16px] mx-4 leading-8">
              <p className="font-bold ">Đơn này từ web</p>
              <p>
                Khách hàng:{' '}
                <Link to={`/customer/detail/${orderExists.customer_id}`}>{orderExists?.customer?.name}</Link>
              </p>
              <p>SĐT khách hàng: {orderExists?.customer?.phone_number}</p>
              <p>Người nhận: {orderExists?.customer_name}</p>
              <p>SĐT người nhận : {orderExists?.customer_phone}</p>
              <p>
                Địa chỉ:{' '}
                {`${orderExists?.customer_address_detail}${', '}${orderExists?.customer_wards_name}${', '}${
                  orderExists?.customer_district_name
                }${', '}${orderExists?.customer_province_name} `}
              </p>
              <p>Email: {orderExists?.customer_email}</p>
              <p>Thời gian: {orderExists?.created_at}</p>
              <p>Phương thức thanh toán: {orderExists?.payment_method_name}</p>
              <p>Ghi chú: {orderExists?.customer_note}</p>
            </div>
          </Card>
        </Col>

        <Col span={8} className="">
          {/* total paid card*/}
          <Card title="Tổng tiền">
            <div className="flex justify-between">
              <p>Tạm tính :</p>
              <p>{formatNumber(orderExists.total_before_discount)}đ</p>
            </div>
            <div className="flex justify-between">
              <p>Phí giao hàng :</p>
              <p>{formatNumber(orderExists.total_shipping_fee)}đ</p>
            </div>
            <div className="flex justify-between">
              <p>Thành tiền :</p>
              <p>{formatNumber(orderExists.total_final)}đ</p>
            </div>
          </Card>

          {/* Lịch sử đơn hàng */}
          {historyOrderById?.length ? (
            <Card title="Lịch sử đơn hàng" className="mt-6">
              {/* note */}
              <div className="flex items-start">
                <FileDoneOutlined className="mt-[5px]" />{' '}
                <div className="text ml-4 w-full">
                  {historyOrderById?.length &&
                    historyOrderById
                      .slice()
                      .reverse()
                      .map((item, index) => (
                        <div key={index}>
                          <p className={index === 0 ? 'text-[#167164] font-semibold' : ''}>
                            {item?.note || 'Không có ghi chú'}
                          </p>
                          <span className="text-[#ae8f88]">{item?.created_at || ''}</span>
                        </div>
                      ))}
                </div>
              </div>
            </Card>
          ) : (
            ''
          )}
        </Col>
      </Row>
    </div>
  );
};

export default OrderDetail;
