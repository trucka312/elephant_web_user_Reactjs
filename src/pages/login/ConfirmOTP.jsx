import { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import LOGO from '../../assets/images/logo.svg';
import { PATH } from '../../constants/paths';
import { useAuthStore } from '../../store/authStore';
import { alerts } from '../../utils/alerts';
import { setToken } from '../../utils/auth.js';

const ConfirmOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, loading, sendOtp, checkExists } = useAuthStore((state) => state);
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [resendButtonDisabled, setResendButtonDisabled] = useState(true);
  const [remainingTime, setRemainingTime] = useState(30);
  const phoneNumber = location?.state?.phoneNumber || '';
  const inputRefs = useRef([]);

  useEffect(() => {
    // Đếm ngược thời gian sau khi lấy mã OTP
    if (remainingTime > 0 && resendButtonDisabled) {
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setResendButtonDisabled(false);
      setRemainingTime(30);
    }
  }, [remainingTime, resendButtonDisabled]);

  // check otp here
  const handleOTPSubmit = async () => {
    const onSuccess = (response) => {
      // if not existed yet and has no password => navigate to register to update phone number and password and then login 
      // else : has_password == true => login right now
      if (!response[0]?.value) {
        const onSuccess = (response) => {
          const tokenKey = response?.token;
          setToken(tokenKey);
          navigate('/register');
          alerts.success('Tài khoản của bạn chưa tồn tại, hãy đăng kí trước nhé');
        };
        const onFail = (error) => {
          alerts.error(error?.response?.data?.msg);
        };
        const params = {
          phone_number: phoneNumber,
          password: '',
          otp: otp.join(''),
          is_otp: true,
        };
        login(params, onSuccess, onFail);
      } else {
        const onSuccess = (response) => {
          const tokenKey = response?.token;
          setToken(tokenKey);
          navigate(PATH.HOME);
          alerts.success('Đăng nhập thành công');
        };
        const onFail = (error) => {
          alerts.error(error) || alerts.error();
        };
        const params = {
          phone_number: phoneNumber,
          password: '',
          otp: otp.join(''),
          is_otp: true,
        };
        login(params, onSuccess, onFail);
      }
    };
    const onFail = (error) => {
      alerts.error(error?.response?.data?.msg);
    };

    const requestValues = {
      phone_number: phoneNumber,
    };
    checkExists(requestValues, onSuccess, onFail);
  };

  // resend OTP
  const handleResendOTP = async () => {
    const onSuccess = () => {
      alerts.success('Mã OTP đã được gửi lại.');
      setResendButtonDisabled(true);
    };
    const onFail = (error) => {
      alerts.error(error?.response?.data?.msg);
      setResendButtonDisabled(true);
    };
    const params = {
      phone_number: phoneNumber,
    };
    sendOtp(params, onSuccess, onFail);
  };

  // handle change opt input
  const handleInputChange = (e, index) => {
    const newOTP = [...otp];
    newOTP[index] = e.target.value;

    if (e.target.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    setOTP(newOTP);
  };

  // handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && index > 0 && !otp[index]) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="w-[500px] my-auto mx-auto border-[1px] border-[#ccc] border-solid p-5 rounded-[6px] mt-[25vh]">
      <Form
        name="otp_confirmation"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 20,
        }}
        autoComplete="off"
      >
        <div className="text-center">
          <img src={LOGO} alt="logo" width={100} height={35} />
        </div>
        <p className="font-bold text-center text-[20px] mb-5">Xác nhận mã OTP</p>
        <p className="font-medium text-center text-[15px] mb-5">
          (Mã được gửi đến SĐT của bạn. Vui lòng nhập mã để đăng nhập vào tài khoản)
        </p>
        <Form.Item
          label="Mã OTP"
          name="otp"
          labelAlign="left"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mã OTP!',
            },
          ]}
        >
          <div className="flex justify-center space-x-2">
            {otp.map((value, index) => (
              <input
                autoFocus={index === 0}
                key={index}
                className="w-10 h-10 text-center border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                type="number"
                maxLength="1"
                value={value}
                ref={(input) => (inputRefs.current[index] = input)}
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => {
                  handleKeyDown(e, index);
                }}
              />
            ))}
          </div>
        </Form.Item>

        <Button className="mt-4 h-[40px]" block type="primary" loading={loading} onClick={handleOTPSubmit} htmlType="submit">
          Xác nhận
        </Button>

        <div className="w-full mt-8 text-center">
          <p className='pb-[15px]'>Bạn vẫn chưa nhận được mã ? </p>
          <Link
            className="mt-2 w-[150px]"
            block
            style={{ width: 160, textAlign: 'center', background: 'transparent', border: 'none', outline: 'none' }}
            type="default"
            onClick={handleResendOTP}
            disabled={resendButtonDisabled}
          >
            {resendButtonDisabled ? `Gửi lại mã sau ${remainingTime} giây` : 'Gửi lại mã'}
          </Link>
        </div>
      </Form>
    </div>
  );
};

export default ConfirmOTP;
