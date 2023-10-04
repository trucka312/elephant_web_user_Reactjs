import { useEffect, useState } from 'react';
import { Col, Row, Input, Button } from 'antd';

import ContentHeader from '../../components/content-header/index.jsx';
import ConfirmationModal from '../../components/common/Modal/ModalYesNo';
import { formatNumber } from '../../utils/index.js';
import { useFinanceStore } from '../../store/financeStore.js';
import { alerts } from '../../utils/alerts.js';
import { useNavigate } from 'react-router-dom';

const WithdrawMoney = () => {
  const navigate = useNavigate();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { walletsInfor, getInfoWallets, requestWithDrawMoney } = useFinanceStore();

  useEffect(() => {
    getInfoWallets();
  }, [navigate]);

  const showModal = () => {
    if (withdrawAmount <= 0) {
      alerts.error('Số tiền phải lớn hơn 0');
      return;
    } else if (withdrawAmount > walletsInfor?.account_balance) {
      alerts.error('Số dư của bạn hiện tại không đủ');
    } else {
      setIsModalVisible(true);
    }
  };

  const handleModalConfirm = () => {
    setIsModalVisible(false);
    handleSubmit();
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = () => {
    const params = { money: withdrawAmount };
    requestWithDrawMoney(
      params,
      () => {
        alerts.success('Tạo yêu cầu rút tiền thành công');
      },
      (err) => {
        alerts.error(err);
      },
    );
  };

  return (
    <Row className="block items-center bg-white h-screen w-full">
      <Col className="ml-[-30px] mb-4">
        <ContentHeader title="Rút tiền" />
      </Col>

      {/* moadal confirm */}
      <ConfirmationModal
        className='mt-10'
        title="Xác nhận rút tiền"
        text={`Bạn có chắc chắn muốn rút ${formatNumber(
          withdrawAmount.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }),
        )}đ ?`}
        handleConfirm={handleModalConfirm}
        handleCancel={handleModalCancel}
        handleVisible={isModalVisible}
      />

      <Col span={12} className="mx-auto">
        <p className="text-center text-[16px] font-semibold">
          Số dư hiện tại của bạn là: <span className='text-[18px] text-[#21409a]'>{formatNumber(walletsInfor?.account_balance)} VNĐ</span> 
        </p>
        <div className="mt-4 mb-2 mx-auto w-full text-center text-[16px] font-semibold">Số tiền bạn muốn rút ?</div>
        <Input
          type="number"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          className="mb-2 border-[2px]"
        />

        <div className="w-full text-center">
          <Button type="primary" onClick={showModal} className="mt-[20px] w-[200px] mx-auto">
            Rút tiền
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default WithdrawMoney;
