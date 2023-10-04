import { useEffect, useRef, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import LOGO from '../../assets/images/logo.svg';
import { PATH } from '../../constants/paths';
import { useAuthStore } from '../../store/authStore';
import { alerts } from '../../utils/alerts';
import { setToken } from '../../utils/auth.js';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { resetPassword, loading, sendOtp } = useAuthStore((state) => state);
  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [resendButtonDisabled, setResendButtonDisabled] = useState(true);
  const [remainingTime, setRemainingTime] = useState(30);
  const phoneNumber = location?.state?.phoneNumber || '';
  const inputRefs = useRef([]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    if (password !== confirmPassword) {
      alerts.error('Mật khẩu nhập lại không khớp với mật khẩu đã nhập!');
      return;
    } else {
      const onSuccess = (response) => {
        setToken(response?.token);
        navigate(PATH.HOME);
        alerts.success('Đăng nhập thành công');
      };

      const onFail = (error) => {
        alerts.error(error?.response?.data?.msg);
      };

      const requestValues = {
        phone_number: phoneNumber,
        otp: otp.join(''),
        password: password,
      };
      resetPassword(requestValues, onSuccess, onFail);
    }
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
    <div className="w-[500px] my-auto mx-auto border-[1px] border-[#ccc] border-solid p-5 rounded-[6px] mt-[15vh]">
      <Form
        onFinish={handleOTPSubmit}
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

        {/* input otp area */}
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
          <div className="flex space-x-2">
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
          </div>
        </Form.Item>

        {/* new password area */}
        <Form.Item
          label="Mật khẩu mới"
          name="password"
          labelAlign="left"
          className="pt-[15px]"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu !',
            },
            {
              min: 6,
              message: 'Mật khẩu phải có ít nhất 6 kí tự!',
            },
          ]}
          sx={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}
        >
          <Input
            className="w-[82%] h-[40px]"
            placeholder="Nhập mật khẩu mới"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        {/* re password area */}
        <Input
          autoComplete="new-password"
          className="h-[40px] w-[61.5%] ml-[25%] my-[15px]"
          placeholder="Nhập lại mật khẩu mới"
          type="password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button className="mt-4 h-[40px]" block type="primary" loading={loading} htmlType="submit">
          Xác nhận
        </Button>

        <div className="w-full mt-8 text-center">
          <p className='pb-[15px]'>Bạn vẫn chưa nhận được mã ? </p>
          <Link
            className=" w-[150px] bg-transparent text-blue-400 border-none"
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

export default ResetPassword;
