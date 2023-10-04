import { Button, Col, Form, Input, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import LOGO from '../../assets/images/logo.svg';
import { useAuthStore } from '../../store/authStore';
import { alerts } from '../../utils/alerts';
import ModalYesNo from '../../components/common/Modal/ModalYesNo'
import { useState } from 'react';

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const { sendOtp, loading, checkExists } = useAuthStore((state) => state);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // handle open modal
  const handleConfirmDelete = () => {
    setIsDeleteModalVisible(false);
    navigate('/login');
  };

  // turn off modal
  const handleCancelDelete = () => {
    setIsDeleteModalVisible(false);
  };

  const onSubmit = (value) => {
    const onSuccess = (response) => {
      // if not existed yet and has no password => navigate to login to create acount 
      // else : has_password == true => navigate to reset_password page
      if (!response[0]?.value) {
        setIsDeleteModalVisible(true);
      } else {
        const onSuccess = () => {
          navigate('/reset_password', { state: { phoneNumber } });
        };
        const onFail = (error) => {
          alerts.error(error?.response?.data?.msg);
        };
        sendOtp(value, onSuccess, onFail);
      }
    };
    const onFail = (error) => {
      alerts.error(error?.response?.data?.msg);
    };

    checkExists(value, onSuccess, onFail);
  };

  // validate number phone
  const validatePhoneNumber = (rule, value, callback) => {
    if (!value) {
      callback('Vui lòng nhập số điện thoại!');
    } else if (!/^0\d{9,10}$/.test(value)) {
      callback('Số điện thoại không hợp lệ!');
    } else {
      callback();
    }
  };

  return (
    <Row className="w-[900px] mx-auto  p-5 rounded-[6px] mt-[25vh] flex shadow-2xl">
      <ModalYesNo title="Số điện thoại của bạn chưa được đăng kí" text= "Đăng kí nhé !" handleVisible={isDeleteModalVisible}
          handleConfirm={handleConfirmDelete}
          handleCancel={handleCancelDelete}/>
      <Col span={7} className="w-[280px] h-auto mx-auto">
        <img src={LOGO} className="w-full h-full" alt="logo" />
      </Col>
      <Col span={12} className="mr-[30px]">
        <Form
          className="w-[430px]"
          name="basic"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 20,
          }}
          onFinish={onSubmit}
          autoComplete="off"
        >
          <div className="flex items-center justify-center mt-5">
            <h1 className="font-medium text-center">HIHIHI</h1>
          </div>
          <p className="font-medium text-center text-[15px] mb-8 mt-5">
            Vui lòng nhập số điện thoại để thiết lập lại mật khẩu mới
          </p>

          {/* phone number input area */}
          <Form.Item
            label="Số điện thoại"
            name="phone_number"
            labelAlign="left"
            rules={[
              {
                validator: validatePhoneNumber,
              },
            ]}
            sx={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}
          >
            <Input
              style={{ height: 40 }}
              placeholder="Số điện thoại"
              type="tel"
              onChange={(e) => {
                setPhoneNumber(e.target.value);
              }}
            />
          </Form.Item>

          <Button className="mt-4 mb-5 h-[40px]" block type="primary" htmlType="submit" loading={loading}>
            Tiếp theo
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
