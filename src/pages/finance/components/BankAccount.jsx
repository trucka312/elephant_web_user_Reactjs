import { Button, Col, Row, Tooltip } from 'antd';
import ContentHeader from '../../../components/content-header/index.jsx';
import { formatBankAccountNumber } from '../../../utils/index.js';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useFinanceStore } from '../../../store/financeStore.js';
import { useEffect, useState } from 'react';
import { alerts } from '../../../utils/alerts.js';
import { useBadgesStore } from '../../../store/badgesStore.js';
import ModalYesNo from '../../../components/common/Modal/ModalYesNo/index.jsx';

const BankAccount = () => {
  const navigate = useNavigate();
  const [isModalVisibleDelete, setIsModalVisibleDelete] = useState(false);
  const [idAccountToDelete, setIdAccountToDelete] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { listBankExits, allBankAccounts, getAllBankAccounts, getAllBankExsits, DeleteBankAccount } = useFinanceStore(
    (state) => state,
  );
  const { badges, getAllBadges } = useBadgesStore((state) => state);

  useEffect(() => {
    getAllBankAccounts();
    getAllBadges();
    getAllBankExsits();
  }, [navigate]);

  // get logo of any record
  const tranferData = (name) => {
    return listBankExits.find((item) => item.name === name)?.logo;
  };

  // push default account on a head arr
  const defaultAccount = allBankAccounts.find((account) => account.is_default);

  const sortedAccounts = defaultAccount
    ? [defaultAccount, ...allBankAccounts.filter((account) => account !== defaultAccount)]
    : allBankAccounts;

  // modal add account bank
  const handleModalConfirm = () => {
    navigate('/identity-request');
    setIsModalVisible(false);
  };

  // modal add accouunt bank
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // modal dlete accouunt bank
  const handleModalDeleteCancel = () => {
    setIsModalVisibleDelete(false);
  };

  // modal delete account bank
  const handleModalDelete = () => {
    DeleteBankAccount(
      idAccountToDelete,
      () => {
        alerts.success('Xóa tài khoản thành công !');
      },
      (err) => {
        alerts.error(err);
      },
    );
    setIsModalVisibleDelete(false);
  };

  // check if is not a seller => navigate to identity-request
  const handleAddBankAccount = () => {
    if (badges?.is_verify_seller) {
      navigate('/add_bank_account');
    } else {
      setIsModalVisible(true);
    }
  };

  const handleDeleteAccountBank = (id) => {
    setIsModalVisibleDelete(true);
    setIdAccountToDelete(id);
  };

  return (
    <Row className="block " gutter={[16, 16]}>
      <Col span={24} className="text-2xl font-bold mb-4 ml-[-30px]">
        <ContentHeader title="Tài khoản ngân hàng" />
      </Col>

      <ModalYesNo
        title="Oop !"
        text="Bạn chưa đăng ký tài khoản nhà cung cấp hoặc chưa định danh tài khoản nhà cung cấp. Hãy định danh ngay nhé!"
        handleConfirm={handleModalConfirm}
        handleCancel={handleModalCancel}
        open={isModalVisible}
      />

      <ModalYesNo
        title="Bạn có chắc muốn xóa tài khoản này không"
        text="Hành động này sẽ không thể hoàn tác"
        handleConfirm={handleModalDelete}
        handleCancel={handleModalDeleteCancel}
        open={isModalVisibleDelete}
      />

      <Col span={24} className="mx-auto w-[772px]">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <div
              onClick={handleAddBankAccount}
              className="bg-white cursor-pointer text-[#c4c4c4] pt-[60px] border-[#c4c4c4] border-[2px] border-dashed rounded-[18px] mb-4 shadow-lg w-[354px] h-[177px] items-center text-center "
            >
              <PlusOutlined />
              <p>Thêm tài khoản ngân hàng</p>
            </div>
          </Col>

          {sortedAccounts?.length
            ? sortedAccounts.map((account) => (
                <Col key={account.id} xs={24} sm={12}>
                  <div
                    className={`group bg-[#3b60cfe5] text-white rounded-[14px] mb-4 shadow-lg w-[354px] h-[177px] flex cursor-pointer ${
                      account.is_default ? 'border-solid border-[#21409a] border' : ''
                    }`}
                  >
                    {account.is_default && (
                      <p className="absolute top-0 right-0 mt-[8px] mr-[33px] font-medium text-[#f5f361] text-[12px]">
                        Mặc định
                      </p>
                    )}

                    <div className="border border-solid w-[85%] p-[14px] rounded-br-[200px] bg-[#334c99] border-[#334c99] rounded-bl-[20px] rounded-tl-[200px]">
                      {/* logo */}
                      {tranferData(account.bank_name) && (
                        <div className="bg-white w-[90px] h-fit">
                          <img
                            src={tranferData(account.bank_name)}
                            alt={account.bank_name}
                            className="w-[70px] h-[auto] absolute bottom-0 right-0 mb-[25px] mr-[33px] rounded-[4px]"
                          />
                        </div>
                      )}
                      <p className="text-[12px] font-semibold leading-[16px] text-[#FFFFFF]">{account.bank_name}</p>
                      <p className="text-white text-[12px] leading-[16px] my-[17px]">
                        Số tài khoản
                        <p className="font-bold text-[24px] leading-[36px] text-white">
                          {formatBankAccountNumber(account.bank_account_number)}
                        </p>
                      </p>
                      <p className="text-[12px] leading-[16px] pb-2">
                        Tên chủ tài khoản
                        <p className="font-bold text-[14px] leading-[16px] text-white">{account.bank_account_name}</p>
                      </p>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 w-[354px] h-[177px] border-none ml-2 group-hover:bg-[#0000004D] rounded-[14px]">
                        <Tooltip title="Sửa" color={'#1717e8'} className=" hidden group-hover:block">
                          <Button
                            className="absolute top-[40%] left-[75%] transform[-translate-x-1/2 -translate-y-1/2] bg-white z-40"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => navigate('/update_bank_account', { state: account })}
                          ></Button>
                        </Tooltip>
                        {/* </Link> */}
                        <Tooltip title="Xóa" color={'#e80e0e'} className="hidden group-hover:block">
                          <Button
                            className="absolute top-[40%] left-[85%] transform[-translate-x-1/2 -translate-y-1/2] bg-white"
                            size="small"
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleDeleteAccountBank(account?.id)}
                          ></Button>
                        </Tooltip>
                      </div>
                    </div>
                    {/* the right side card */}
                    <div className=" bg-[#21409AE5]"></div>
                  </div>
                </Col>
              ))
            : ''}
        </Row>
      </Col>
    </Row>
  );
};

export default BankAccount;
