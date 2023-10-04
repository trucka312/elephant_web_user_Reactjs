import { Button, Col, Form, Input, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import LOGO from '../../assets/images/logo.svg';
import { useAuthStore } from '../../store/authStore';
import { alerts } from '../../utils/alerts';
import FacebookIcon from '../../assets/icons/FacebookIcon.jsx';
import GoogleIcon from '../../assets/icons/GoogleIcon.jsx';
import { setToken } from '../../utils/auth.js';
import { PATH } from '../../constants/paths';

const LoginByPass = () => {
  const navigate = useNavigate();

  const { login, loading } = useAuthStore((state) => state);

  const onSubmit = (value) => {
    const onSuccess = (response) => {
      setToken(response.token);
      navigate(PATH.HOME);
    };
    const onFail = (error) => {
      alerts.error(error?.response?.data?.msg);
    };
    const params = {
      is_otp: false,
      ...value
    }
    login(params, onSuccess, onFail);
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
    <Row className="w-[900px] mx-auto  p-5 rounded-[6px] mt-[20vh] flex shadow-2xl">
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
            <h1 className="font-medium text-center">Đăng nhập</h1>
          </div>
          <p className="font-medium text-center text-[15px] mb-8 mt-5">
            Xin chào, vui lòng nhập số điện thoại và mật khẩu
          </p>

          {/* sdt */}
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
            />
          </Form.Item>

          {/* password */}
          <Form.Item
            label="Mật khẩu"
            name="password"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu !',
              },
            ]}
            sx={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}
          >
            <Input style={{ height: 40 }} placeholder="Mật khẩu" type="password" />
          </Form.Item>

          <div className="text-end mt-[20px] mb-[15px]">
            <Link to="/forgot_password">Quên mật khẩu</Link>
          </div>

          <Button className="mt-4 mb-5 h-[40px]" block type="primary" htmlType="submit" loading={loading}>
            Đăng nhập
          </Button>

          {/* authentization */}
          <div className="mt-4 mb-2 text-center">
            <div className="flex justify-between">
              <div className="h-[1px] w-full bg-[#dbdbdbdb] flex-1 mt-[12px]"></div>
              <div className="px-[6px]">Hoặc tham gia với</div>
              <div className="h-[1px] w-full bg-[#dbdbdbdb] flex-1 mt-[12px]"></div>
            </div>

            <div className="flex justify-center space-x-4 mt-[20px]">
              <Link to="#">
                <FacebookIcon />
              </Link>

              <Link to="#">
                <GoogleIcon />
              </Link>
            </div>
          </div>
        </Form>
      </Col>
    </Row>
  );
};

export default LoginByPass;
