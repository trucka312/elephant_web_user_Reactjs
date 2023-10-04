import { useState, useEffect } from 'react';
import { Card, Col, Spin, Modal } from 'antd';
import { CheckCircleFilled, ToTopOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

import { useOrderStore } from '../../../store/orderStore';
import { alerts } from '../../../utils/alerts';
import { SHIPPING } from '../defineCodeOrderNum.jsx';

// initial value for "phương thức vận chuyển"
const PARTNER_GHTK = 0;
const PARTNER_GHN = 1;
const PARTNER_VIETTEL_POST = 2;

//props: onCancel, onOk
export default function ModalTypePick(props) {
  const { open, onCancel, orderExists, onGetHistoryOrder, onGetOrderInfo } = props;

  const [typePick, setTypePick] = useState(1);
  const [step, setStep] = useState(1);
  const [loadingSendShip, setLoadingSendShip] = useState(false);

  const { sendOrderToShipper, linkPDF, changeOrderStatus, shippingCode, getLinkPDF } = useOrderStore();

  // initial with status open modal
  useEffect(() => {
    setStep(1);
  }, [open]);

  // show icons check in the picker items "kiểu giao hàng"
  const buildPick = () => {
    return (
      <div className="absolute top-2 right-2" style={{ fontSize: 25, color: '#3447ef' }}>
        <CheckCircleFilled />
      </div>
    );
  };

  const confirmShip = () => {
    // if PARTNER_SUPPLIER_SELF_DELIVERY => change status order to shipping
    if (
      orderExists?.partner_shipper_id != PARTNER_GHTK &&
      orderExists?.partner_shipper_id != PARTNER_GHN &&
      orderExists?.partner_shipper_id != PARTNER_VIETTEL_POST
    ) {
      changeOrderStatus(
        orderExists?.order_code,
        SHIPPING,
        () => {
          onGetOrderInfo(orderExists?.order_code);
        },
        (err) => {
          alerts.error(err);
        },
      );
      onCancel();
    } else {
      setStep(2);
    }
  };

  // send to shiper and change status order begin "đang giao hàng"
  const sendToShip = async () => {
    setStep(3);
    setLoadingSendShip(true);
    sendOrderToShipper(
      orderExists?.order_code,
      () => {
        alerts.success('Đã đăng đơn hàng thành công');
        setLoadingSendShip(false);
        // change thành shipper delivired
        onGetHistoryOrder();
        onGetOrderInfo(orderExists?.order_code);
        setStep(4);
      },
      (error) => {
        alerts.error(error);
        setLoadingSendShip(false);
      },
    );
  };

  // step1 "chuẩn bị hàng"
  const buildStep1 = () => {
    if (
      orderExists?.partner_shipper_id != PARTNER_GHTK &&
      orderExists?.partner_shipper_id != PARTNER_GHN &&
      orderExists?.partner_shipper_id != PARTNER_VIETTEL_POST
    ) {
      return (
        <div>
          <div className="mb-2">
            {' '}
            <label>Vận chuyển</label>
            <p>{orderExists?.partner_shipper_name}</p>
          </div>

          <div className="mb-2 mt-4">
            {' '}
            <label>Bạn có chắc chắn muốn giao đơn hàng này không?</label>
          </div>
        </div>
      );
    } else {
      return (
        <div className="grid grid-cols-2 gap-2">
          <Col span={24} className="relative">
            <div
              className="cursor-pointer width-full h-64 bg-[#f5f5f5] text-center text-sm"
              onClick={() => {
                setTypePick(0);
              }}
            >
              <ToTopOutlined style={{ fontSize: '40px', color: '#08c', padding: 30 }} />
              <p className="p-2">
                <b>Tôi sẽ tự mang tới bưu cục</b>
              </p>
              <p className="p-2">Bạn có thể gửi hàng tại bất kỳ Bưu cục ... nào thuộc cùng Tỉnh/Thành phố</p>
              {typePick == 0 && buildPick()}
            </div>
          </Col>

          <Col span={24}>
            <div
              className="cursor-pointer  h-64 width-full bg-[#f5f5f5] text-center text-sm"
              onClick={() => {
                setTypePick(1);
              }}
            >
              <VerticalAlignBottomOutlined style={{ fontSize: '40px', color: '#08c', padding: 30 }} />
              <p className="p-2">
                <b>Đơn vị vận chuyển đến lấy hàng</b>
              </p>
              <p className="p-2">... sẽ đến lấy hàng theo địa chỉ kho hàng mà bạn đã xác nhận</p>
              {typePick == 1 && buildPick()}
            </div>
          </Col>
        </div>
      );
    }
  };

  // step2 "phương thức vận chuyển hàng"
  // if partner_id = 3 or 4 meaning the same with "Tự giao hàng" => confirm and then change status to SHIPPING
  const buildStep2 = () => {
    return (
      <div>
        <div className="mb-2">
          {' '}
          <label>Vận chuyển</label>
          <p>{orderExists?.partner_shipper_name}</p>
        </div>

        <div className="mb-2 mt-4">
          {' '}
          <label>Địa chỉ lấy hàng</label>
        </div>
        <Card>
          <p>{orderExists?.branch_name}</p>
          <p className="font-semibold">
            {orderExists?.branch_warehouse_manager_name} {orderExists?.branch_phone}
          </p>
          <p>{orderExists?.branch_address_detail}</p>
          <p>{orderExists?.branch_wards_name}</p>
          <p>{orderExists?.branch_district_name}</p>
          <p>{orderExists?.branch_province_name}</p>
        </Card>
      </div>
    );
  };

  // step 3 "thực hiện giao vận"
  const buildStep3 = () => {
    return (
      <div>
        <div className="p-20">
          <Spin tip="Mã vận đơn đang được tạo" spinning={loadingSendShip}>
            <div className="content" />
          </Spin>
        </div>
        <span className="py-8 font-medium	">Thông tin lấy hàng</span>
        <div className="py-1"></div>
        <Card
          style={{
            background: 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="grid grid-cols-5">
            <div className="col-span-2">
              <p className="text-gray-500	">Vận chuyển</p>
              <p>{orderExists?.partner_shipper_name}</p>
            </div>
            <div className="col-span-3">
              <p className="text-gray-500	">Địa chỉ lấy hàng</p>
              <p>{orderExists?.branch_name}</p>
              <p className="font-semibold">
                {orderExists?.branch_warehouse_manager_name} {orderExists?.branch_phone}
              </p>
              <p>{orderExists?.branch_address_detail}</p>
              <p>{orderExists?.branch_wards_name}</p>
              <p>{orderExists?.branch_district_name}</p>
              <p>{orderExists?.branch_province_name}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const buildStep4 = () => {
    return (
      <div>
        <div className="p-20 text-center">
          <p>{orderExists?.partner_shipper_name}</p>
          <p className="text-gray-500	">Mã giao vận</p>
          <div className=" font-semibold	text-lg	">{shippingCode?.code ? shippingCode?.code : ''}</div>
        </div>
        <span className="py-8 font-medium	"> Thông tin lấy hàng</span>
        <div className="py-1"></div>
        <Card
          style={{
            background: 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <div className="grid grid-cols-5">
            <div className="col-span-2">
              <p className="text-gray-500	">Vận chuyển</p>
              <p>{orderExists?.partner_shipper_name}</p>
            </div>
            <div className="col-span-3">
              <p className="text-gray-500	">Địa chỉ lấy hàng</p>
              <p>{orderExists?.branch_name}</p>
              <p className="font-semibold">
                {orderExists?.branch_warehouse_manager_name} {orderExists?.branch_phone}
              </p>
              <p>{orderExists?.branch_address_detail}</p>
              <p>{orderExists?.branch_wards_name}</p>
              <p>{orderExists?.branch_district_name}</p>
              <p>{orderExists?.branch_province_name}</p>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const handlePrintDeliveryNote = (id) => {
    getLinkPDF(
      id,
      () => {
        const externalURL = linkPDF?.file_url; // link pdf
        window.open(externalURL, '_blank'); // Open in a new tab/window
      },
      (err) => {
        alerts.error(err);
      }
    );
  }

  return (
    <div>
      <Modal
        centered
        cancelButtonProps={{
          disabled: step == 3 ? true : false,
        }}
        okButtonProps={{
          disabled: step == 3 ? true : false,
        }}
        title={step == 1 ? 'Giao Đơn Hàng' : step == 2 ? 'Xác nhận địa chỉ lấy hàng' : 'Chi tiết'}
        cancelText={step == 4 ? 'Đóng' : 'Hủy'}
        okText={step == 1 || step == 2 ? 'Xác nhận' : step == 4 ? 'In phiếu giao' : 'Vui lòng đợi'}
        open={open}
        onOk={() => {
          if (step == 1) {
            if (
              orderExists?.partner_shipper_id != PARTNER_GHTK &&
              orderExists?.partner_shipper_id != PARTNER_GHN &&
              orderExists?.partner_shipper_id != PARTNER_VIETTEL_POST
            ) {
              changeOrderStatus(orderExists?.order_code, SHIPPING, () => {
                onGetOrderInfo(orderExists?.order_code);
                onGetHistoryOrder();
              });
              onCancel();
            } else {
              onGetHistoryOrder();
              confirmShip();
            }
          }
          if (step == 2) {
            sendToShip();
            onGetHistoryOrder();
            loadingSendShip();
          }
          if(step == 4){
            handlePrintDeliveryNote(orderExists?.order_code);
          }
        }}
        onCancel={() => {
          onGetHistoryOrder();
          onCancel();
        }}
      >
        {step == 1 && buildStep1()}

        {step == 2 && buildStep2()}

        {step == 3 && buildStep3()}

        {step == 4 && buildStep4()}

      </Modal>
    </div>
  );
}

ModalTypePick.propTypes = {
  props: PropTypes.any,
  orderExists: PropTypes.object,
  onCancel: PropTypes.func,
  open: PropTypes.func,
  onGetHistoryOrder: PropTypes.func,
  onGetOrderInfo: PropTypes.func,
};
