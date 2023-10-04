import { Button, Col, Form, Input, Row } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import LOGO from '../../assets/images/logo.svg';
import { useAuthStore } from '../../store/authStore';
import { alerts } from '../../utils/alerts';
import FacebookIcon from '../../assets/icons/FacebookIcon.jsx';
import GoogleIcon from '../../assets/icons/GoogleIcon.jsx';
import { PATH } from '../../constants/paths';
import { useState } from 'react';

const Register = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { UpdateAcountAfterRegister, loading } = useAuthStore((state) => state);

  const onSubmit = (value) => {
    if (password !== confirmPassword) {
      alerts.error('Mật khẩu nhập lại không khớp với mật khẩu đã nhập!');
      return;
    } else {
      const onSuccess = () => {
        navigate(PATH.HOME);
        alerts.success('Đăng nhập thành công')
      };
      const onFail = (error) => {
        alerts.error(error?.response?.data?.msg);
      };

      UpdateAcountAfterRegister(value, onSuccess, onFail);
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
          <div className="flex items-center justify-center my-5">
            <h1 className="font-medium text-center">Tạo tài khoản</h1>
          </div>

          {/* sdt */}
          <Form.Item
            label="Họ và tên"
            name="name"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu !',
              },
            ]}
            sx={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}
          >
            <Input autoComplete="off" style={{ height: 40 }} placeholder="Họ và tên" type="text" />
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
              {
                min: 6,
                message: 'Mật khẩu bao gồm ít nhất 6 kí tự'
              }
            ]}
            sx={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}
          >
            <Input
              style={{ height: 40}}
              autoComplete="new-password"
              placeholder="Mật khẩu"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Input
            style={{ height: 40, width: '75%', marginLeft: '25%' }}
            placeholder="Nhập lại mật khẩu"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button className="mt-4 mb-5 h-[40px]" block type="primary" htmlType="submit" loading={loading}>
            Tạo tài khoản
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

export default Register;
